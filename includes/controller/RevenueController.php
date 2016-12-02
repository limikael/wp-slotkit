<?php

require_once __DIR__."/../utils/Singleton.php";

use slotkit\Singleton;

/**
 * Run simulations.
 */
class RevenueController extends Singleton {

	/**
	 * Constructor.
	 */
	public function __construct() {
		add_action('slotkit_collect_revenue',array($this,'collectApplicable'));			
	}

	/**
	 * Set aside funds from the house account to
	 * the ngr account.
	 * TODO: There is a possibility for a race condition here.
	 */
	public function collectNgr($currency) {
		$ngr=$this->getCurrentNgr($currency);
		if ($ngr<=0)
			return;

		$time=time();

		$houseAccount=SlotkitPlugin::instance()->getHouseAccount($currency);
		$revenueAccount=SlotkitPlugin::instance()->getRevenueAccount($currency);

		bca_make_transaction($currency,$houseAccount,$revenueAccount,$ngr,array(
			"notice"=>"Collect revenue"
		));

		update_option("slotkit_revenue_collected_".$currency,$time);
	}

	/**
	 * Get current ngr, since it was last collected.
	 */
	public function getCurrentNgr($currency) {
		$account=SlotkitPlugin::instance()->getHouseAccount($currency);
		$transactions=$account->getTransactions(array(
			"newerThan"=>get_option("slotkit_revenue_collected_".$currency)
		));

		$total=0;
		foreach ($transactions as $transaction) {
			if (in_array(
					$transaction->getNotice(),
					array("Spin","Win"))) {
				$amount=$transaction->getAmountForAccount($currency,$account);
				$total+=$amount;
			}
		}

		return $total;
	}

	/**
	 * Get last time funds were moved to the revenue account.
	 */
	public function getLastCollectionTime($currency) {
		$t=get_option("slotkit_revenue_collected_".$currency);
		if (!$t)
			$t=0;

		return $t;
	}

	/**
	 * Get currencies that should be set aside for moving to
	 * the revenue account.
	 */
	public function getCollectibleCurrencies() {
		$currencies=array();

		$available=SlotkitPlugin::instance()->getAvailableCurrencies();
		if (in_array("btc",$available))
			$currencies[]="btc";

		return $currencies;
	}

	/**
	 * When is the next time to collect revenue?
	 */
	public function getNextCollectionTime($currency) {
		$delta=0;
		switch (SlotkitPlugin::instance()->getRevenueCollectionSchedule()) {
			case "daily":
				$delta=24*60*60;
				break;

			case "weekly":
				$delta=7*24*60*60;
				break;

			case "monthly":
				$delta=30*7*24*60*60;
				break;

			default:
				throw new Exception("Unknown collection schedule");
		}

		$last=get_option("slotkit_revenue_collected_".$currency);
		$next=$last+$delta;

		return $next;
	}

	/**
	 * Is it time to collect this currency?
	 */
	public function isTimeToCollect($currency) {
		if (time()>=$this->getNextCollectionTime())
			return TRUE;

		return FALSE;
	}

	/**
	 * Collect revenue for applicable currencies.
	 * This should be run on a cron.
	 */
	public function collectApplicable() {
		$currencies=$this->getCollectibleCurrencies();

		foreach ($currencies as $currency)
			if ($this->isTimeToCollect($currency))
				$this->collectNgr($currency);
	}

	/**
	 * Collect revenue for all currencies.
	 */
	public function collectAll() {
		$currencies=$this->getCollectibleCurrencies();

		foreach ($currencies as $currency)
			$this->collectNgr($currency);
	}
}