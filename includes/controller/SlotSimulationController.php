<?php

require_once __DIR__."/../utils/Singleton.php";
require_once __DIR__."/../model/Slotgame.php";

use slotkit\Singleton;

/**
 * Run simulations.
 */
class SlotSimulationController extends Singleton {

	/**
	 * Handle exception while doing simulation.
	 */
	function handleException($exception) {
		WP_CLI::error($exception->getMessage());
	}

	/**
	 * Run the simulation.
	 */
	public function slotsimulation($args, $params) {
		set_exception_handler(array($this,"handleException"));

		if (sizeof($args)!=1)
			throw new Exception("Usage: slotsimulation <game-id>");

		$slotgame=Slotgame::findOne($args[0]);
		if (!$slotgame)
			throw new Exception("Slotgame not found");

		$numsim=1000;
		if (isset($params["numsim"]))
			$numsim=$params["numsim"];

		WP_CLI::log("Running ".$numsim." simulations...");

		$numBetLines=$slotgame->getNumBetLines();
		$totalBet=0;
		$totalWin=0;
		for ($i=0; $i<$numsim; $i++) {
			$outcome=$slotgame->generateOutcome($numBetLines,1);
			$totalBet+=$outcome->getTotalBet();
			$totalWin+=$outcome->getTotalWin();
		}

		WP_CLI::log("Total bet:    ".$totalBet);
		WP_CLI::log("Total win:    ".$totalWin);
		WP_CLI::log("Payout:       ".round($totalWin/$totalBet*100)."%");
	}
}