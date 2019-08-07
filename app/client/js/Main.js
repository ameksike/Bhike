
Kcl.Class( "Main",
{
	require : [
		std.router.lib()+'ext/css/ext-all.css',
		std.router.lib()+'ext/css/misc/ux-all.css',
		std.router.lib()+'ext/css/misc/fileuploadfield.css',
		std.router.lib()+'ext/js/ext-base.js',
		//std.router.lib()+'ext/js/ext-all.js',
		std.router.lib()+'ext/js/ext-all-debug.js',
		std.router.lib()+'ext/js/misc/CheckColumn.js',
		//std.router.lib()+'ext/js/locate/ext-lang-es.js',
		
		std.router.module()+'css/icons.css',
		std.router.module()+'css/dataview.css',
		std.router.module()+'css/init.css',
		
		std.router.module()+'js/views/SplashScreen.js',
		
		std.router.module()+'js/common/DataView.js',
		std.router.module()+'js/common/Main.FloattingPanel.js',	
		
		std.router.module()+'js/views/StartPage.js',
		std.router.module()+'js/handlers/StartPage.class.js',
		
		std.router.module()+'js/views/Main.MenuBar.js',
		std.router.module()+'js/views/Main.ToolBar.js',
		
		std.router.module()+'js/views/Main.GUIWrapper.js',
		std.router.module()+'js/handlers/Main.GUIWrapper.class.js',
		
		std.router.module()+'js/views/BHike.Wizard.js',
		std.router.module()+'js/handlers/BHike.Wizard.class.js'   
	],
    extend: Kcl.App,
    patterns: "Observed",
    property:{
        gui: null
    },
    behavior: {
        construct : function(eve, loadType){
			var _this = Main.prototype;
            this.parent.construct.apply(this, [this]);
            this.connection = new Ext.data.Connection();           
            this.connection.request({
				url:std.frontController.getRequest("loadSettings", "Main"),
				method:'POST',
				success: _this.initialize.createDelegate(this)
			});
        },
        initialize: function(response){
			var data = Ext.util.JSON.decode(response.responseText);
			this.settings = data.settings;
			this.gui = new Main.GUIWrapper();
			this.gui.buildGUI();
		},
        serverResponse:function(response){
            this.parent.serverResponse(response, this);
            switch(response._action)
            {
                case 'saveFile':
                break;
            }
        },
        onLoadPlugins : function(params){
            this.buildGUI({"gui": this.gui});
        },
        notify:function(comp){
			for(var i in std.mod)
				if(std.mod[i].notified != null)
					std.mod[i].notified(comp);
		},
		restoreSession:function(project){
			for(var i = 0; i < project.session.length;i++)
				if(std.mod[project.session[i].Module] != null){
					if(std.mod[project.session[i].Module].restoreSession != null)
						std.mod[project.session[i].Module].restoreSession({path:project.data.Path,item:project.session[i].Item});
				}
				else{
					///console.log("Error cargando la sesion, Plugin .. no encontrado ");
				}
		},
		openFile:function(path,params){
			
		},
		saveFile:function(file,params){
			std.frontController.send({
				action: 'saveFile',
				controller: "Main",
				params: {
					file:file.name,
					data:file.data
				}
			});
		}
    }
});
