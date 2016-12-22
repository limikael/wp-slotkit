<?php

require_once __DIR__."/../../ext/wprecord/WpRecord.php";
require_once __DIR__."/SlotgameOutcome.php";

/**
 * Represents a database record for each slotgame.
 */
class Slotgame {

	private $post;

	/**
	 * Constructor.
	 */
	private function __construct($post) {
		$this->post=$post;
	}

	/**
	 * Get enabled tweaks.
	 */
	public function getEnabledTweaks() {
		$enabledTweaks=array();

		foreach ($this->getMetas("tweaks") as $tweakFileName) {
			$tweak=Tweak::fromFileName($tweakFileName);
			if ($tweak)
				$enabledTweaks[]=$tweak;
		}

		return $enabledTweaks;
	}

	/**
	 * Get enabled tweak fields.
	 */
	public function getEnabledTweakFields() {
		$allFieldNames=array();
		$enabledTweaks=$this->getEnabledTweaks();
		foreach ($enabledTweaks as $enabledTweak) {
			foreach ($enabledTweak->getFieldNames() as $fieldName)
				$allFieldNames[]=$fieldName;
		}

		return $allFieldNames;
	}

	/**
	 * Get id.
	 */
	public function getId() {
		return $this->post->ID;
	}

	/**
	 * Get rules.
	 */
	public function getRules() {
		return get_post_meta($this->post->ID,"rules",TRUE);
	}

	/**
	 * Get meta.
	 */
	public function getMeta($key) {
		return get_post_meta($this->post->ID,"$key",TRUE);
	}

	/**
	 * Get meta.
	 */
	public function getMetas($key) {
		return get_post_meta($this->post->ID,"$key",FALSE);
	}

	/**
	 * Get meta image.
	 */
	public function getMetaImage($key, $size="full") {
		$v=$this->getMeta($key);
		if (!$v)
			return NULL;

		return wp_get_attachment_image_url($v,"full");
	}

	/**
	 * Get bet lines.
	 */
	public function getBetLines() {
		switch ($this->getRules()) {
			case 'default':
				return array(
					array(1, 1, 1, 1, 1), array(0, 0, 0, 0, 0),
					array(2, 2, 2, 2, 2), array(0, 1, 2, 1, 0),
					array(2, 1, 0, 1, 2), array(0, 0, 1, 0, 0),
					array(2, 2, 1, 2, 2), array(1, 2, 2, 2, 1),
					array(1, 0, 0, 0, 1), array(1, 0, 1, 0, 1),
					array(1, 2, 1, 2, 1), array(0, 1, 0, 1, 0),
					array(2, 1, 2, 1, 2), array(1, 1, 0, 1, 1),
					array(1, 1, 2, 1, 1), array(0, 1, 1, 1, 0),
					array(2, 1, 1, 1, 2), array(0, 1, 2, 2, 2),
					array(2, 1, 0, 0, 0), array(0, 2, 0, 2, 0)
				);
				break;

			case 'oneLine':
				return array(
					array(1,1,1,1,1)
				);
				break;

			default:
				throw new Exception("Unknown rules");
				break;
		}
	}

	/**
	 * Get number of bet lines.
	 */
	public function getNumBetLines() {
		$betLines=$this->getBetLines();
		return sizeof($betLines);
	}

	/**
	 * Get number of reels.
	 */
	public function getNumReels() {
		return 5;
	}

	/**
	 * Get number of rows.
	 */
	public function getNumRows() {
		return 3;
	}

	/**
	 * Get number of symbols.
	 */
	public function getNumSymbols() {
		return 9;
	}

	/**
	 * Generate an outcome.
	 */
	public function generateOutcome($numBetLines, $bet) {
		return new SlotgameOutcome($this,$numBetLines,$bet);
	}

	/**
	 * Generate a fake outcome.
	 */
	public function generateFakeOutcome($numBetLines, $bet, $scenarioIndex) {
		$outcome=new SlotgameOutcome($this,$numBetLines,$bet);

		$reels=$this->getFakeReels();
		$outcome->setReels($reels[$scenarioIndex]);

		return $outcome;
	}

	/**
	 * Return slug=>name array of rules.
	 */
	public static function getAvailableRules() {
		return array(
			"default"=>"Standard (5 reels, 3 rows, 3x3 symbol sheet, 20 betlines)",
			"oneLine"=>"One bet line (5 reels, 3 rows, 3x3 symbol sheet, 1 betline)",
		);
	}

	/**
	 * Get fake reels.
	 */
	public function getFakeReels() {
		switch ($this->getRules()) {
			case 'default':
			case 'oneLine':
				return array(
					array(
						array(1,1,1),
						array(2,2,2),
						array(3,3,3),
						array(4,4,4),
						array(5,5,5),
					),

					array(
						array(1,1,1),
						array(1,2,2),
						array(1,3,3),
						array(4,4,4),
						array(5,5,5),
					),
				);

				break;
			
			default:
				throw new Exception("Unknown rules: ".$this->rules);
		}
	}

	/**
	 * Get paytable.
	 */
	public function getPaytable() {
		switch ($this->getRules()) {
			case 'default':
				return array(
					array(0,0,30,150,1000), array(0,0,30,150,1000),
					array(0,0,30,150,1000),

					array(0,0,40,200,1500), array(0,0,40,200,1500),
					array(0,0,40,200,1500),

					array(0,0,50,250,2500), array(0,0,50,250,2500),
					array(0,0,50,250,2500)
				);
				break;

			case 'oneLine':
				return array(
					array(0,0,1,2,3), array(0,0,1,2,3),
					array(0,0,1,2,3), array(0,0,1,2,3),
					array(0,0,1,2,3), array(0,0,1,2,3),
					array(0,0,1,2,3), array(0,0,1,2,3),
					array(0,0,1,2,3)
				);
				break;

			default:
				throw new Exception("Unknown rules: ".$this->rules);
		}
	}

	/**
	 * Return underlying post.
	 */
	public function getPost() {
		return $this->post;
	}

	/**
	 * Get slotgame by id.
	 */
	public static function findOneById($postId) {
		if (!$postId)
			return NULL;

		$post=get_post($postId);

		if (!$post)
			return NULL;

		if ($post->post_type!="slotgame")
			throw new Exception("This is not a slotgame post.");

		return new Slotgame($post);
	}

	/**
	 * Get slotgame by id.
	 */
	public static function findAllPublished() {
		$query = new WP_Query(array(
			'post_type'=> 'slotgame',
		));

		$posts=$query->get_posts();
		$slotgames=array();
		foreach ($posts as $post)
			$slotgames[]=new Slotgame($post);

		return $slotgames;
	}
}
