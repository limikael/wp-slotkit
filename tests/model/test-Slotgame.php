<?php

require_once __DIR__."/../../includes/model/Slotgame.php";

class TestSlotgame extends WP_UnitTestCase {
    function setUp() {
        parent::setUp();

        Slotgame::install();
    }

    function testGetReel() {
        $g=new Slotgame();
        $g->save();
        $this->assertNotNull($g->id);

        $reel=$g->getReel();

        /*$id=$g->id;

        echo "hello $id";*/
    }
}
