
/**
 *
 * @framework: Merma
 * @package: Plugins
 * @subpackage: ProjectManager
 * @version: 0.1

 * @description: ProjectManager es una clase para ...
 * @authors: Nosinc
 * @created: 12-apr-2011 4:17:23
 * @updated: 29-feb-2012 7:24:05
 * @license: GPL v3
 */ 
Kcl.Class( "ProjectManager",
{
	require : [
		//std.router.module("ProjectManager")+"cfg/config.js",
		
		std.router.module("ProjectManager")+"css/main.css",
		std.router.module("ProjectManager")+"css/icons.css",
		
		std.router.module("ProjectManager")+"js/common/ProjectManager.Object.js",
		std.router.module("ProjectManager")+"js/common/ProjectManager.Item.js",		
		std.router.module("ProjectManager")+"js/common/ProjectManager.Template.js",
		std.router.module("ProjectManager")+"js/common/ProjectManager.Project.js",
		
		std.router.module("ProjectManager")+"js/views/ProjectManager.RecentsManager.js",
		std.router.module("ProjectManager")+"js/handlers/ProjectManager.RecentsManager.class.js",
		
		std.router.module("ProjectManager")+"js/views/ProjectManager.TemplateSelectionPanel.js",
		std.router.module("ProjectManager")+"js/handlers/ProjectManager.TemplateSelectionPanel.class.js",
		
		/*std.router.module("ProjectManager")+"js/views/ProjectManager.TemplatePanel.js",
		std.router.module("ProjectManager")+"js/handlers/ProjectManager.TemplatePanel.class.js",*/
		
		std.router.module("ProjectManager")+"js/views/ProjectManager.CreateNewProjectWindow.js",
		std.router.module("ProjectManager")+"js/handlers/ProjectManager.CreateNewProjectWindow.class.js",
		
		std.router.module("ProjectManager")+"js/views/ProjectManager.Explorer.js",
		std.router.module("ProjectManager")+"js/handlers/ProjectManager.Explorer.class.js",
		
		std.router.module("ProjectManager")+"js/views/ProjectManager.PropertiesPanel.js",
		std.router.module("ProjectManager")+"js/handlers/ProjectManager.PropertiesPanel.class.js",
		
		/*std.router.module("ProjectManager")+"js/views/AppPropertiesViewer.js",
		
		std.router.module("ProjectManager")+"js/views/PropertiesViewer.js",
		std.router.module("ProjectManager")+"js/handlers/PropertiesViewer.class.js",
		
		std.router.module("ProjectManager")+"js/views/CustomDesignInput.js",*/
		/// Ksike template Wizard Dependencies
		/*ktplw + "wizard/views/DependenciesManagerPanel.js",
		ktplw + "wizard/handlers/DependenciesManagerPanel.class.js",
		ktplw + "wizard/views/ProjectConfigurationPanel.js",
		ktplw + "wizard/handlers/ProjectConfigurationPanel.class.js",
		ktplw + "wizard/views/ProjectConstantsPanel.js",
		ktplw + "wizard/handlers/ProjectConstantsPanel.class.js",
		ktplw + "wizard/views/ProjectVariablesManager.js"*/
		/// END
	],
    extend: Kcl.Plugin,
    property:{
        projectWindow:null,
        explorer:null,
        customPanel: null,
        resources:[],
        projects:[],
        config:[],
        workspace:null,        
        connection: new Ext.data.Connection(),
        activeProject: null
    },
    behavior:{
        construct : function(){
            var _this = ProjectManager.prototype;
			
            // This is the parent's definition call
            this.parent.construct.apply(this, [this]);
            this.connection.request({
				url:std.frontController.getRequest("initialize", "ProjectManager"),
				method:'POST',
				success: _this.initialize.createDelegate(this)
			});
        },
        buildGUI : function(params){
            var _this = ProjectManager.prototype;
            this.gui = params.gui;
			///
			///mitem_newProject
			///
			this.mitem_newProject = new Ext.menu.Item();
			this.mitem_newProject.setText("Project");
			this.mitem_newProject.iconCls = 'icon-new-project';
			this.mitem_newProject.on('click',_this.mitem_newProject_onclick,this);
            this.gui.menuBar.addItem(this.mitem_newProject, "mnew");
			///
			///mitem_openProject
			///
			this.mitem_openProject = new Ext.menu.Item();
			this.mitem_openProject.setText("Project");
			this.mitem_openProject.iconCls = 'icon-open-project';
			this.mitem_openProject.on('click',_this.mitem_openProject_onclick,this);			
            this.gui.menuBar.addItem(this.mitem_openProject, "mopen");
			///
			///mitem_projectToolbar
			///
			this.mitem_projectToolbar = new Ext.menu.CheckItem();
			this.mitem_projectToolbar.setText("Project");
			this.mitem_projectToolbar.checked = true;			
            this.gui.menuBar.addItem(this.mitem_projectToolbar, "mview-toolbars");
            ///
            ///mitem_properties
            ///
            this.mitem_properties = new Ext.menu.Item();
            this.mitem_properties.setText("Properties");
            ///
            ///mitem_addModule
            ///
            this.mitem_addModule = new Ext.menu.Item();
            this.mitem_addModule.setText("Add Module");
            ///
            ///mitem_exportTemplate
            ///
            this.mitem_exportTemplate = new Ext.menu.Item();
            this.mitem_exportTemplate.setText("Export Template");            
            ///
            ///menu_project
            ///
            this.menu_project = new Ext.menu.Menu();
            this.menu_project.addItem(this.mitem_properties);
            this.menu_project.addItem(this.mitem_addModule);
            this.menu_project.addItem(this.mitem_exportTemplate);
            ///
            ///sbtn_menuProject
            ///
            this.sbtn_menuProject = new Ext.SplitButton();
            this.sbtn_menuProject.menu = this.menu_project;
            this.sbtn_menuProject.setText("Project");           
            this.gui.menuBar.addItem(this.sbtn_menuProject);
            
            ///STARTPAGE SECTION
			this.gui.startPage.actionsSection.addItem({///--- Create
                text:'New Project',
                iconCls:'icon-new-project',
                handler:_this.mitem_newProject_onclick.createDelegate(this)
            });
			
            this.gui.startPage.actionsSection.addItem({///--- Open
                text:'Open Project',
                iconCls:'icon-open-file',
                handler:_this.mitem_openProject_onclick.createDelegate(this)
            });
            
            /// RECENT PROJECTS
            //
            //this.recentProjectsManager
            //
            this.recentProjectsManager = new ProjectManager.RecentsManager();            
			this.gui.startPage.westCenterRegion.insert(1,this.recentProjectsManager.obj);
            this.gui.startPage.westCenterRegion.doLayout();           
            ///END STARTPAGE SECTION
            
            ///START Project Explorer Section
            this.explorer = new ProjectManager.Explorer();
            ///--- Barra de Proyecto
            ///
            ///btn_newProject
            ///            
            this.btn_newProject = new Ext.Button();
            this.btn_newProject.iconCls = 'icon-new-project';
            this.btn_newProject.setTooltip("New Project");
            this.btn_newProject.on('click',_this.mitem_newProject_onclick,this);
            this.gui.toolBar.insertItem(this.btn_newProject,0);
            ///
            ///openProject
            ///
            this.gui.toolBar.btn_openFile.on('click',_this.mitem_openProject_onclick,this);
        },
        initialize:function(response,opt){
            std.include("plugins/ProjectManager/cfg/config.js");            
			var data = Ext.util.JSON.decode(response.responseText);
			this.workspace = data.workspace;
			this.metadataFolderName = data.metadataFolderName;
		},
		buildComponent : function(params) {
			var _this = ProjectManager.prototype;
			
			var data = {};			
			data.progress = Ext.Msg.show({
				title:'<div align="center">Bulding Component</div>',
				wait:true,
				closable:true,
				msg:'This action may take several seconds, please wait' ,
				buttons: Ext.Msg.CANCEL,
				progressText: "Creating..." + params.item.name,
				width:350
			});
			
			data.method = 'POST';
			data.data = params;
			data.url = std.frontController.getRequest("buildComponent", "ProjectManager",params.item);
			data.success = _this.buildComponent_onsuccessparams.createDelegate(this);
			this.connection.request(data);
		},
		buildComponent_onsuccessparams : function(resp,opt) {
			var _resp = Ext.util.JSON.decode(resp.responseText);
			opt.progress.hide();
			if(_resp.success) {
				var callback = opt.data.on_success.createDelegate(opt.data.scope);
				callback(resp,opt.data);
			}
			else {
				Ext.Msg.alert("Project Manager",_resp.msg);
			}
		},
		showOpenProjectWindow:function(path){					
            var _this = ProjectManager.prototype;
            if(!path){
                var openFile = new OpenFileDialog({
                    initialDirectory: this.workspace,
                    title:'Open Project',
                    foldersOnly:true,
                    callback: _this.openProject.createDelegate(this)
                });
                openFile.show();
				
            }else{
                std.frontController.send({
                    action: 'getMetadata',
                    controller: 'ProjectManager',
                    params:{
                        'path': path
                    }
                });
            }
        },
        removeItems: function(params) {			
			var data = {};
			data.method = 'POST';
			data.data = params;
			data.url = std.frontController.getRequest("removeItems", "ProjectManager",{location:params.location,items:params.items});
			data.success = params.on_success.createDelegate(params.scope);
			this.connection.request(data);
		},
		getTemplatesData : function(params) {
			var data = {};
			data.method = 'POST';
			data.data = params;
			data.url = std.frontController.getRequest("getTemplatesData", "ProjectManager",params.params);
			data.success = params.on_success.createDelegate(params.scope);
			this.connection.request(data);
		},
        openProject:function(path){
            std.frontController.send({ 
				action: 'openProject',
				controller: 'ProjectManager', 
				params:{ 'path': path }
			});
        },
        exists : function() {	},
		makeProject:function(project){
			std.frontController.send({
				action: 'makeProject',
				controller: "ProjectManager",
				params: project.json()
			});
		},
        serverResponse : function(response){		
            var _this = ProjectManager.prototype;
            switch(response._action)
            {
                case 'makeProject':					
                    if(response.success){
                        this.openProject( response.path );
                    }
                    else
                    {
                        Ext.Msg.alert("Project Manager Message", 'Error during project creation:<br/>'+response.message);
                    }				
                    break;
                case 'openProject':
					if(response.success){
						var data = response.data;					
						this.explorer.openProject( data.project );
						if(this.recentProjectsManager!=null) this.recentProjectsManager.load();
						/*var proj = data.proj;
							
						///var name = data.projectInfo.vars.projectPath + data.projectInfo.vars.projectName; 
						var iframe = document.getElementById("iframe_"+data.proj.serial);
						if(iframe == null){
							///--- update main gui
							this.gui.center.addItem({
								layout:'fit',
								"title": "RUN-"+proj.name,///data.projectInfo.vars.projectName, 
								"id": 'tab_'+proj.serial,                        
								closable:true,
								html:"<iframe style='width:100%; height:100%;' src = 'http://"+_IP+_ADDRESS+proj.name+"/index.php' id='"+"iframe_"+data.proj.serial+"' onload='load'}/>"
							});
						
							/// kk para arreglar 
							std.mod.ErrorReporter.reporter.load(proj.path);	

							 
						}else
						{
							iframe.src = "http://"+_IP+_ADDRESS+proj.name+"/index.php";//data.projectInfo.vars.projectName;
						}*/
						return true;
					}
					else {
						Ext.Msg.alert("Project Manager Error",response.msg);
						return false;
					}
                    break;
                case 'getTplInfo':
                    this.projectWindow.customPanel.addCustomsInputs( response.projectConfig.vars1 );
                    this.projectWindow.customPanel.addCustomsInputs( response.appConfig.vars1 );
                    break;
                case 'getProjectTemplates':
                    alert(response.data);
                    break;
                case 'getProjectPhysicContent':
                    var content = response.data;
                    this.Explorer.loadProjectPhysicContent(content);
                    break;
                case 'getProjects':
                    alert('Respuesta'+response.data);
                    break;
            }
        },
		loadRecentProjects : function (params) {		
			var data = {};
			data.url = std.frontController.getRequest("loadRecentProjects", "ProjectManager");
			data.method = 'POST';
			data.success = params.on_success.createDelegate(params.scope);
			this.connection.request(data);
		},
		removeRecentProject : function(params) {	
			var data = {};
			data.url = std.frontController.getRequest("removeRecentProject", "ProjectManager", params.project_data);
			data.method = "POST";
			data.success = params.on_success.createDelegate(params.scope);
			data.params = params;
			this.connection.request(data);
		},
		mitem_newProject_onclick:function() {			
			this.createNewProjectWindow = new ProjectManager.CreateNewProjectWindow(this);
			this.createNewProjectWindow.show();
		},
		mitem_openProject_onclick:function(){
			this.showOpenProjectWindow();
		},
		addProject : function(project){
			this.projects.push(project);
			
			this.explorer.buildProjectNode(project);	
			
			if(!this.activeProject)
				this.setActiveProject(project);
			return project;
		},
		getActiveProject : function(){
			for(var p in this.projects)
				if(p != "remove")
					if(this.projects[p].path == this.activeProject)
						return this.projects[this.activeProject];
		},
		setActiveProject : function(project){
			var old = this.activeProject;	
			if(old) old.node.setText(old.node.text);
			project.node.setText("<b>"+project.node.text+"</b>");
			this.activeProject = project;
			return this.activeProject;
		}
    }
});
