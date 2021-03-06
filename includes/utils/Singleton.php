<?php

namespace slotkit;

use \Exception;

/**
 * Singleton
 */
class Singleton {
	private static $instances=array();

	/**
	 * Init.
	 */
	public static function instance() {
		$class=get_called_class();

		if ($class=="Singleton")
			throw new Exception("Singleton should not be used directly.");

		if (!isset(self::$instances[$class]))
			self::$instances[$class]=new $class;

		return self::$instances[$class];
	}
}