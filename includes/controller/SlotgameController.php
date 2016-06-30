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

        $response=array(
            "spinUrl"=>admin_url("admin-ajax.php")."?action=slotkit_spin",
    		"baseUrl"=>plugins_url()."/slotkit/",
    		"balance"=>15,
        );

        if ($slotgame->backgroundUrl)
            $response["background"]=$slotgame->backgroundUrl;

        if ($slotgame->foregroundUrl)
            $response["foreground"]=$slotgame->foregroundUrl;

        if ($slotgame->paytableBackgroundUrl)
            $response["paytableBackground"]=$slotgame->paytableBackgroundUrl;

     	echo json_encode($response);
    	exit;
    }

    /**
     * The spin call.
     */
    public function spin() {
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
    	$content.="<div id='slotgame' style='width:100%; height:500px; position:relative'></div>\n";
    	$content.="<script>\n";
    	$content.="SLOTKIT_BASEURL='".plugins_url()."/slotkit/'\n";
    	$content.="SLOTKIT_INITURL='".admin_url("admin-ajax.php")."?action=slotkit_init&id=".$params["id"]."';\n";
    	$content.="</script>\n";

    	return $content;
    }

    /**
     * Get singleton instance.
     */
    public function getInstance() {
        if (!SlotgameController::$instance)
            SlotgameController::$instance=new SlotgameController();

        return SlotgameController::$instance;
    }
}
