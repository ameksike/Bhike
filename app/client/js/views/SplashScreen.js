Kcl.Class('SplashScreen',{
	property:{
		obj : null
	},
	behavior:{		
		construct:function(params){
			this.buildGUI(params);
		},
		buildGUI : function(params){
			this.obj = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."});
			//this.mask.addClass('splashscreen');
			// Insert a new div before the loading icon where we can place our logo.
			/*Ext.DomHelper.insertFirst(Ext.query('.x-mask-msg')[0], {
				cls: 'x-splash-icon'
			});*/
		}
	},
	show : function(){
		this.obj.show();
	}
});
