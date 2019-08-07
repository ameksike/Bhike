std.include('plugins/{$GLOBALS['name']}/client/js/common/splash.js');
std.include('plugins/{$GLOBALS['name']}/client/css/app.css');
//-------------------------------------------------------------------------
Kcl.Class( '{$GLOBALS['name']}',
{
	extend: Kcl.Plugin,
	property:{
		'name': '',
		'age': ''
	},
	behavior: {
		construct:function(params)
		{
			params = params || {};
			this.name = params.name,
			this.age = params.age;
			alert('{$GLOBALS['name']}');
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
