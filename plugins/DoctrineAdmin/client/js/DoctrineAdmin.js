std.include('plugins/DoctrineAdmin/client/css/doctrin.css');
Kcl.Class( "DoctrineAdmin",
{
	extend: Kcl.Plugin,
	behavior:{
		buildGUI : function(params){
			var _this = DoctrineAdmin.prototype;
			_this.gui = params.gui;
			_this.gui.menuBar.addItem({//--- DoctrineAdmin menu
				text:'Doctrine',
				menu:[{
						text:'Set Connection',
						iconCls:'icon-doctconnect'
					},{
						text:'Define Maping Tables',
						disabled:true,
						iconCls:'icon-doctdependency'
					},{
						text:'Generate Model',
						disabled:true,
						iconCls:'icon-doctexportmodel'
					},{
						text:'About this Driver',
						iconCls:'icon-doctabout'
				}]
			}, "mtools");
		},
		serverResponse : function(objResponse){		}
	}
});

