<?php
/*
Plugin Name: Slot Kit
Plugin URI: https://github.com/limikael/slotkit
GitHub Plugin URI: https://github.com/limikael/slotkit
Description: Create slot games for your users.
Version: 0.0.1
*/

function slotkit_slotgame() {
	//wp_enqueue_script("pixi",plugins_url()."/slotkit/bin/pixi.min.js");
	//wp_enqueue_script("slot",plugins_url()."/slotkit/bin/slot.js");
	//wp_enqueue_script("slotkit",plugins_url()."/slotkit/slotkit.js");

	$content="";
	$content.="<div id='slotgame' style='width:100%; height:500px; background:#ff0000; position:relative'></div>\n";
	$content.="<script src='".plugins_url()."/slotkit/bin/pixi.min.js"."'></script>\n";
	$content.="<script src='".plugins_url()."/slotkit/bin/slot.js"."'></script>\n";
	$content.="<script>\n";
	$content.="var options={}\n";
	$content.="options.initUrl='".admin_url("admin-ajax.php")."?action=slotkit_init';\n";
	$content.="var app=new SlotApp(options);\n";
	$content.="app.attachToElement('slotgame');\n";
	$content.="</script>\n";

	return $content;
}

add_shortcode("slotgame","slotkit_slotgame");

function slotkit_spin() {
	sleep(1);
	echo json_encode(array(
		"reels"=>array(
			array(1,2,3),
			array(2,3,4),
			array(3,4,5),
			array(4,5,6),
			array(5,6,7)
		),
		"betLineWins"=>array(
			array(
				"betLine"=>0,
				"numSymbols"=>3,
				"amount"=>123
			),
			array(
				"betLine"=>3,
				"numSymbols"=>5,
				"amount"=>456
			)
		)
	));
	exit;
}

add_action("wp_ajax_slotkit_spin","slotkit_spin");
add_action("wp_ajax_nopriv_slotkit_spin","slotkit_spin");

function slotkit_init() {
	echo json_encode(array(
		"spinUrl"=>admin_url("admin-ajax.php")."?action=slotkit_spin",
		"baseUrl"=>plugins_url()."/slotkit/",
		"balance"=>1234
	));
	exit;
}

add_action("wp_ajax_slotkit_init","slotkit_init");
add_action("wp_ajax_nopriv_slotkit_init","slotkit_init");
