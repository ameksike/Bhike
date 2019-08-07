Kcl.Class('Linker.Designer',{
	behavior:{
		construct: function(params,lnk){
			///	CONSTRUCTOR
			this.gui = params!= null && params.gui != null ?  params.gui : null;
			this.id = params!= null && params.id != null ? params.id : Ext.id();
			this.fileName = params!= null && params.name != null ?  params.name : "New Linker Diagram";	
			this.classes = params!= null && params.classes != null ?  params.classes : [];
			this.links = params!= null && params.links != null ?  params.links : [];	
			///
			///uml
			///	
			this.uml = Joint.dia.devs;
			
			this.paper = null;
			this.targetWindow = new Linker_TargetWindow(this);
			
			this.currentX = 0;
			this.currentY = 0;
			this.extractContent(params.content);
			//ENDOF CONSTRUCTOR
					
			this.buildGUI(params);
		},
		buildGUI:function(params){
			var _this = Linker_Designer.prototype;
			this.targetWindow.buildGUI();
			///
			///btn_loadModules
			///
			this.btn_loadModules = new Ext.Button();
			this.btn_loadModules.setText("Build Diagram");
			this.btn_loadModules.on('click',_this.btn_loadModule_onclick,this);
			///
			///btn_loadFile
			///
			this.btn_loadFile = new Ext.Button();
			this.btn_loadFile.setText("Load Diagram");
			this.btn_loadFile.on('click',_this.btn_loadFile_onclick,this);
			///
			///toolbar
			///
			this.toolbar = new Ext.Toolbar();
			this.toolbar.add(this.btn_loadModules);
			this.toolbar.add(this.btn_loadFile);
			///
			///menuI_saveDiagram
			///
			this.menuI_saveDiagram = new Ext.menu.Item();
			this.menuI_saveDiagram.setText("Save Diagram");
			this.menuI_saveDiagram.iconCls = 'icon-save';
			this.menuI_saveDiagram.on('click',_this.menuI_saveDiagram_onclick,this);
			///
			///menuI_resetPaper
			///
			this.menuI_resetPaper = new Ext.menu.Item();
			this.menuI_resetPaper.setText("Reset Paper");
			this.menuI_resetPaper.on('click',_this.menuI_resetPaper_onclick,this);
			///
			///menuI_paperOptions
			///
			this.menuI_paperOptions = new Ext.menu.Item();
			this.menuI_paperOptions.setText("Options");
			this.menuI_paperOptions.on('click',_this.menuI_paperOptions_onclick,this);		
			///
			///contextmenu
			///
			this.contextmenu = new Ext.menu.Menu();
			this.contextmenu.addItem(this.menuI_saveDiagram); 
			this.contextmenu.addItem(this.menuI_resetPaper);        
			this.contextmenu.addItem("-");        
			this.contextmenu.addItem(this.menuI_paperOptions);		
			///
			///obj
			///					
			this.obj = new Ext.Panel({tbar:this.toolbar});
			this.obj.id = this.id;
			this.obj.setTitle(this.fileName);
			this.obj.bodyStyle = 'height:100%; width:100%;';		
			this.obj.region = 'center';
			this.obj.closable = true;
			//this.obj.html = '<rect id="ass_uid33"> algo aqui</rect>';
			this.obj.layout = 'fit';
			this.obj.autoScroll = true;
			this.obj.ddGroup = 'editable';
			this.obj.on('render',_this.initializeDesigner,this);		
			this.obj.on('resize',_this.obj_onresize,this);
			//this.obj.on('activate',_this.obj_onactivate,this);
			//this.obj.on('deactivate',_this.obj_ondeactivate,this);
			//this.obj.on('close',_this.obj_onclose,this);
			
			this.gui.center.add(this.obj);
			this.gui.center.activate(this.obj);
		}
	}
});
