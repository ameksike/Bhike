<?php
	//Tpl description.
	$conf["vars"]["type"] = "template";
	$conf["vars"]["tplName"] = "MobilePlattaform";
	$conf["vars"]["projectType"] = "ksike";
	$conf["vars"]["tplType"] = "app";
	$conf["vars"]["tplDescription"] = "MobilePlattaform applications are amazing!!!... ask me for answers";
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
	$conf["vars"]["dir"][] = array("name"=>"server","optional" => false);
	
	return $conf;
?>
