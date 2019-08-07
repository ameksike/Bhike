<?php
	//..........SETTINGS...........
	$config["settings"]["startpage"]["showOnStartup"] = true;
	$config["settings"]["startpage"]["closeOnProjectLoad"] = false;
	//..........TEMPLATES..........
	$config["template"]["path"]  = 'app/data/templates/';
	//..........PROJECT............
	$config["project"]["path"]  = '../../project/';
	//..........PLUGINS............
	$config["plugins"][]    = "Help";
	$config["plugins"][]    = "OpenFileDialog";
	$config["plugins"][]    = "ProjectManager";
	$config["plugins"][]    = "CodeEditor";
	
	//$config["plugins"][]    = "Linker";
	//$config["plugins"][]    = "UMLDesigner";
    
	//$config["plugins"][]    = "TemplateManager";
	//$config["plugins"][]    = "DoctrineAdmin";
	//$config["plugins"][]    = "ConfigManager";
	//$config["plugins"][]    = "ErrorReporter";
	
	return $config;
?>
