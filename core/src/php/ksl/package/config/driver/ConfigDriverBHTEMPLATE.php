<?php
/**
 *
 * @framework: Ksike
 * @package: Lib
 * @subpackage: ConfigDrivers
 * @version: 0.1

 * @description: ConfigDriverXML es una libreria para el trabajo con ...
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 15/06/2010
 * @update-Date: 15/06/2010
 * @license: GPL v3
 *
 */
namespace Ksike\ksl\package\config\driver;
use Ksike\ksl\package\config\base\ConfigDriver;
use Ksike\ksl\base\bundles\Driver;
class ConfigDriverBHTEMPLATE extends ConfigDriver
{
	private $fileConf;
	//...........................................................
	public function __construct($path="") 
	{
		parent::__construct($path); 
		$this->fileConf = 0;
	}
	//...........................................................
	public function load($path=0, $force=0)
	{
		$path = $path ? $path : $this->file;
		if(!$this->fileConf || $force) $this->fileConf = file_get_contents($path);		
		$this->fileConf = Driver::this('XML')->toArray($this->fileConf);
		return $this->fileConf;
	}
}
