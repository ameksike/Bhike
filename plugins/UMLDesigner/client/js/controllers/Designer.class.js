Kcl.Class( 'Designer', 
{
	extend:Designer,
	property:{
		connection: new Ext.data.Connection()
	},
    behavior:{
        construct: function(params){
			params!=null && params.title != null ? this.title = params.title : this.title = 'New Diagram';
			this.buildGUI();	
        },
		initializeDesigner:function(){
			this.designer = Joint.paper(this.obj.body.dom);
			var uml = Joint.dia.uml;

			var client = uml.Class.create({
			  rect: {x: 260, y: 20, width: 100, height: 50},
			  label: "Kcl.App",
			  shadow: true,
			  attrs: {
				//fill: "90-#000-#f00:1-#fff"
				fill: "#99BBE8"
			  },
			  labelAttrs: {
				'font-weight': 'bold'
			  }
			});

			var aggregate = uml.Class.create({
			  rect: {x: 100, y: 100, width: 120, height: 80},
			  label: "<<interface>>\nAggregate",
			  swimlane1OffsetY: 30,
			  shadow: true,
			  attrs: {
			//    fill: "90-#000-yellow:1-#fff"
				fill: "#99E8BB"
			  },
			  labelAttrs: {
				'font-weight': 'bold'
			  },
			  methods: ["+createIterator()"]
			});

			var iterator = uml.Class.create({
			  rect: {x: 400, y: 100, width: 120, height: 80},
			  label: "<<interface>>\nIterator",
			  swimlane1OffsetY: 30,
			  shadow: true,
			  attrs: {
			//    fill: "90-#000-yellow:1-#fff"
				fill: "#99E8BB"
			  },
			  labelAttrs: {
				'font-weight': 'bold'
			  },
			  methods: ["+next()"]
			});

			var concreteAggregate = uml.Class.create({
			  rect: {x: 95, y: 250, width: 130, height: 70},
			  label: "Concrete Aggregate",
			  shadow: true,
			  attrs: {
			//    fill: "90-#000-green:1-#fff"
				fill: "green"
			  },
			  labelAttrs: {
				'font-weight': 'bold'
			  },
			  methods: ["+createIterator(): Context"]
			});

			var concreteIterator = uml.Class.create({
			  rect: {x: 395, y: 250, width: 130, height: 80},
			  label: "Concrete Iterator",
			  shadow: true,
			  attrs: {
			//    fill: "90-#000-green:1-#fff"
				fill: "green"
			  },
			  labelAttrs: {
				'font-weight': 'bold'
			  },
			  attributes:["-example"],
			  methods: ["+next(): Context"]
			});

			var all = [client, aggregate, iterator, concreteAggregate, concreteIterator];

			client.joint(aggregate, uml.dependencyArrow).setVertices([{x: 159, y: 45}]).register(all);
			client.joint(iterator, uml.dependencyArrow).setVertices([{x: 460, y: 45}]).register(all);
			concreteAggregate.joint(aggregate, uml.generalizationArrow).register(all);
			concreteIterator.joint(iterator, uml.generalizationArrow).register(all);
		},
		Designer_onchange:function(Designer,changes){
			this.modified = true;
			this.obj.setTitle(this.title + '*');
			std.mod.Main.gui.toolBar.btn_save.enable();
			std.mod.Main.gui.toolBar.btn_undo.enable();
			std.mod.Main.gui.toolBar.btn_redo.enable();
		},
		textArea_onresize:function(){
			if(this.Designer !== null)
				this.Designer.refresh();
		},
		btn_comment_onclick:function(){
			var selection = this.Designer.getLine();
		},
		btn_uncomment_onclick:function(){
			//this.setTheme('elegant');
		},
		obj_onactivate:function(){
			std.mod.Main.gui.toolBar.btn_save.setDisabled(!this.modified);
			std.mod.Main.gui.toolBar.btn_undo.setDisabled(!this.modified);
			std.mod.Main.gui.toolBar.btn_redo.setDisabled(!this.modified);
			std.mod.Main.gui.toolBar.btn_save.addListener('click',this.save,this);
			std.mod.Main.gui.toolBar.btn_undo.addListener('click',this.Designer.undo);
			std.mod.Main.gui.toolBar.btn_redo.addListener('click',this.Designer.redo);
		},
		obj_ondeactivate:function(){
			std.mod.Main.gui.toolBar.btn_save.removeListener('click',this.save,this);
		},
		obj_onclose:function(){
			std.mod.CodeDesigner.openResources[this.id] = null;
		},
		setValue:function(val){
			if(val)
				this.Designer.setValue(val);
		},
		setMode:function(mode){
			if(mode == 'js')
				mode = 'javascript';
			this.Designer.setOption('mode',mode);
		},
		setTheme:function(theme){
			if(theme)
			this.Designer.setOption('theme',theme);
		},
		save:function(a,b,c){
			this.connection.request({
				url:std.FrontController.getRequest("saveFile", "CodeDesigner",{file: this.id,data: this.Designer.getValue() }),
				method:'POST',
				callback:this.onsaved.createDelegate(this)
			});
		},
		onsaved:function(config,success,response){
			var resp = Ext.util.JSON.decode(response.responseText);
			if(resp.success){
				this.modified = false;			
				this.obj.setTitle(this.title);
				std.mod.Main.gui.toolBar.btn_save.setDisabled(true);
			}
			else
				Ext.Msg.alert("Error",resp.msg);
			
		},
		autocomplete:function(cm){
			CodeMirror.simpleHint(cm, CodeMirror.javascriptHint);
		}
    }
});
