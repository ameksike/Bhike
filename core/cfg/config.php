<?php
	unset ($config);
	$config["router"]["lib"][] 	= 'lib/';
	$config["router"]["lib"][] 	= '../../lib/';
	
	//KSIKE CORE SETTINGS........................................................
	/*$config["loader"]["package"]["config"]["mod"]["proxy"] 		= 'Config';
	$config["loader"]["package"]["config"]["cfg"]["driver"][] 	= 'php';
	$config["loader"]["package"]["config"]["cfg"]["driver"][] 	= 'json';
	$config["loader"]["package"]["config"]["cfg"]["driver"][] 	= 'xml';
	$config["loader"]["package"]["config"]["cfg"]["driver"][] 	= 'bhtemplate';
	$config["loader"]["package"]["config"]["cfg"]["driver"][] 	= 'ini';
	$config["loader"]["package"]["config"]["mod"]["base"][] 	= 'ConfigDriver';
	$config["loader"]["package"]["config"]["cfg"]["type"] 		= "object";
	$config["loader"]["package"]["config"]["cfg"]["load"] 		= "manual";
	$config["loader"]["package"]["config"]["cfg"]["order"][] 	= "php";
	$config["loader"]["package"]["config"]["cfg"]["order"][] 	= "xml";
	$config["loader"]["package"]["config"]["cfg"]["order"][] 	= "ini";
	$config["loader"]["package"]["config"]["cfg"]["order"][] 	= "json";
	$config["loader"]["package"]["config"]["cfg"]["order"][] 	= "bhtemplate";*/
	return $config;
