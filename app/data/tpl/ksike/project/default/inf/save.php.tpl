<?php

	$conf['vars']['projectName'] 			= '{$GLOBALS['name']}';	
	
	
	$conf['vars']['data']['author'] 		= '{$GLOBALS['vars']->author}';
	$conf['vars']['data']['company'] 		= '{$GLOBALS['vars']->company}';
	
	$conf['vars']['references']['core']  	= '{$GLOBALS['core']}';
	$conf['vars']['tpl'] 					= '{$GLOBALS['tpl']}';
	$conf['vars']['tplPath'] 				= '{$GLOBALS['tplPath']}';
	
	return $conf;
?>
