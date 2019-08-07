/*
 * @package: {$GLOBALS['project']}
 * 
 * @description: {$GLOBALS['name']} is a Ksike's JavaScript class definition that....
 * @authors: no-body
 * @created: {$GLOBALS['date']}
 * @license: GPL v3
 **/

Kcl.Class('{$GLOBALS['name']}',
{
    behavior:{
        construct: function(params){
            var _this = {$GLOBALS['name']}.prototype;
        },
        buildGUI:function(params){
			///
			///obj
			///
			this.obj = new Ext.Panel();
			this.obj.setTitle('{$GLOBALS['name']}');
			this.obj.setWidth(200);
			this.obj.setHeight(150);
		}
    }
});
