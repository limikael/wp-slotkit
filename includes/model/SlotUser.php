<?php

/**
 * Represents a playing user.
 */
class SlotUser {

	/**
	 * Construct.
	 */
	private function __construct($user) {
		$this->user=$user;
	}

	/**
	 * Get id.
	 */
	public function getId() {
		return $this->user->ID;
	}

	/**
	 * Change balance.
	 */
	public function changeBalance($currency, $amount) {
		$balance=$this->getBalance($currency);

		if ($balance+$amount<0)
			throw new Exception("Insufficient balance");

		$balance+=$amount;
		switch ($currency) {
			case "ply":
				update_user_meta($this->getId(),"slotkit_playmoney_balance",$balance);
				break;

			default:
				throw new Exception("Currency not supported");
		}
	}

	/**
	 * Get balance.
	 */
	public function getBalance($currency) {
		switch ($currency) {
			case "ply":
				$meta=get_user_meta($this->getId(),"slotkit_playmoney_balance",TRUE);
				if ($meta==="")
					$meta=1000;

				return floatval($meta);
				break;

			default:
				throw new Exception("Currency not supported");
		}
	}

	/**
	 * Get current user.
	 */
	public static function getCurrent() {
		static $current;

		if (!$current) {
			$u=wp_get_current_user();

			if ($u && $u->ID) {
				$current=new SlotUser($u);
			}
		}

		return $current;
	}
}