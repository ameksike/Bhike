<?php
	//Tpl description.
	$conf["vars"]["type"] = "template";
	$conf["vars"]["tplName"] = "ORM";
	$conf["vars"]["projectType"] = "sql";
	$conf["vars"]["tplType"] = "app";
	$conf["vars"]["tplDescription"] = "ORM template allow you to build a entire database with a bit of intelligence";
	//Dependencies
	$conf["vars"]["dependencies"][] = array();
	$conf["vars"]["resources"][] = array();	
	
	//Tpl vars definition
	$conf["vars"]["name"] = "textfield";
	
	// Directories config
	$conf["vars"]["dir"][] = array("name"=>"client","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"config","optional" => true);
	$conf["vars"]["dir"][] = array("name"=>"data","optional" => false);
	$conf["vars"]["dir"][] = array("name"=>"server","optional" => false);
	
	return $conf;
?>
