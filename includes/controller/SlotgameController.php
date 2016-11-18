<?php

require_once __DIR__."/../model/SlotUser.php";
require_once __DIR__."/../utils/Template.php";

use slotkit\Template;

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
		add_shortcode("slotkit-ply-balance", array($this, "slotgamePlyBalance"));
		add_action("wp_ajax_slotkit_spin", array($this, "spin"));
		add_action("wp_ajax_nopriv_slotkit_spin", array($this, "spin"));
		add_action("wp_ajax_slotkit_init", array($this, "init"));
		add_action("wp_ajax_nopriv_slotkit_init", array($this, "init"));
	}

	/**
	 * Playmoney balance.
	 */
	public function slotgamePlyBalance() {
		$slotUser=SlotUser::getCurrent();
		if (!$slotUser)
			return "";

		return "<span class='slotkit-ply-balance'>".$slotUser->getBalance("ply")."</span>";
	}

	/**
	 * Handle exception
	 */
	public function handleException($e) {
		http_response_code(500);
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

		$response=array();
		$response["baseUrl"]=plugins_url()."/wp-slotkit/";

		$slotUser=SlotUser::getCurrent();
		if ($slotUser) {
			$response["balance"]=$slotUser->getBalance("ply");
			$currency="ply";

			if ($currency="ply")
				$response["flashMessage"]="PLAYING FOR FUN";
		}

		else {
			$response["flashMessage"]="NOT LOGGED IN";
			$response["balanceText"]="DEMO";
			$currency="none";
		}

		$response["spinUrl"]=
			admin_url("admin-ajax.php").
			"?action=slotkit_spin".
			"&id=".$_REQUEST["id"].
			"&currency=".$currency;

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

		$currency=$_REQUEST["currency"];
		if (!$currency)
			throw new Exception("No currency");

		$slotgame=Slotgame::findOne($_REQUEST["id"]);
		if (!$slotgame)
			throw new Exception("Game not found.");

		$slotUser=SlotUser::getCurrent();
		if (!$slotUser && $currency!="none")
			throw new Exception("Not logged in");

		$totalBet=$_REQUEST["betLines"]*$_REQUEST["bet"];
		$response=array();

		if ($slotUser) {
			$slotUser->changeBalance($currency,-$totalBet);
			$response["spinBalance"]=$slotUser->getBalance($currency);
		}

		$outcome=$slotgame->generateOutcome($_REQUEST["betLines"],$_REQUEST["bet"]);
		$response["reels"]=$outcome->getReels();
		$response["betLineWins"]=$outcome->getBetLineWins();

		if ($slotUser) {
			$slotUser->changeBalance($currency,$outcome->getTotalWin());
			$response["balance"]=$slotUser->getBalance($currency);
		}

		echo json_encode($response);
		exit;
	}

	/**
	 * Handle the slotgame shortcode.
	 */
	public function slotgame($params) {
		$slotgame=Slotgame::findOne($params["id"]);
		if (!$slotgame)
			return "Game not found, id=".$params["id"];

		wp_enqueue_script("bundleloader",plugins_url()."/wp-slotkit/bin/bundleloader.min.js");
		wp_enqueue_script("wpslot",plugins_url()."/wp-slotkit/bin/wpslot.js");

		$view=array();
		$view["currencies"]=array();

		foreach (SlotkitPlugin::instance()->getAvailableCurrencies() as $currency)
			$view["currencies"][]=$currency;

		$view["initUrl"]=admin_url(
			"admin-ajax.php?".
			"action=slotkit_init&".
			"id=".$slotgame->id
		);

		return Template::render(__DIR__."/../template/slotgame.php",$view);
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
