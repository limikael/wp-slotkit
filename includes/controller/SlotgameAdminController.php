<?php

require_once __DIR__."/../utils/Singleton.php";

use slotkit\Singleton;

/**
 * Admin controller for custom posttype.
 */
class SlotgameAdminController extends Singleton {

	/**
	 * Constructor.
	 */
	protected function __construct() {
	}

	/**
	 * Set up meta boxes.
	 */
	public function rwmbMetaBoxes($metaBoxes) {
		$metaBoxes[]=array(
			"title"=>"Rules",
			"post_types"=>"slotgame",
			"priority"=>"low",
			"fields"=>array(
				array(
	                'id'   => 'rules',
	                'type' => 'select',
	                'name' => "Rules",
	                "options"=>Slotgame::getAvailableRules()
				)
			)
		);

		$metaBoxes[]=array(
			"title"=>"Graphics",
			"post_types"=>"slotgame",
			"priority"=>"low",
			"fields"=>array(
				array(
					"id"=>"backgroundImage",
					"name"=>"Background Image",
					"type"=>"image_advanced",
					"max_file_uploads"=>1,
					"max_status"=>false,
					"desc"=>"This image will appear behind the reels."
				),
				array(
					"id"=>"foregroundImage",
					"name"=>"Foreground Image",
					"type"=>"image_advanced",
					"max_file_uploads"=>1,
					"max_status"=>false,
					"desc"=>"This image will appear in front of the reels. ".
						"It needs to have transparency so the reels are visible."
				),
				array(
					"id"=>"paytableBackgroundImage",
					"name"=>"Paytable Background Image",
					"type"=>"image_advanced",
					"max_file_uploads"=>1,
					"max_status"=>false,
					"desc"=>"This is the image for the paytable dialog."
				),
				array(
					"id"=>"symbolsImage",
					"name"=>"Symbol Sheet Image",
					"type"=>"image_advanced",
					"max_file_uploads"=>1,
					"max_status"=>false,
					"desc"=>"The symbols, in a grid as specified by the rules."
				)
			)
		);


		return $metaBoxes;
	}
}

if (is_admin())
	add_filter("rwmb_meta_boxes",array(SlotgameAdminController::instance(),'rwmbMetaBoxes'));
