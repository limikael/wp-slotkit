<?php

require_once __DIR__."/../controller/SlotgameAdminController.php";
require_once __DIR__."/../controller/SlotgameController.php";
require_once __DIR__."/../model/Slotgame.php";

/**
 * The main slotkit plugin class
 */
class SlotkitPlugin {
    private static $instance;

    /**
     * Constructor.
     */
    private function __construct() {
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
     * Get singleton instance.
     */
    public function getInstance() {
        if (!SlotkitPlugin::$instance)
            SlotkitPlugin::$instance=new SlotkitPlugin();

        return SlotkitPlugin::$instance;
    }
}
