<?php
use Ksike\filter\control\Plugin;
use Ksike\base\helpers\Assist;
class ErrorReporter extends Plugin
{
	public function getNoifications($request)
	{	$url = Assist::request("path", "REQUEST");
		$path  = Assist::router("proj")."../..";
		$path .= "/project/ExtJS";
		$path = $url."/app/log/";
		$out = Assist::scanDir($path, $this, 1);
		$out = $this->formatting($out, $path);
		print_r($out);

		/*return array("info"=>array(
			array(
				"type"=>0,
				"file"=>"kk",
				"description"=>"lah",
				"date"=>"2011/11/23 01:00:56",
				"line"=>123
			)
		));*/
	}

	public function onCloseDir($lst, $path, $nivel)
	{
		if($nivel == 1){
			$out = array();
			foreach($lst["dir"] as $i){
				$out[$i] = Assist::scanDir("$path$i/", $this, 2);
			}
			return $out;
		}
		else return $lst["file"];
	}
	
	public function onFindDir($item, $path, $type, $params){
		if($type=="file") $item = str_replace(".log", "", $item);
	}
	
	public function formatting($lst, $path){
		$out = "{\"info\":[";
		foreach($lst as $k=>$i)
		{
			foreach($i as $j)
			{
				$file = $path."$k/$j.log";
				$out .= file_get_contents($file);
			}
		}
		return $out."]}";
	}
	
}
