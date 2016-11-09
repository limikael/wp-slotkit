<?php

/**
 * A game outcome.
 */
class SlotgameOutcome {

	private $reels;
	private $betLineWins;

	/**
	 * Create an outcome.
	 */
	public function __construct($slotgame) {
		$this->slotgame=$slotgame;

		$symbols=range(0,$this->slotgame->getNumSymbols()-1);
		$this->reels=array();
		for ($reelIndex=0; $reelIndex<$this->slotgame->getNumReels(); $reelIndex++) {
			$reel=array();
			shuffle($symbols);
			for ($rowIndex=0; $rowIndex<$this->slotgame->getNumRows(); $rowIndex++)
				$reel[]=$symbols[$rowIndex];

			$this->reels[]=$reel;
		}

		$this->betLineWins=array();
		for ($i=0; $i<sizeof($this->slotgame->getBetLines()); $i++)
			$this->checkBetLine($i);
	}

	/**
	 * Check a betline by index.
	 */
	private function checkBetLine($betLineIndex) {
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

		if ($numSymbols>=3) {
			$this->betLineWins[]=array(
				"betLine"=>$betLineIndex,
				"numSymbols"=>$numSymbols,
				"amount"=>1
			);
		}
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