<?php

require_once __DIR__."/../../ext/wprecord/WpRecord.php";
require_once __DIR__."/SlotgameOutcome.php";

/**
 * Represents a database record for each slotgame.
 */
class Slotgame extends WpRecord {

	/**
	 * Initialize fields.
	 */
	public static function initialize() {
		self::field("id","integer not null auto_increment");
		self::field("name","varchar(255) not null");
		self::field("backgroundUrl","varchar(255) not null");
		self::field("foregroundUrl","varchar(255) not null");
		self::field("paytableBackgroundUrl","varchar(255) not null");
		self::field("symbolsUrl","varchar(255) not null");
		self::field("rules","varchar(255) not null");
	}

	/**
	 * Get bet lines.
	 */
	public function getBetLines() {
		switch ($this->rules) {
			case 'default':
				return array(
					array(1, 1, 1, 1, 1), array(0, 0, 0, 0, 0),
					array(2, 2, 2, 2, 2), array(0, 1, 2, 1, 0),
					array(2, 1, 0, 1, 2), array(0, 0, 1, 0, 0),
					array(2, 2, 1, 2, 2), array(1, 2, 2, 2, 1),
					array(1, 0, 0, 0, 1), array(1, 0, 1, 0, 1),
					array(1, 2, 1, 2, 1), array(0, 1, 0, 1, 0),
					array(2, 1, 2, 1, 2), array(1, 1, 0, 1, 1),
					array(1, 1, 2, 1, 1), array(0, 1, 1, 1, 0),
					array(2, 1, 1, 1, 2), array(0, 1, 2, 2, 2),
					array(2, 1, 0, 0, 0), array(0, 2, 0, 2, 0)
				);
				break;

			case 'oneLine':
				return array(
					array(1,1,1,1,1)
				);
				break;

			default:
				throw new Exception("Unknown rules");
				break;
		}
	}

	/**
	 * Get number of bet lines.
	 */
	public function getNumBetLines() {
		$betLines=$this->getBetLines();
		return sizeof($betLines);
	}

	/**
	 * Get number of reels.
	 */
	public function getNumReels() {
		return 5;
	}

	/**
	 * Get number of rows.
	 */
	public function getNumRows() {
		return 3;
	}

	/**
	 * Get number of symbols.
	 */
	public function getNumSymbols() {
		return 9;
	}

	/**
	 * Generate an outcome.
	 */
	public function generateOutcome($numBetLines, $bet) {
		return new SlotgameOutcome($this,$numBetLines,$bet);
	}

	/**
	 * Return slug=>name array of rules.
	 */
	public static function getAvailableRules() {
		return array(
			"default"=>"Standard (5 reels, 3 rows, 3x3 symbol sheet, 20 betlines)",
			"oneLine"=>"One bet line (5 reels, 3 rows, 3x3 symbol sheet, 1 betline)",
		);
	}

	/**
	 * Get paytable.
	 */
	public function getPaytable() {
		switch ($this->rules) {
			case 'default':
				return array(
					array(0,0,30,150,1000), array(0,0,30,150,1000),
					array(0,0,30,150,1000),

					array(0,0,40,200,1500), array(0,0,40,200,1500),
					array(0,0,40,200,1500),

					array(0,0,50,250,2500), array(0,0,50,250,2500),
					array(0,0,50,250,2500)
				);
				break;

			case 'oneLine':
				return array(
					array(0,0,1,2,3), array(0,0,1,2,3),
					array(0,0,1,2,3), array(0,0,1,2,3),
					array(0,0,1,2,3), array(0,0,1,2,3),
					array(0,0,1,2,3), array(0,0,1,2,3),
					array(0,0,1,2,3)
				);
				break;

			default:
				throw new Exception("Unknown rules: ".$this->rules);
		}
	}
}
