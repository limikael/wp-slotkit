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
		add_action('slotkit_collect_revenue',array($this,'collectAll'));

        if (!wp_next_scheduled("slotkit_collect_revenue")) {
            wp_schedule_event(
                time(),
                "weekly",
                "slotkit_collect_revenue"
            );
        }
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
	 * Collect revenue for all currencies.
	 */
	public function collectAll() {
		$currencies=$this->getCollectibleCurrencies();

		foreach ($currencies as $currency)
			$this->collectNgr($currency);
	}
}