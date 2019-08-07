<?php
	//Tpl description.
	$conf["vars"]["type"] = "template";
	$conf["vars"]["tplName"] = "WebApplication";
	$conf["vars"]["projectType"] = "ksike";
	$conf["vars"]["tplType"] = "app";
	$conf["vars"]["tplDescription"] = "WebApplications allow you to build applications 
									   like facebook to share with the entire world";
	//Dependencies
	$conf["vars"]["dependencies"][] = array();
	$conf["vars"]["resources"][] = array();	
	
	//Tpl vars definition
	$conf["vars"]["name"] = "textfield";
	
	// Directories config
	$conf["vars"]["dir"][] = array("name"=>"client","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"config","optional" => true);
	$conf["vars"]["dir"][] = array("name"=>"logs","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"server","optional" => false);
	
	return $conf;
?>
