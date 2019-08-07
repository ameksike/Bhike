<?php

	/*
	 * @header: Template definition values.
	 * @description: 
	 */
	$conf["vars"]["type"] = "template";
	$conf["vars"]["tplName"] = "defaultProject";
	$conf["vars"]["projectType"] = "setup";
	$conf["vars"]["tplType"] = "project";
	$conf["vars"]["tplDescription"] = "Setup projects allow user to build customized installation wizard
									  for you created project, making a high quality seal to you product";
	//Dependencies
	$conf["vars"]["dependencies"][] = array();
	$conf["vars"]["asociatedApps"][] = array("name"=>"defaultApp");								
	
	
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
