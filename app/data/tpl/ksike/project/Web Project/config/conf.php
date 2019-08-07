<?php

	/*
	 * @header: Template definition values.
	 * @description: 
	 */
	$conf["vars"]["type"] = "template";
	$conf["vars"]["tplName"] = "Web Project";
	$conf["vars"]["projectType"] = "ksike";
	$conf["vars"]["tplType"] = "project";
	$conf["vars"]["tplDescription"] = "Web projects template are the reason of be of this ksike framework";
	//Dependencies
	$conf["vars"]["dependencies"][] = array();
	$conf["vars"]["asociatedApps"][] = array("name"=>"WebApplication");
	$conf["vars"]["asociatedApps"][] = array("name"=>"WebGraphic");
	$conf["vars"]["asociatedApps"][] = array("name"=>"WebService");
	$conf["vars"]["asociatedApps"][] = array("name"=>"WebSite");						
	
	
	// Directories config
	$conf["vars"]["dir"][] = array("name"=>"app","optional" => false, "configurable" => true);	
	$conf["vars"]["dir"][] = array("name"=>"core","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"lib","optional" => true);
	$conf["vars"]["dir"][] = array("name"=>"plugins","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"tools","optional" => true);
	
	//Tpl vars definition
	$conf["vars"]["proj"]["type"] = "textfield";	
	$conf["vars"]["proj"]["label"] = "textfield";
	$conf["vars"]["core"] = "textfield";	
	$conf["vars"]["plugins"] = "combo";	
	$conf["vars"]["lib"] = "combo";
	$conf["vars"]["app"] = "combo";	
	
	return $conf;
?>
