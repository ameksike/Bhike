//... std.include('plugins/{$GLOBALS['name']}/client/');
//-------------------------------------------------------------------------
Kcl.Class( '{$GLOBALS['name']}',
{
	extend: Kcl.Plugin,
	property:{

	},
	behavior: {
		construct:function(params){
			//alert('{$GLOBALS['name']}');
		},
		serverResponse:function(objResponse)
		{			
		},
		buildGUI:function(params){
			var _this = {$GLOBALS['name']}.prototype;
			//_this.parent.somefunction();
		}
	}
});
/*{$GLOBALS['name']}.require = [
	std.Router.getModulePath()+'css/init.css',
	std.Router.getModulePath()+'js/common/MainMenuBar.js',
];*/
