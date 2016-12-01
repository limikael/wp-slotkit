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
		add_shortcode("slotkit-refill-ply-link", array($this, "refillPlyShortcode"));
		add_shortcode("slotkit-ply-balance", array($this, "slotgamePlyBalance"));
		add_shortcode("slotkit-list-games", array($this, "listGames"));
		add_action("wp_ajax_slotkit_refill_ply", array($this, "refillPly"));
		add_action("wp_ajax_nopriv_slotkit_refill_ply", array($this, "refillPly"));
		add_action("wp_ajax_slotkit_spin", array($this, "spinRequest"));
		add_action("wp_ajax_nopriv_slotkit_spin", array($this, "spinRequest"));
		add_action("wp_ajax_slotkit_init", array($this, "initRequest"));
		add_action("wp_ajax_nopriv_slotkit_init", array($this, "initRequest"));

		add_action('get_template_part_template-parts/content',array($this,"templatePartContent"));
		add_action('init',array($this,'init'));
	}

	/**
	 * Init.
	 */
	public function init() {
		register_post_type("slotgame",array(
			"labels"=>array(
				"name"=>"Slotgames",
				"singular_name"=>"Slotgame",
				"not_found"=>"No slotgames found.",
				"add_new_item"=>"Add new Slotgame",
				"edit_item"=>"Edit Slotgame",
			),
			"public"=>true,
			"has_archive"=>true,
			"supports"=>array("title","excerpt"),
			"show_in_nav_menus"=>false
		));
	}

	/**
	 * Refill playmoney.
	 */
	public function refillPly() {
		$slotUser=SlotUser::getCurrent();
		if (!$slotUser)
			throw new Exception("Not logged in");

		$slotUser->refillPlayMoney();

		header("Location: ".$_REQUEST["redirect"]);
		exit;
	}

	/**
	 * Refill playmoney.
	 */
	public function refillPlyShortcode() {
		$back=urlencode($_SERVER["REQUEST_URI"]);
		$link=admin_url("admin-ajax.php?action=slotkit_refill_ply&redirect=$back");

		return "<a href='".$link."'>refill</a>";
	}

	/**
	 * List available games.
	 */
	public function listGames() {
		wp_enqueue_style("slotkit",SLOTKIT_URL."/slotkit.css");

		$template=new Template(__DIR__."/../template/slotgame-listing.php");
		$output="";

		foreach (Slotgame::findAllPublished() as $slotgame) {
			$slotgameView=array(
				"title"=>$slotgame->getPost()->post_title,
				"description"=>$slotgame->getPost()->post_excerpt,
				"image"=>SLOTKIT_URL."/res/slot.jpg",
				"url"=>get_permalink($slotgame->getId())
			);

			if ($slotgame->getMetaImage("logoImage"))
				$slotgameView["image"]=$slotgame->getMetaImage("logoImage","40x40");

			$view=array(
				"slotgame"=>$slotgameView
			);

			$output.=$template->render($view);
		}

		return $output;
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
	public function initRequest() {
		set_exception_handler(array($this,"handleException"));

		if (!$_REQUEST["currency"])
			throw new Exception("Currency not specified");

		$currency=$_REQUEST["currency"];

		$slotgame=Slotgame::findOneById($_REQUEST["id"]);
		if (!$slotgame)
			throw new Exception("Game not found");

		$response=array();
		$response["baseUrl"]=SLOTKIT_URL."/";

		$slotUser=SlotUser::getCurrent();
		if ($slotUser) {
			$response["balance"]=$slotUser->getBalance($currency);

			if ($currency=="ply")
				$response["flashMessage"]="PLAYING FOR FUN";
		}

		else {
			if ($currency!="none")
				throw new Exception("Not logged in, can't play with currency");

			$response["flashMessage"]="NOT LOGGED IN";
			$response["balanceText"]="DEMO";
			$currency="none";
		}

		$response["betLevels"]=SlotkitPlugin::instance()->getBetLevels($currency);

		$response["spinUrl"]=
			admin_url("admin-ajax.php").
			"?action=slotkit_spin".
			"&id=".$_REQUEST["id"].
			"&currency=".$currency;

		if ($slotgame->getMeta("backgroundImage"))
			$response["background"]=
				wp_get_attachment_image_url($slotgame->getMeta("backgroundImage"),"full");

		if ($slotgame->getMeta("foregroundImage"))
			$response["foreground"]=
				wp_get_attachment_image_url($slotgame->getMeta("foregroundImage"),"full");

		if ($slotgame->getMeta("paytableBackgroundImage"))
			$response["paytableBackground"]=
				wp_get_attachment_image_url($slotgame->getMeta("paytableBackgroundImage"),"full");

		if ($slotgame->getMeta("symbolsImage"))
			$response["symbols"]=
				wp_get_attachment_image_url($slotgame->getMeta("symbolsImage"),"full");

		$response["betLines"]=$slotgame->getBetLines();
		$response["paytable"]=$slotgame->getPaytable();
		$response["currency"]=$currency;

		echo json_encode($response);
		exit;
	}

	/**
	 * The spin call.
	 */
	public function spinRequest() {
		set_exception_handler(array($this,"handleException"));

		$currency=$_REQUEST["currency"];
		if (!$currency)
			throw new Exception("No currency");

		$slotgame=Slotgame::findOneById($_REQUEST["id"]);
		if (!$slotgame)
			throw new Exception("Game not found.");

		$slotUser=SlotUser::getCurrent();
		if (!$slotUser && $currency!="none")
			throw new Exception("Not logged in");

		$totalBet=$_REQUEST["betLines"]*$_REQUEST["bet"];
		$response=array();

		if ($slotUser) {
			$slotUser->changeBalance($currency,-$totalBet,"Spin");
			$response["spinBalance"]=$slotUser->getBalance($currency);
		}

		$outcome=$slotgame->generateOutcome($_REQUEST["betLines"],$_REQUEST["bet"]);
		$response["reels"]=$outcome->getReels();
		$response["betLineWins"]=$outcome->getBetLineWins();

		if ($slotUser) {
			if ($outcome->getTotalWin())
				$slotUser->changeBalance($currency,$outcome->getTotalWin(),"Win");

			$response["balance"]=$slotUser->getBalance($currency);
		}

		echo json_encode($response);
		exit;
	}

	/**
	 * Template part content.
	 */
	public function templatePartContent($slug) {
		$post=get_post();
		if ($post->post_type!="slotgame")
			return;

		if (!is_single())
			return;

		$slotUser=SlotUser::getCurrent();

		if ($slotUser && isset($_REQUEST["currency"]))
			update_user_meta($slotUser->getId(),"slotkit_currency",$_REQUEST["currency"]);

		$slotgame=Slotgame::findOneById($post->ID);
		if (!$slotgame) {
			echo "Game not found, id=".$post->ID;
			return;
		}

		wp_enqueue_script("bundleloader",SLOTKIT_URL."/bin/bundleloader.min.js");
		wp_enqueue_script("wpslot",SLOTKIT_URL."/bin/wpslot.js");
		wp_enqueue_style("slotkit",SLOTKIT_URL."/slotkit.css");

		$view=array();
		$view["currencies"]=array();

		$currencies=SlotkitPlugin::instance()->getAvailableCurrencies();

		if ($slotUser) {
			$userCurrency=$currencies[0];
			if (get_user_meta($slotUser->getId(),"slotkit_currency",TRUE))
				$userCurrency=get_user_meta($slotUser->getId(),"slotkit_currency",TRUE);

			$view["showCurrencySelect"]=TRUE;
		}

		else {
			$userCurrency="none";
			$view["showCurrencySelect"]=FALSE;
		}

		$view["userCurrency"]=$userCurrency;

		foreach ($currencies as $currency)
			$view["currencies"][]=$currency;

		$view["initUrl"]=admin_url(
			"admin-ajax.php?".
			"action=slotkit_init&".
			"id=".$slotgame->getId().
			"&currency=".$userCurrency
		);

		$t=new Template(__DIR__."/../template/slotgame.php");
		$t->display($view);
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
