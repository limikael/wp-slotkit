module.exports = {
	baseUrl: "",
	background: "res/background.png",
	foreground: "res/foreground.png",
	symbolFormat: "res/symbols/sym#.png",
	buttonHighlight: "res/highlight.png",
	paytableBackground: "res/paytable.png",
	spinButtonPosition: [512, 480],
	betIncPosition: [765, 484],
	betDecPosition: [600, 484],
	linesFieldPosition: [336, 483],
	betFieldPosition: [684, 483],
	balanceFieldPosition: [884, 456],
	totalBetFieldPosition: [884, 525],
	linesIncPosition: [418, 484],
	linesDecPosition: [254, 484],
	paytableButtonPosition: [140, 482],
	paytableOffset: [100, 75],
	paytableRowSpacing: 150,
	paytableColSpacing: 300,
	paytablePrevButtonPosition: [416, 367],
	paytableNextButtonPosition: [603, 367],
	paytablePageFieldPosition: [510, 367],
	reelSpacing: 171,
	rowSpacing: 120,
	gridOffset: [165, 105],
	numReels: 5,
	numRows: 3,
	numSymbols: 9,
	reelSpeed: 1000,
	numRandomSymbols: 3,
	reelDelay: 200,
	spinDuration: 3000,
	winFieldX: 1024 / 2,
	winFieldY: 200,
	winPlateX: 1024 / 2,
	winPlateY: 340,
	betLineButtonsLeft: 50,
	betLineButtonsRight: 970,
	betLineButtonsTop: 70,
	betLineButtonsDistance: 35,
	minBet: 1,
	maxBet: 10,
	betIncrease: 1,
	betLines: [
		[1, 1, 1, 1, 1],
		[0, 0, 0, 0, 0],
		[2, 2, 2, 2, 2],
		[0, 1, 2, 1, 0],
		[2, 1, 0, 1, 2],
		[0, 0, 1, 0, 0],
		[2, 2, 1, 2, 2],
		[1, 2, 2, 2, 1],
		[1, 0, 0, 0, 1],
		[1, 0, 1, 0, 1],
		[1, 2, 1, 2, 1],
		[0, 1, 0, 1, 0],
		[2, 1, 2, 1, 2],
		[1, 1, 0, 1, 1],
		[1, 1, 2, 1, 1],
		[0, 1, 1, 1, 0],
		[2, 1, 1, 1, 2],
		[0, 1, 2, 2, 2],
		[2, 1, 0, 0, 0],
		[0, 2, 0, 2, 0]
	],
	paytable: {
		"0": [1, 2, 4]
	}
};