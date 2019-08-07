<?php
use Ksike\ksl\filter\iface\Loader;
use Ksike\ksl\base\helpers\Assist;
class LinkerLoader implements Loader
{
	public function onLoad($name)
	{
		$path = Assist::router("module", "Linker");
		@include $path."server/common/libs/".$name.KCL_EXT;
	}
}
