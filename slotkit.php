<?php

require_once __DIR__."/includes/plugin/SlotkitPlugin.php";

/*
Plugin Name: Slot Kit
Plugin URI: https://github.com/limikael/slotkit
GitHub Plugin URI: https://github.com/limikael/slotkit
Description: Create slot games for your users.
Version: 0.0.1
*/

function slotkit_activate() {
	SlotkitPlugin::getInstance()->activate();
}

register_activation_hook(__FILE__, "slotkit_activate");

function slotkit_uninstall() {
	SlotkitPlugin::getInstance()->uninstall();
}

register_uninstall_hook(__FILE__, "slotkit_uninstall");

SlotkitPlugin::getInstance();
