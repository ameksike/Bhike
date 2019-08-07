Kcl.Class('Linker.Designer', 
{
	extend:Linker.Designer,
	property:{
		connection : new Ext.data.Connection()
	},
	btn_loadFile_onclick : function(btn,e){
	},
	extractContent : function(content){
		for(var i in content.Class)
			if(i != 'remove') {
				this.addClass(content.Class[i]);
			}
		for(var l in content.Link)
			if(l != 'remove')
				this.addLink(content.Link[l]);
	},
	paintDiagram : function(){
		var x = 0;
		for(i in this.classes){
			if(i != 'remove') {
				var new_class = {};
				new_class.label = this.classes[i].name;
				new_class.rect	= {x: x+=200, y: 50, width: 150, height: 60 + this.classes[i].methods.length*12};
				new_class.shadow = true;
				new_class.attrs = { fill: "90-#000-green:1-#fff" };
				new_class.labelAttrs = {'font-weight': 'bold'};
				new_class.methods = this.classes[i].methods;
				var strData = Ext.util.JSON.decode(this.uml.Model.create(new_class).stringify());
				strData.file = this.classes[i].file;
				//this.diagrammed_classes.push(strData);
				/*var j910 = s9.joint(s10, uml.arrow).label("label 1");
				var j911 = s9.joint(s11, uml.arrow).label("label 2");
				var j119 = s11.joint(s9, uml.arrow).label("label 3");*/
			}
		}
	},
	renderDiagram : function(){
		/// clear the paper
		var x = 0;
		for(i in this.classes)
			if(i != 'remove') {
				//var rect = this.classes[i].rect || this.getRect();
				//this.classes[i].setRect({x: x += 200,y:rect.Y + 30,height:rect.Height,width:rect.Width});
				
				/// setting the class object and its configuration
				this.classes[i].setObject(this.uml.Model.create(this.classes[i]));
				this.classes[i].obj.toggleGhosting();		
				
				Joint.dia.register(this.classes[i].obj);
			}
		var arrow = Joint.dia.uml.arrow;
		for(var l in this.links)
			if(l != 'remove') {			
				var link = this.classes[this.links[l].trigger_class].obj.port("o", this.links[l].trigger_action).joint(this.classes[this.links[l].target_class].obj.port("i", this.links[l].target_action), arrow);
				//link.setVertices(['375 380']);
				//link.registerForever(this.classes);
				var label = link.label(this.links[l].mode);
			}	
	},
	initializeDesigner : function(){
		var _this = Linker_Designer.prototype;
		///
		///paper
		///
		this.paper = Joint.paper(this.obj.body.dom);
		///
		///dropTargetConfig
		///
		this.dropTargetConfig = new Object();
		this.dropTargetConfig.ddGroup = 'editable';
		this.dropTargetConfig.notifyEnter = _this.dropTarget_notifyEnter.createDelegate(this);
		this.dropTargetConfig.notifyDrop = _this.dropTarget_notifyDrop.createDelegate(this);
		///
		///dropTarget
		///
		this.dropTarget = new Ext.dd.DropTarget(this.obj.body.dom, this.dropTargetConfig);
		///keymap
		//this.keymap = new Ext.KeyMap(this.designer.canvas);
		//this.keymap.addBinding({key: 's',fn: function(){ alert("Return was pressed"); }});			
		///
		Ext.EventManager.on(this.obj.body.dom,'contextmenu',_this.obj_oncontextmenu,this);
		Ext.EventManager.on(this.obj.body.dom,'keyup',function(){alert('pressed')},this);	
	},
	menuI_saveDiagram_onclick : function(mi,e){
		
		var classes_collection = [];
		for(var c in this.classes)
			if(c != 'remove') classes_collection.push(this.classes[c].save());
		
		this.connection.request({
			url:std.frontController.getRequest("Linker","saveDiagram"),
			method:'POST',
			params:{
				data: Ext.util.JSON.encode({
					name:this.fileName,
					project:'BHike',
					type:'Application',
					version:'1.0',
					content:{ classes:classes_collection, links:this.links}
				})
			},
			scope:this,
			success: function(response,option){
				alert('Allen gut!!!');
			}
		});
	},
	menuI_paperOptions_onclick : function(mi,e){
		console.log(this.classes.ErrorReporter.obj);
	},
	menuI_resetPaper_onclick : function(mi,e){
		Joint.resetPaper(this.paper);
	},
	obj_onresize : function(cmp,adW,adH,rawWd,rawHt){		
		this.paper.setSize(adW > this.paper.width ? adW : this.paper.width, adH > this.paper.height ? adH : this.paper.height);		
	},
	obj_oncontextmenu : function(e,obj,cfg){		
		e.stopEvent(true);
		this.contextmenu.showAt(e.getXY())
	},
	dropTarget_notifyEnter : function(ddSource, e, data) {
		//Add some flare to invite drop.
		this.obj.body.stopFx();
		this.obj.body.highlight();
	},
	dropTarget_notifyDrop : function(ddSource, e, data){
		// Reference the record (single selection) for readability
		//var selectedRecord = ddSource.dragData.selections[0];
		var targetWindow = new Linker_TargetWindow(this,this.classes);
		targetWindow.getControllers({success:function(resp){alert(resp.responseText);}});
		// Load the record into the form
		//this.obj.getForm().loadRecord(selectedRecord);
		// Delete record from the grid.  not really required.
		//ddSource.grid.store.remove(selectedRecord);
		return(true);
	},
	removeClass : function(classData){
		this.classes.pop();
	},
	addClass : function(classData){
		var new_model = new Linker_Model(classData);
		this.classes[new_model.label] = new_model;
	},
	addLink : function(linkData){
		var new_link = new Link(linkData);
		this.links.push(new_link);
	},
	getRect : function(){
		var margin = 100;
		var x = this.classes.length > 0 ? this.classes[this.classes.length-1].obj.properties.rect.x+this.classes[this.classes.length-1].obj.properties.rect.width : 0;
		return {x: x += margin,y:this.currentY + margin,height:60,width:120};
	},
	btn_loadModule_onclick : function(btn,e){
		this.targetWindow.show();
	}
});
