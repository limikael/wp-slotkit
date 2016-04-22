<?php
/*
Plugin Name: Slot Kit
Plugin URI: https://github.com/limikael/slotkit
GitHub Plugin URI: https://github.com/limikael/slotkit
Description: Create slot games for your users.
Version: 0.0.1
*/

function slotkit_slotgame() {
	wp_enqueue_script("bundleloader",plugins_url()."/slotkit/bin/bundleloader.min.js");
	wp_enqueue_script("wpslot",plugins_url()."/slotkit/bin/wpslot.js");

	$content="";
	$content.="<div id='slotgame' style='width:100%; height:500px; position:relative'></div>\n";
	$content.="<script>\n";
	$content.="SLOTKIT_BASEURL='".plugins_url()."/slotkit/'\n";
	$content.="SLOTKIT_INITURL='".admin_url("admin-ajax.php")."?action=slotkit_init';\n";
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
		),
		"balance"=>555,
		"spinBalance"=>1001
	));
	exit;
}

add_action("wp_ajax_slotkit_spin","slotkit_spin");
add_action("wp_ajax_nopriv_slotkit_spin","slotkit_spin");

function slotkit_init() {
	echo json_encode(array(
		"spinUrl"=>admin_url("admin-ajax.php")."?action=slotkit_spin",
		"baseUrl"=>plugins_url()."/slotkit/",
		"balance"=>15
	));
	exit;
}

add_action("wp_ajax_slotkit_init","slotkit_init");
add_action("wp_ajax_nopriv_slotkit_init","slotkit_init");
