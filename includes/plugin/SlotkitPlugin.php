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
}
