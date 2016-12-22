<?php

/**
 * A game outcome.
 */
class SlotgameOutcome {

	private $reels;
	private $bet;
	private $lines;
	private $betLineWins;

	/**
	 * Create an outcome.
	 */
	public function __construct($slotgame, $numBetLines, $bet) {
		$this->slotgame=$slotgame;
		$this->bet=$bet;
		$this->numBetLines=$numBetLines;

		if ($numBetLines>sizeof($this->slotgame->getBetLines()))
			throw new Exception("Too many bet lines");

		$this->generateShuffledReels();
	}

	/**
	 * Get total bet.
	 */
	public function getTotalBet() {
		return $this->bet*$this->numBetLines;
	}

	/**
	 * Generate shuffled reels.
	 */
	private function generateShuffledReels() {
		$symbols=range(0,$this->slotgame->getNumSymbols()-1);
		$this->reels=array();
		for ($reelIndex=0; $reelIndex<$this->slotgame->getNumReels(); $reelIndex++) {
			$reel=array();

			shuffle($symbols);
			for ($rowIndex=0; $rowIndex<$this->slotgame->getNumRows(); $rowIndex++)
				$reel[]=$symbols[$rowIndex];

			$this->reels[]=$reel;
		}

		$this->checkBetLines();
	}

	/**
	 * Set reels (for faked outcome).
	 */
	public function setReels($reels) {
		if (sizeof($reels)!=$this->slotgame->getNumReels())
			throw new Exception("Wrong number of reels");

		if (sizeof($reels[0])!=$this->slotgame->getNumRows())
			throw new Exception("Wrong number of rows");

		$this->reels=$reels;
		$this->checkBetLines();
	}

	/**
	 * Check winning bet lines.
	 */
	private function checkBetLines() {
		$this->betLineWins=array();
		for ($i=0; $i<$this->numBetLines; $i++)
			$this->checkBetLine($i);
	}

	/**
	 * Check a betline by index.
	 */
	private function checkBetLine($betLineIndex) {
		$paytable=$this->slotgame->getPaytable();
		$betLines=$this->slotgame->getBetLines();
		$betLine=$betLines[$betLineIndex];

		$numSymbols=0;
		$foundNonMatching=FALSE;
		$sym=$this->reels[0][$betLine[0]];
		for ($i=0; $i<$this->slotgame->getNumReels(); $i++) {
			if ($this->reels[$i][$betLine[$i]]!=$sym)
				$foundNonMatching=TRUE;

			if (!$foundNonMatching)
				$numSymbols=($i+1);
		}

		if ($paytable[$sym][$numSymbols-1]) {
			$this->betLineWins[]=array(
				"betLine"=>$betLineIndex,
				"numSymbols"=>$numSymbols,
				"amount"=>$this->bet*$paytable[$sym][$numSymbols-1]
			);
		}
	}

	/**
	 * Get total win.
	 */
	public function getTotalWin() {
		$win=0;

		foreach ($this->betLineWins as $betLineWin)
			$win+=$betLineWin["amount"];

		return $win;
	}

	/**
	 * Get bet line wins.
	 */
	public function getBetLineWins() {
		return $this->betLineWins;
	}

	/**
	 * Get reels.
	 */
	public function getReels() {
		return $this->reels;
	}
}