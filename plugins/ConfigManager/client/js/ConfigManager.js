Kcl.Class( "ConfigManager",
{
	extend: Kcl.Plugin,
	behavior:{
		buildGUI : function(params){
			var _this = ConfigManager.prototype;
			_this.gui = params.gui;
			_this.gui.menuBar.addItem(['-',{
						text:'Prefferences',
						iconCls:'icon-options'
					}],"medit");
		},
		serverResponse : function(objResponse){		}
	}
});
