<?php
	unset ($params);
	$params['name'] = "";
	$params['machinename'] = gethostname();
	$params['rootnamespace'] = "";
	$params['safename'] = "";
	$params['time'] = date("d/m/Y H:i:s");
	$params['username'] = "Anonymus";//get_current_user();
	$params['userdomain'] = "";
	$params['year'] = date("Y");
	
	return $params;
