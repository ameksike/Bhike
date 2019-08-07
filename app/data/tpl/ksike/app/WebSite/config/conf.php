<?php
	//Tpl description.
	$conf["vars"]["type"] = "template";
	$conf["vars"]["tplName"] = "WebSite";
	$conf["vars"]["projectType"] = "ksike";
	$conf["vars"]["tplType"] = "app";
	$conf["vars"]["tplDescription"] = "Web Site template allow you to build the simpliest and oldest
									   mean of web's technologiest since its creation.";
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
