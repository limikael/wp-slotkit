<?php

/**
 * Handle slotgame related remote calls and pages.
 */
class SlotgameController {

	private static $instance;

	/**
	 * Constructor.
	 */
	private function __construct() {
		add_shortcode("slotgame", array($this, "slotgame"));
		add_action("wp_ajax_slotkit_spin", array($this, "spin"));
		add_action("wp_ajax_nopriv_slotkit_spin", array($this, "spin"));
		add_action("wp_ajax_slotkit_init", array($this, "init"));
		add_action("wp_ajax_nopriv_slotkit_init", array($this, "init"));
	}

	/**
	 * The init call.
	 */
	public function init() {
		$slotgame=Slotgame::findOne($_REQUEST["id"]);
		if (!$slotgame) {
			echo "Game not found.";
			exit;
		}

		$response=array();
		$response["baseUrl"]=plugins_url()."/slotkit/";
		$response["balance"]=15;

		$response["spinUrl"]=
			admin_url("admin-ajax.php").
			"?action=slotkit_spin".
			"&id=".$_REQUEST["id"];

		if ($slotgame->backgroundUrl)
			$response["background"]=$slotgame->backgroundUrl;

		if ($slotgame->foregroundUrl)
			$response["foreground"]=$slotgame->foregroundUrl;

		if ($slotgame->paytableBackgroundUrl)
			$response["paytableBackground"]=$slotgame->paytableBackgroundUrl;

		if ($slotgame->symbolsUrl)
			$response["symbols"]=$slotgame->symbolsUrl;

		$response["betLines"]=$slotgame->getBetLines();
		$response["paytable"]=$slotgame->getPaytable();

		echo json_encode($response);
		exit;
	}

	/**
	 * The spin call.
	 */
	public function spin() {
		//error_log(print_r($_REQUEST,TRUE));

		$slotgame=Slotgame::findOne($_REQUEST["id"]);
		if (!$slotgame)
			exit("Game not found.");

		$outcome=$slotgame->generateOutcome($_REQUEST["betLines"],$_REQUEST["bet"]);

		echo json_encode(array(
			"reels"=>$outcome->getReels(),
			"betLineWins"=>$outcome->getBetLineWins(),
			"balance"=>555,
			"spinBalance"=>1001
		));
		exit;
	}

	/**
	 * Handle the slotgame shortcode.
	 */
	public function slotgame($params) {
		$slotgame=Slotgame::findOne($params["id"]);
		if (!$slotgame)
			return "Game not found, id=".$params["id"];

		wp_enqueue_script("bundleloader",plugins_url()."/slotkit/bin/bundleloader.min.js");
		wp_enqueue_script("wpslot",plugins_url()."/slotkit/bin/wpslot.js");

		$content="";
		$content.="<div id='slotgame' style='width:100%; height:1px; position:relative'></div>\n";
		$content.="<script>\n";
		$content.="SLOTKIT_BASEURL='".plugins_url()."/slotkit/'\n";
		$content.="SLOTKIT_INITURL='".
			admin_url("admin-ajax.php").
			"?action=slotkit_init&id=".
			$params["id"]."';\n";
		$content.="</script>\n";

		return $content;
	}

	/**
	 * Get singleton instance.
	 */
	public static function getInstance() {
		if (!SlotgameController::$instance)
			SlotgameController::$instance=new SlotgameController();

		return SlotgameController::$instance;
	}
}
