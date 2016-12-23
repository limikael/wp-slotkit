<?php

/**
 * A Tweak file.
 */
class Tweak {

	private $fileName;
	private $fields;

	/**
	 * Construct
	 */
	private function __construct($fileName) {
		$headers=array(
			"Name"=>"Tweak Name",
			"Description"=>"Description",
			"Param0"=>"Param0",
			"Param1"=>"Param1",
			"Param2"=>"Param2",
			"Param3"=>"Param3",
			"Param4"=>"Param4",
			"Param5"=>"Param5",
			"Param6"=>"Param6",
			"Param7"=>"Param7",
		);

		$this->fileName=$fileName;
		$this->tweakData=get_file_data($this->getFullFileName(),$headers);

		$this->fields=array();

		for ($i=0; $i<8; $i++) {
			if ($this->tweakData["Param".$i]) {
				$t=$this->tweakData["Param".$i];
				$params=array();
				parse_str($t,$params);

				if (!isset($params["name"]))
					throw new Exception("The parameter needs to have a name");

				$params["name"]=trim($params["name"]);

				if (!isset($params["label"]))
					$params["label"]=$params["name"];

				if (!isset($params["type"]))
					$params["type"]="text";

				//error_log(print_r($r,TRUE));

				$this->fields[$params["name"]]=$params;
			}
		}
	}

	/**
	 * Get tweak from filename.
	 */
	public static function fromFileName($fileName) {
		return new Tweak($fileName);
	}

	/**
	 * Get parameter field names.
	 */
	public function getFieldParameters($fieldName) {
		return $this->fields[$fieldName];
	}

	/**
	 * Get parameter field names.
	 */
	public function getFieldNames() {
		return array_keys($this->fields);
	}

	/**
	 * Get name.
	 */
	public function getName() {
		return $this->tweakData["Name"]; 
	}

	/**
	 * Get file.
	 */
	public function getFileName() {
		return $this->fileName;
	}

	/**
	 * Get full file name.
	 */
	public function getFullFileName() {
		$pluginBaseDir=dirname(SLOTKIT_PATH);
		return $pluginBaseDir."/".$this->getFileName();
	}

	/**
	 * Get file names of all available tweaks.
	 */
	public static function getAll() {
		$fileNames=array();
		$fileNames=apply_filters("slotkit_available_tweaks",$fileNames);

		$all=array();
		foreach ($fileNames as $fileName) {
			$all[]=new Tweak($fileName);
		}

		return $all;
	}
}