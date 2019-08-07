<?php
	use Ksike\ksl\filter\iface\Loader;
	use Ksike\ksl\base\helpers\Assist;
	
	class ProjLoader implements Loader
	{
		public function onLoad($name)
		{
			$path = Assist::router("module", "ProjectManager");
			$dir = explode("_", $name);
			if(count($dir)>1) {
				$dir = strtolower($dir[0]);
				include_once $path."server/common/$dir/$name".KCL_EXT;
			}
		}
	}
