var Thenable = require("tinp");

/**
 * Game controller.
 */
function GameController(options, gameView, gameModel) {
	this.options = options;
	this.gameView = gameView;
	this.gameModel = gameModel;

	for (var i = 0; i < this.options.numReels; i++)
		this.gameView.getReelViewAt(i).setSymbols(this.gameModel.getReelSymbols(i));

	this.gameView.on("spinButtonClick", this.onGameViewSpinButtonClick, this);
	this.gameView.on("selectedBetLineChange", this.onSelectedBetLineChange, this);
	this.updateKeypadButtonsEnabled();

	this.gameModel.on("stateChange", this.updateKeypadButtonsEnabled.bind(this));
	this.gameModel.on("displayBalanceChange", this.onDisplayBalanceChange.bind(this));
	this.gameModel.on("betChange", this.onBetChange.bind(this));

	var keypadView = this.gameView.getKeypadView();
	keypadView.on("linesIncButtonClick", function() {
		if (this.gameModel.getState() == "stopped")
			this.gameModel.setUserBetLines(this.gameModel.getUserBetLines() + 1);
	}.bind(this));

	keypadView.on("linesDecButtonClick", function() {
		if (this.gameModel.getState() == "stopped")
			this.gameModel.setUserBetLines(this.gameModel.getUserBetLines() - 1);
	}.bind(this));

	keypadView.on("betIncButtonClick", function() {
		if (this.gameModel.getState() == "stopped")
			this.gameModel.setBet(this.gameModel.getBet() + this.gameModel.getBetIncrease());
	}.bind(this));

	keypadView.on("betDecButtonClick", function() {
		if (this.gameModel.getState() == "stopped")
			this.gameModel.setBet(this.gameModel.getBet() - this.gameModel.getBetIncrease());
	}.bind(this));

	keypadView.on("paytableButtonClick", function() {
		this.gameView.getPaytableView().toggleShown();
	}.bind(this));

	this.updateKeypadFields();

	var paytableView = this.gameView.getPaytableView();
	paytableView.on("nextButtonClick", function() {
		paytableView.setCurrentPageIndex(paytableView.getCurrentPageIndex() + 1);
	});

	paytableView.on("prevButtonClick", function() {
		paytableView.setCurrentPageIndex(paytableView.getCurrentPageIndex() - 1);
	});

	paytableView.hide();
}

module.exports = GameController;

/**
 * Selected bet line change.
 */
GameController.prototype.onSelectedBetLineChange = function() {
	if (this.gameModel.getState() == "stopped")
		this.gameView.highlightBetLine(this.gameView.getSelectedBetLine());
}

/**
 * Update enabled state of the spin button.
 */
GameController.prototype.updateKeypadButtonsEnabled = function() {
	switch (this.gameModel.getState()) {
		case "stopped":
			this.gameView.setSpinButtonEnabled(true);
			this.gameView.setBetButtonsEnabled(true);
			break;

		case "spinResponse":
			this.gameView.setSpinButtonEnabled(true);
			this.gameView.setBetButtonsEnabled(false);
			break;

		case "spinStarted":
		case "spinStopping":
			this.gameView.setSpinButtonEnabled(false);
			this.gameView.setBetButtonsEnabled(false);
			break;

		default:
			throw new Error("unknown state: " + this.gameModel.getState());
	}
}

/**
 * Game view spin button click.
 */
GameController.prototype.onGameViewSpinButtonClick = function() {
	this.gameView.highlightBetLine(null);

	switch (this.gameModel.getState()) {
		case "stopped":
			this.gameView.getPaytableView().hide();
			this.gameView.getWinView().resetAccumulatedWin();
			for (var i = 0; i < this.options.numReels; i++)
				this.gameView.getReelViewAt(i).startSpin();

			this.stopThenable = new Thenable();

			Thenable.all(
				this.gameModel.spin(),
				Thenable.race(
					this.stopThenable,
					Thenable.delay(this.options.spinDuration)
				)
			).then(this.onSpinComplete.bind(this));
			break;

		case "spinResponse":
			this.stopThenable.resolve();
			this.gameModel.notifySpinStopping();
			break;

		default:
			console.log("spin button has no function in this state: " + this.gameModel.getState());
			break;
	}
}

/**
 * Spin complete.
 */
GameController.prototype.onSpinComplete = function() {
	if (this.gameModel.getState() == "spinResponse")
		this.gameModel.notifySpinStopping();

	var t = [];

	for (var i = 0; i < this.options.numReels; i++)
		t.push(this.gameView.getReelViewAt(i).stopSpin(this.gameModel.getReelSymbols(i)));

	Thenable.all(t).then(function() {
		this.winBetLineIndex = 0;
		this.playBetLineWin();
	}.bind(this));
}

/**
 * Play next bet line win.
 */
GameController.prototype.playBetLineWin = function() {
	if (this.winBetLineIndex >= this.gameModel.getNumWinBetLines()) {
		this.gameModel.notifySpinComplete();
		return;
	}

	var betLineIndex = this.gameModel.getWinBetLineIndex(this.winBetLineIndex);
	this.gameView.highlightBetLine(betLineIndex);

	var winBetLine = this.gameModel.getWinBetLine(this.winBetLineIndex);
	var t = [];

	for (var i = 0; i < winBetLine.length; i++)
		t.push(this.gameView.getSymbolViewAt(i, winBetLine[i]).playBetLineWin());

	var a = this.gameModel.getWinBetLineAmount(this.winBetLineIndex);
	t.push(this.gameView.getWinView().showWin(a));

	var a = this.gameModel.getAccumulatedWinAmount(this.winBetLineIndex);
	this.gameView.getWinView().showAccumulatedWin(a);

	Thenable.all(t).then(function() {
		this.gameView.highlightBetLine(null);
		this.winBetLineIndex++;
		this.playBetLineWin();
	}.bind(this));
}

/**
 * The display balance was changed.
 */
GameController.prototype.onDisplayBalanceChange = function() {
	this.updateKeypadFields();
}

/**
 * Bet change.
 */
GameController.prototype.onBetChange = function() {
	this.updateKeypadFields();
}

/**
 * Update keypad fields.
 */
GameController.prototype.updateKeypadFields = function() {
	var keypad = this.gameView.getKeypadView();

	keypad.setBalance(this.gameModel.getDisplayBalance());
	keypad.setTotalBet(this.gameModel.getTotalBet());
	keypad.setLines(this.gameModel.getUserBetLines());
	keypad.setBet(this.gameModel.getBet());
}