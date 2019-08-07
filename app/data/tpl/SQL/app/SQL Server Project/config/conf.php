<?php
	//Tpl description.
	$conf["vars"]["type"] = "template";
	$conf["vars"]["tplName"] = "SQL Server Project";
	$conf["vars"]["projectType"] = "setup";
	$conf["vars"]["tplType"] = "app";
	$conf["vars"]["tplDescription"] = "defaultApp template allow you to build a heaven in two clicks";
	$conf["vars"]["icon"] = true;
	//Dependencies
	$conf["vars"]["dependencies"][] = array();
	$conf["vars"]["resources"][] = array();	
	
	//Tpl vars definition
	$conf["vars"]["name"] = "textfield";
	
	// Directories config
	$conf["vars"]["dir"][] = array("name"=>"client","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"config","optional" => true);
	$conf["vars"]["dir"][] = array("name"=>"logs","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"resources","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"server","optional" => false);
	
	return $conf;
?>
