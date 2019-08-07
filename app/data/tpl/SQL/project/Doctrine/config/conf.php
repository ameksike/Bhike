<?php

	/*
	 * @header: Template definition values.
	 * @description: 
	 */
	$conf["vars"]["type"] = "template";
	$conf["vars"]["tplName"] = "Doctrine";
	$conf["vars"]["projectType"] = "sql";
	$conf["vars"]["tplType"] = "project";
	$conf["vars"]["tplDescription"] = "Doctrine projects allow users to perform databases mappings and create entire
									   resurces since a simple template.";
	//Dependencies
	$conf["vars"]["dependencies"][] = array();
	$conf["vars"]["asociatedApps"][] = array("name"=>"ORM");								
	
	
	// Directories config
	$conf["vars"]["dir"][] = array("name"=>"app","optional" => false, "configurable" => true);	
	$conf["vars"]["dir"][] = array("name"=>"core","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"lib","optional" => true);
	$conf["vars"]["dir"][] = array("name"=>"plugins","optional" => true);
	$conf["vars"]["dir"][] = array("name"=>"tools","optional" => true);
	$conf["vars"]["dir"][] = array("name"=>"register","optional" => true);
	
	//Tpl vars definition
	$conf["vars"]["proj"]["type"] = "textfield";	
	$conf["vars"]["proj"]["label"] = "textfield";
	$conf["vars"]["core"] = "textfield";	
	$conf["vars"]["plugins"] = "combo";	
	$conf["vars"]["lib"] = "combo";
	$conf["vars"]["app"] = "combo";	
	
	return $conf;
?>
