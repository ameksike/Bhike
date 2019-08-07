<?php
	///
	///@Section: themes
	///
	$config['editor']['theme']['default_theme'] = "eclipse";
	$config['editor']['theme']['current_theme'] = "eclipse";
	$config['editor']['theme']['directory'] = "/lib/codemirror/theme/";
	///
	///@Section: modes
	///
    $config['editor']['mode']['default_mode'] = "javascript";
    $config['editor']['mode']['current_mode'] = "javascript";
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
