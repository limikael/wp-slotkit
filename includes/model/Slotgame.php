<?php

require_once __DIR__."/../../ext/wprecord/WpRecord.php";

/**
 * Represents a database record for each slotgame.
 */
class Slotgame extends WpRecord {

    /**
     * Initialize fields.
     */
    public static function initialize() {
		self::field("id","integer not null auto_increment");
		self::field("name","varchar(255) not null");
        self::field("backgroundUrl","varchar(255) not null");
        self::field("foregroundUrl","varchar(255) not null");
        self::field("paytableBackgroundUrl","varchar(255) not null");
	}
}
