<?php
	///
	///@Section: Themes
	///
	$config['editor']['theme']['default'] = "eclipse";
	$config['editor']['theme']['current'] = "eclipse";
	$config['editor']['theme']['directory'] = "/lib/codemirror/theme/";
	///
	///@Section: Modes
	///
    $config['editor']['mode']['default'] = "javascript";
    $config['editor']['mode']['current'] = "javascript";
	$config['editor']['mode']['directory'] = "/lib/codemirror/mode/";
	///
	///@Section: Options
	///
    $config['editor']['option']['gutter'] = true;
    $config['editor']['option']['fixedGutter'] = true;
    $config['editor']['option']['lineNumbers'] = true;
    $config['editor']['option']['matchBrackets'] = true;
    $config['editor']['option']['lineWrapping'] = true;
    $config['editor']['option']['undoDepth'] = 40;
    
    return $config;    
?>
