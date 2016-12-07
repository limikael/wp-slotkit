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
		add_action("update_option",array($this,"update_option"));
	}		

	/**
	 * Admin init.
	 */
	public function admin_init() {
		register_setting("slotkit","slotkit_house_user_id");
		register_setting("slotkit","slotkit_default_play_money");
	}

	/**
	 * Updated option...
	 */
	public function update_option() {
		static $done=FALSE;

		if ($done)
			return;

		$done=TRUE;

		if (isset($_REQUEST["slotkit_collect_revenue"]) && $_REQUEST["slotkit_collect_revenue"]) {
			wp_clear_scheduled_hook("slotkit_collect_revenue");

			$schedule=$_REQUEST["slotkit_collect_revenue"];
			$schedules=wp_get_schedules();
			if (!$schedules[$schedule])
				throw new Exception("Unknown schedule");

            wp_schedule_event(
                time()+$schedules[$schedule]["interval"],
                $_REQUEST["slotkit_collect_revenue"],
                "slotkit_collect_revenue"
            );
		}
	}

	/**
	 * Create settings page.
	 */
	public function create_settings_page() {
		$vars=array();

		if (isset($_REQUEST["action"]) && $_REQUEST["action"]=="collect")
			RevenueController::instance()->collectAll();

		$currencies=SlotkitPlugin::instance()->getAvailableCurrencies();
		if (in_array("btc",$currencies)) {
			$vars["showBitcoinAccounts"]=TRUE;

			$houseAccount=SlotkitPlugin::instance()->getHouseAccount("btc");
			$vars["bitcoinHouseBalance"]=$houseAccount->getBalance("btc");
			$vars["bitcoinHouseAddress"]=$houseAccount->getDepositAddress();
			$vars["bitcoinHouseUrl"]=$houseAccount->getAdminUrl();

			$revenueAccount=SlotkitPlugin::instance()->getRevenueAccount("btc");
			$vars["bitcoinRevenueBalance"]=$revenueAccount->getBalance("btc");
			$vars["bitcoinRevenueAddress"]=$revenueAccount->getDepositAddress();
			$vars["bitcoinRevenueUrl"]=$revenueAccount->getAdminUrl();

			$uncollected=RevenueController::instance()->getCurrentNgr("btc");
			$vars["bitcoinUncollected"]=$uncollected;

			$nextTime=wp_next_scheduled("slotkit_collect_revenue");
			$vars["bitcoinCollectIn"]=human_time_diff(time(),$nextTime);

			$vars["collectUrl"]=admin_url("options-general.php?page=slotkit_settings&action=collect");
		}

		$vars["collectionShedule"]=wp_get_schedule("slotkit_collect_revenue");

		$t=new Template(__DIR__."/../template/settings.php");
		$t->display($vars);
	}
}