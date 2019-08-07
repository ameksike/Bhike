Kcl.Class( "TemplateManager",
{
	extend: Kcl.Plugin,
	behavior:{
		buildGUI : function(params){
			var _this = TemplateManager.prototype;
			_this.gui = params.gui;
			_this.gui.menuBar.addItem({//--- Template menu
				text:'Template',
				menu:[{
						text:'Import'
					},{
						text:'Export',
						disabled:true
					},{
						text:'Edit',
						disabled:true
					},{
						text:'Property'
				}]
			});
		},
		serverResponse : function(objResponse){		}
	}
});
