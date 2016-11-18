<?php

require_once __DIR__."/../controller/SlotgameAdminController.php";
require_once __DIR__."/../controller/SlotgameController.php";
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
        SlotgameAdminController::setup();
        SlotgameController::getInstance();
    }

    /**
     * Activate the plugin.
     */
    public function activate() {
        Slotgame::install();
    }

    /**
     * Uninstall the plugin.
     */
    public function uninstall() {
        Slotgame::uninstall();
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
