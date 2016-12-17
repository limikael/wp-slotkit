<?php

/*
Plugin Name: Slot Kit
Plugin URI: https://github.com/limikael/wp-slotkit
GitHub Plugin URI: https://github.com/limikael/wp-slotkit
Description: Create slot games for your users.
Version: 0.0.1
*/

define('SLOTKIT_PATH',plugin_dir_path(__FILE__));
define('SLOTKIT_URL',plugins_url('',__FILE__));

require_once __DIR__."/includes/plugin/SlotkitPlugin.php";

if (!defined("RWMB_URL")) {
	define("RWMB_URL",SLOTKIT_URL."/ext/meta-box/");
	require_once __DIR__."/ext/meta-box/meta-box.php";
}

function slotkit_activate() {
	SlotkitPlugin::instance()->activate();
}

register_activation_hook(__FILE__, "slotkit_activate");

function slotkit_uninstall() {
	SlotkitPlugin::instance()->uninstall();
}

register_uninstall_hook(__FILE__, "slotkit_uninstall");

SlotkitPlugin::instance();

add_filter( 'widget_text', 'shortcode_unautop');
add_filter( 'widget_text', 'do_shortcode');

if (class_exists("WP_CLI")) {
	require_once __DIR__."/includes/controller/SlotSimulationController.php";

	WP_CLI::add_command("slotsimulation",array(SlotSimulationController::instance(),'slotsimulation'));
}
