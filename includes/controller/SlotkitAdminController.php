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
	}

	/**
	 * Create settings page.
	 */
	public function create_settings_page() {
		$vars=array();

		$vars["users"]=get_users();

		$t=new Template(__DIR__."/../template/settings.php");
		$t->display($vars);
	}
}