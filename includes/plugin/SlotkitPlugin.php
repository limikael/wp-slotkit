<?php

require_once __DIR__."/../controller/SlotgameAdminController.php";
require_once __DIR__."/../controller/SlotgameController.php";
require_once __DIR__."/../controller/SlotkitAdminController.php";
require_once __DIR__."/../controller/RevenueController.php";
require_once __DIR__."/../model/Slotgame.php";
require_once __DIR__."/../utils/Singleton.php";

use slotkit\Singleton;

/**
 * The main slotkit plugin class
 */
class SlotkitPlugin extends Singleton {

    /**
     * Constructor.
     */
    protected function __construct() {
        SlotgameController::getInstance();
        RevenueController::instance();

        if (is_admin()) {
            SlotkitAdminController::instance();
        }

        add_filter("cron_schedules",array($this,"addSchedules"));
    }

    /**
     * Add weekly and monthly schedules.
     */
    public function addSchedules($schedules) {
        $schedules['weekly'] = array(
            'interval' => 604800,
            'display' => __('Once Weekly')
        );
        $schedules['monthly'] = array(
            'interval' => 2635200,
            'display' => __('Once a month')
        );
        return $schedules;        
    }

    /**
     * Get default play money.
     */
    public function getDefaultPlayMoney() {
        $defaultPlayMoney=get_option("slotkit_default_play_money");
        if (!$defaultPlayMoney)
            $defaultPlayMoney=1000;

        return $defaultPlayMoney;
    }

    /**
     * Get house blockchain account.
     */
    public function getHouseAccount($currency) {
        switch ($currency) {
            case "ply":
                throw new Exception("No house account for playmoney");
                break;

            case "bits":
            case "btc":
            case "mbtc":
                return bca_entity_account("slotkit-house",1);
                break;
        }
    }

    /**
     * How often should funds be moved from the house account
     * to the revenue account?
     */
    public function getRevenueCollectionSchedule() {
        $v=get_option("slotkit_collect_revenue_schedule");
        if (!$v)
            $v="weekly";

        return $v;
    }

    /**
     * Get revenue account.
     */
    public function getRevenueAccount($currency) {
        switch ($currency) {
            case "ply":
                throw new Exception("No house account for playmoney");
                break;

            case "bits":
            case "btc":
            case "mbtc":
                return bca_entity_account("slotkit-revenue",1);
                break;
        }
    }

    /**
     * Activate the plugin.
     */
    public function activate() {
    }

    /**
     * Uninstall the plugin.
     */
    public function uninstall() {
        wp_clear_scheduled_hook("slotkit_collect_revenue");
    }

    /**
     * Get available game currencies.
     */
    public function getAvailableCurrencies() {
        $currencies=array("ply");

        if (is_plugin_active("wp-crypto-accounts/wp-crypto-accounts.php"))
            $currencies=array_merge($currencies,bca_denominations());

        return $currencies;
    }

    /**
     * Get bet levels to use for the specified currency.
     */
    public function getBetLevels($currency) {
        switch ($currency) {
            case "ply":
            case "none":
                return array(1,2,5,10,20,50,100);
                break;

            case "btc":
                return array(
                    0.00001,0.00002,0.00005,
                    0.0001,0.0002,0.0005,
                    0.001
                );
                break;

            case "mbtc":
                return array(
                    0.01,0.02,0.05,
                    0.1,0.2,0.5,
                    1
                );
                break;

            case "bits":
                return array(
                    10,20,50,
                    100,200,500,
                    1000
                );
                break;

            default:
                throw new Exception("No bet levels for currency: "+$currency);
        }

    }
}
