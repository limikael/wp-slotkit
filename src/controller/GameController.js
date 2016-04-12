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
	this.updateSpinButtonEnabled();

	this.gameModel.on("stateChange", this.updateSpinButtonEnabled.bind(this));
	this.gameModel.on("displayBalanceChange", this.onDisplayBalanceChange.bind(this));

	this.updateKeypadFields();
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
GameController.prototype.updateSpinButtonEnabled = function() {
	switch (this.gameModel.getState()) {
		case "stopped":
		case "spinResponse":
			this.gameView.setSpinButtonEnabled(true);
			break;

		case "spinStarted":
		case "spinStopping":
			this.gameView.setSpinButtonEnabled(false);
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
 * Update keypad fields.
 */
GameController.prototype.updateKeypadFields = function() {
	var keypad = this.gameView.getKeypadView();

	keypad.setBalance(this.gameModel.getDisplayBalance());
	keypad.setTotalBet(this.gameModel.getTotalBet());
	keypad.setLines(this.gameModel.getUserBetLines());
	keypad.setBet(this.gameModel.getBet());
}