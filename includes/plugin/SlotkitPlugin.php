<?php

require_once __DIR__."/../controller/SlotgameAdminController.php";
require_once __DIR__."/../controller/SlotgameController.php";
require_once __DIR__."/../controller/SlotkitAdminController.php";
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

        if (is_admin()) {
            SlotkitAdminController::instance();
        }
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
        $account=bca_user_account(get_option("slotkit_house_user_id"));
        if (!$account)
            throw new Exception("No house account set up");

        return $account;
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
