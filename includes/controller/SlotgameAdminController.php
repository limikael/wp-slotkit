<?php

require_once __DIR__."/../../ext/wpcrud/WpCrud.php";
require_once __DIR__."/../model/Slotgame.php";

class SlotgameAdminController extends WpCrud {

    function init() {
        $this->addField("name");

        $this->addField("rules")
            ->type("select")
            ->options(Slotgame::getAvailableRules());

        $f=$this->addBox("Graphics");

        $f->addField("foregroundUrl")
            ->type("media-image");

        $f->addField("backgroundUrl")
            ->type("media-image");

        $f->addField("paytableBackgroundUrl")
            ->type("media-image");

        $f->addField("symbolsUrl")
            ->type("media-image");
    }

    function getLiteral($literalId) {
        switch ($literalId) {
            case "typeName":
                return "Slotgame";
                break;
        }
    }

    function createItem() {
        return new Slotgame();
    }

    function saveItem($slotgame) {
        $slotgame->save();
    }

    function deleteItem($slotgame) {
        $slotgame->delete();
    }

    function getItem($id) {
        return Slotgame::findOne($id);
    }

    function getAllItems() {
        return Slotgame::findAll();
    }
}
