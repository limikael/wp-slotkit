<?php

require_once __DIR__."/../../ext/wpcrud/WpCrud.php";

class SlotgameAdminController extends WpCrud {

    function init() {
        $this->addField("name");

        $f=$this->addBox("Graphics");

        $f->addField("foregroundUrl")
            ->type("media-image");

        $f->addField("backgroundUrl")
            ->type("media-image");

        $f->addField("paytableBackgroundUrl")
            ->type("media-image");
    }

    function getLiteral($literalId) {
        switch ($literalId) {
            case "typeName":
                return "Slotgame";
                break;

/*            case "description":
                return "hello";
                break;*/
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
