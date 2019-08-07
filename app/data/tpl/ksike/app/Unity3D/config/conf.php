<?php
	//Tpl description.
	$conf["vars"]["type"] = "template";
	$conf["vars"]["tplName"] = "Unity3D";
	$conf["vars"]["projectType"] = "ksike";
	$conf["vars"]["tplType"] = "app";
	$conf["vars"]["tplDescription"] = "Unity3D applications are based on the Unity3D framework for game development";
	$conf["vars"]["icon"] = true;
	//Dependencies
	$conf["vars"]["dependencies"][] = array();
	$conf["vars"]["resources"][] = array();	
	
	//Tpl vars definition
	$conf["vars"]["name"] = "textfield";
	
	// Directories config
	$conf["vars"]["dir"][] = array("name"=>"applets","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"client","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"scripts","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"server","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"resources","optional" => true);
	
	return $conf;
?>
