<?php
	//Tpl description.
	$conf["vars"]["type"] = "template";
	$conf["vars"]["tplName"] = "WebService";
	$conf["vars"]["projectType"] = "ksike";
	$conf["vars"]["tplType"] = "app";
	$conf["vars"]["tplDescription"] = "Web Service applications allow to build a lot of functions or services 
									   that can be used by others applications";
	//Dependencies
	$conf["vars"]["dependencies"][] = array();
	$conf["vars"]["resources"][] = array();	
	
	//Tpl vars definition
	$conf["vars"]["name"] = "textfield";
	
	// Directories config
	$conf["vars"]["dir"][] = array("name"=>"client","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"server","optional" => false);
	
	return $conf;
?>
