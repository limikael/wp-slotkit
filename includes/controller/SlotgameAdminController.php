<?php

require_once __DIR__."/../utils/Singleton.php";
require_once __DIR__."/../model/Tweak.php";

use slotkit\Singleton;

/**
 * Admin controller for custom posttype.
 */
class SlotgameAdminController extends Singleton {

	/**
	 * Constructor.
	 */
	protected function __construct() {
		if (is_admin())
			wp_enqueue_script("slotkit-admin",SLOTKIT_URL."/bin/slotkit-admin.js");
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
			"title"=>"Listing",
			"post_types"=>"slotgame",
			"priority"=>"low",
			"fields"=>array(
				array(
					"id"=>"logoImage",
					"name"=>"Logo Image",
					"type"=>"image_advanced",
					"max_file_uploads"=>1,
					"max_status"=>false,
					"desc"=>"This image will appear in the listing."
				),
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

		$tweaks=Tweak::getAll();
		$tweakOptions=array();
		foreach ($tweaks as $tweak)
			$tweakOptions[$tweak->getFileName()]=$tweak->getName();

		$fields=array();
		$fields[]=array(
            'id'   => 'tweaks',
            'type' => 'select_advanced',
//            'type' => 'select',
            'name' => "Enabled Tweaks",
            "options"=>$tweakOptions,
            "clone"=>TRUE
		);

		$fields[]=array(
			"id"=>"tweakParametersScript",
			"type"=>"custom_html",
			"callback"=>array($this,"tweakParametersScript")
		);

		foreach ($tweaks as $tweak)
			foreach ($tweak->getFieldNames() as $name) {
				$parameters=$tweak->getFieldParameters($name);
				$fields[]=array(
					"id"=>$name,
					"name"=>$parameters["label"],
					"desc"=>$parameters["desc"]
				);
			}

		$metaBoxes[]=array(
			"title"=>"Tweaks",
			"post_types"=>"slotgame",
			"priority"=>"low",
			"fields"=>$fields
		);

		return $metaBoxes;
	}

	function tweakParametersScript() {
		$tweaks=Tweak::getAll();
		$tweakParameters=array();

		foreach ($tweaks as $tweak) {
			$tweakId=$tweak->getFileName();
			$tweakParameters[$tweakId]=array();

			foreach ($tweak->getFieldNames() as $fieldName)
				$tweakParameters[$tweakId][]=$fieldName;
		}

		echo "<script>";
		echo "var SLOTKIT_TWEAK_PARAMETERS=".json_encode($tweakParameters).";";
		echo "</script>";
	}
}

function my_custom_callback() {
//	echo "hello more";
}

if (is_admin())
	add_filter("rwmb_meta_boxes",array(SlotgameAdminController::instance(),'rwmbMetaBoxes'));
