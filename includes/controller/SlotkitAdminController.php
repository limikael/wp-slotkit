<?php

require_once __DIR__."/../utils/Singleton.php";
require_once __DIR__."/../utils/Template.php";

use slotkit\Singleton;
use slotkit\Template;

/**
 * Admin controller
 */
class SlotkitAdminController extends Singleton {

	/**
	 * Constructor.
	 */
	protected function __construct() {
		add_action('admin_menu',array($this,'admin_menu'));
	}

	/**
	 * Add settings page
	 */
	public function admin_menu() {
		// This page will be under "Settings"
		add_options_page(
			'Slotkit Settings',
			'Slotkit Settings',
			'manage_options', 
			'slotkit_settings',
			array($this,'create_settings_page')
		);

		add_action('admin_init',array($this,'admin_init'));			
	}		

	/**
	 * Admin init.
	 */
	public function admin_init() {
		register_setting("slotkit","slotkit_house_user_id");
		register_setting("slotkit","slotkit_default_play_money");
		register_setting("slotkit","slotkit_collect_revenue_schedule");
	}

	/**
	 * Create settings page.
	 */
	public function create_settings_page() {
		$vars=array();

		if (isset($_REQUEST["action"]) && $_REQUEST["action"]=="collect")
			RevenueController::instance()->collectAll();

		$vars["users"]=get_users();

		$currencies=SlotkitPlugin::instance()->getAvailableCurrencies();
		if (in_array("btc",$currencies)) {
			$vars["showBitcoinAccounts"]=TRUE;

			$houseAccount=SlotkitPlugin::instance()->getHouseAccount("btc");
			$vars["bitcoinHouseBalance"]=$houseAccount->getBalance("btc");
			$vars["bitcoinHouseAddress"]=$houseAccount->getDepositAddress();

			$revenueAccount=SlotkitPlugin::instance()->getRevenueAccount("btc");
			$vars["bitcoinRevenueBalance"]=$revenueAccount->getBalance("btc");
			$vars["bitcoinRevenueAddress"]=$revenueAccount->getDepositAddress();

			$uncollected=RevenueController::instance()->getCurrentNgr("btc");
			$vars["bitcoinUncollected"]=$uncollected;

			$nextTime=RevenueController::instance()->getNextCollectionTime("btc");
			$t=time();
			if ($t>$nextTime)
				$t=$nextTime;

			$vars["bitcoinCollectIn"]=human_time_diff($t,$nextTime);
			$vars["collectUrl"]=admin_url("options-general.php?page=slotkit_settings&action=collect");
		}

		$vars["collectionShedule"]=SlotkitPlugin::instance()->getRevenueCollectionSchedule();

		$t=new Template(__DIR__."/../template/settings.php");
		$t->display($vars);
	}
}