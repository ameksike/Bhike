<?php

	/**
	 *
	 * @framework: Merma
	 * @package: Tools
	 * @subpackage: Develop
	 * @version: 0.1 

	 * @description: DevManager es una interface para el trabajo con ...
	 * @authors: ing. Antonio Membrides Espinosa
	 * @making-Date: 10/10/2010
	 * @update-Date: 12/10/2010
	 * @license: GPL v2
	 *
	 */
	 
	interface Dev_Manager 
	{
		public function build($params);		
		/* public function buildOptionalDir();
		  public function makeOptionalDir($dir);
		  public function buildObligatoryFiles();
		  public function buildObligatoryDir();
		  public function copyDependency($list); */
	}

?>
