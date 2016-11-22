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
	 * Refill play money to default.
	 */
	public function refillPlayMoney() {
		delete_user_meta($this->getId(),"slotkit_playmoney_balance");
	}

	/**
	 * Change balance.
	 */
	public function changeBalance($currency, $amount, $label) {
		$balance=$this->getBalance($currency);

		if ($balance+$amount<0)
			throw new Exception("Insufficient balance");

		$balance+=$amount;
		switch ($currency) {
			case "ply":
				update_user_meta($this->getId(),"slotkit_playmoney_balance",$balance);
				break;

			case "bits":
			case "btc":
			case "mbtc":
				$houseAccount=SlotkitPlugin::instance()->getHouseAccount($currency);
				$userAccount=bca_user_account($this->user);

				// playing with the house user.
				if ($houseAccount->equals($userAccount))
					return;

				$options=array(
					"confirming"=>TRUE,
					"notice"=>$label
				);

				if ($amount>0)
					bca_make_transaction($currency,$houseAccount,$userAccount,$amount,$options);

				else
					bca_make_transaction($currency,$userAccount,$houseAccount,-$amount,$options);

				break;

			default:
				throw new Exception("Currency not supported");
		}
	}

	/**
	 * Is house user?
	 */
	public function isHouseUser() {
		$houseAccount=SlotkitPlugin::instance()->getHouseAccount($currency);
		$userAccount=bca_user_account($this->user);

		return ($houseAccount->equals($userAccount));
	}

	/**
	 * Get balance.
	 */
	public function getBalance($currency) {
		switch ($currency) {
			case "ply":
				$meta=get_user_meta($this->getId(),"slotkit_playmoney_balance",TRUE);
				if ($meta==="")
					$meta=SlotkitPlugin::instance()->getDefaultPlayMoney();

				return floatval($meta);
				break;

			case "btc":
			case "bits":
			case "mbtc":
 		    	if (!is_plugin_active("wp-crypto-accounts/wp-crypto-accounts.php"))
 		    		throw new Exception("blockchain accounts not available");

				$account=bca_user_account($this->user);
				return $account->getConfirmingBalance($currency);
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