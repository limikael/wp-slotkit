<?php

require_once __DIR__."/../model/SlotUser.php";

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
	 * Handle exception
	 */
	public function handleException($e) {
		echo json_encode(array(
			"error"=>$e->getMessage()
		));
		exit;
	}

	/**
	 * The init call.
	 */
	public function init() {
		set_exception_handler(array($this,"handleException"));

		$slotgame=Slotgame::findOne($_REQUEST["id"]);
		if (!$slotgame)
			throw new Exception("Game not found");

		$slotUser=SlotUser::getCurrent();
		if (!$slotUser)
			throw new Exception("Not logged in");

		$response=array();
		$response["baseUrl"]=plugins_url()."/slotkit/";
		$response["balance"]=$slotUser->getBalance("ply");

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
		set_exception_handler(array($this,"handleException"));

		$currency="ply";

		$slotgame=Slotgame::findOne($_REQUEST["id"]);
		if (!$slotgame)
			throw new Exception("Game not found.");

		$slotUser=SlotUser::getCurrent();
		if (!$slotUser)
			throw new Exception("Not logged in");

		$totalBet=$_REQUEST["betLines"]*$_REQUEST["bet"];
		$slotUser->changeBalance($currency,-$totalBet);
		$spinBalance=$slotUser->getBalance($currency);

		$outcome=$slotgame->generateOutcome($_REQUEST["betLines"],$_REQUEST["bet"]);
		$slotUser->changeBalance($currency,$outcome->getTotalWin());

		echo json_encode(array(
			"reels"=>$outcome->getReels(),
			"betLineWins"=>$outcome->getBetLineWins(),
			"balance"=>$slotUser->getBalance($currency),
			"spinBalance"=>$spinBalance
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
