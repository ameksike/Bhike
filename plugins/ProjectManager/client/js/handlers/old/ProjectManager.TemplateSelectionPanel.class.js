Kcl.Class('ProjectManager.TemplateSelectionPanel',
{
	extend:ProjectManager.TemplateSelectionPanel,
	on_selectionchange_defaultSelectionModel : function(sm,node){
		this.project.icon = node.attributes.icon;
		this.project.attributes.type = node.attributes.projecttype;
		this.project.description = node.attributes.description;
		this.project.attributes.path = this.txt_itemLocation.getValue();    
	},
	updateApp : function(){
		var data = this.templatesViewer.getActiveItem().store.getAt(this.templatesViewer.getActiveItem().selectedIndex()).data;
		this.project.app.attributes.name = this.txt_itemName.getValue();
		this.project.app.attributes.type = data.name;
		this.project.app.icon = data.icon;
	},
	on_click_btn_iconView : function(){
		var _that = ProjectManager.TemplateSelectionPanel.prototype;
		this.templatesViewer.setActiveElement(0);
	},
	on_click_btn_detailView : function(){
		var _that = ProjectManager.TemplateSelectionPanel.prototype;
		this.templatesViewer.setActiveElement(1);
	},
	on_select_cmb_sortSelect : function(cmb,record,index){    
		var v = cmb.getValue();
		var active = this.templatesViewer.getActiveItem();
		active.store.sort(v, 'asc');
		active.selectItem(0);
	},
	on_keyup_txt_filter : function(){
		this.filter();
	},
	filter : function(){
		var active = this.templatesViewer.getActiveItem();
		active.store.filter('name',this.txt_filter.getValue());
		active.selectItem(0);
	},
	on_click_btn_locationBrowse : function(){
		var _this = this;
		var openFile = new OpenFileDialog({
			initialDirectory:this.txt_itemLocation.getValue(),
			title:'Select Path',
			onlyFolder:true,
			callback:function(path){
				_this.txt_itemLocation.setValue(path)
			}
		});
		openFile.show();
	},
	on_keyup_txt_projectName : function(){
		if(this.txt_projectName.changeable)
			this.txt_projectName.changeable = false;
		this.project.attributes.name = this.txt_projectName.getValue();
	},
	on_keyup_txt_itemName : function(comp,e){
		this.txt_itemName.changeValue(comp.getValue());
	},
	changeValue_txt_itemName : function(value){
		var _that = ProjectManager.TemplateSelectionPanel.prototype;
		this.txt_itemName.setValue(value);
		var proj = this.txt_projectName;
		if(proj.changeable){
			proj.setValue(this.txt_itemName.getValue());
			this.project.attributes.name = proj.getValue();
		}        
	},
	txt_itemLocation_onchange : function(cmp,nv,ov){
		this.project.attributes.path = nv;
	},
	on_selectionchange_gridSelectionModel : function(sm){
		var _that = ProjectManager.TemplateSelectionPanel.prototype;
		var selNode = sm.getSelected();
		if(selNode){
			var data = this.lookup[selNode.data.name];
			this.readTemplateDataUI(data); 
			//this.getsTarget();
		}else{        
			this.detailsPanel.body.update();
			//this.losesTarget();
		}
	},
	on_selectionchange_dataView : function(dv,selections){		
		var selNode = dv.getSelectedNodes();
		//var detailEl = this.detailsPanel.body;
		if(selNode && selNode.length > 0){
			selNode = selNode[0];        
			var data = this.lookup[selNode.id];
			this.readTemplateDataUI(data);        
			//this.getsTarget();
		}else{
			//Ext.getCmp('btn_next').disable();
			//this.txt_itemName.changeValue("");
			this.detailsPanel.body.update();
			//this.losesTarget();
		}
	},
	on_beforeselect_dataView : function(view,node,selections){
		return view.store.getRange().length > 0;
	},
	dataView_oncontainerclick:function(dv,e){
		return false;
	},
	readTemplateDataUI : function(data) {
		this.btn_locationBrowse.setDisabled(data.enablelocationbrowsebutton === false);
		switch(data.locationfield){
			case 'Disabled':
				this.form.setHeight(70);
				this.obj.doLayout();
				this.pnl_openFile.disable();
				break;
			case 'Hidden':
				this.form.setHeight(45);
				this.obj.doLayout();
				this.pnl_openFile.hide();
				break;
			default:
				this.form.setHeight(70);
				//this.obj.doLayout();
				this.pnl_openFile.enable();
				this.pnl_openFile.show();
				break;
		}
		this.detailsPanel.body.hide();
		this.detailsTemplate.overwrite(this.detailsPanel.body, data);
		this.detailsPanel.body.slideIn('l', {
			stopFx:true,
			duration:.1
		});        
		this.txt_itemName.changeValue(data.name);
		this.updateApp();
	},
	selectedItemId_dataView : function(){
		var selNode = this.getSelectedNodes();//[0].projectType;
		selNode = selNode[0];
		return selNode.id;
	},
	selectItem_dataView : function(item){
		this.select(item);
	},
	selectedIndex_dataView : function(){
		var selNode = this.getSelectedIndexes();//[0].projectType;
		return selNode[0];
	},
	onLoadException : function(v,o){
		var _that = ProjectManager.TemplateSelectionPanel.prototype;
		var active = _that.templatesViewer.getActiveItem();
		active.getEl().update('<div style="padding:10px;">Error loading templates.</div>');
	},
	hasTarget_dataView : function(){
		if(this.getSelectedNodes().lenght != 0)
			return true;
		return false;
	},
	selectedIndex_gridPanel : function(){
		var selected = this.getSelectionModel().getSelected();
		return this.getStore().indexOf(selected);
	},
	selectItem_gridPanel : function(item){
		this.getSelectionModel().selectRow(item);
	},
	selectedItemId_gridPanel : function(){
		var selNode = this.getSelectionModel().getSelected();
		return selNode.data.name;
	},
	hasTarget_gridPanel : function(){
		return this.getSelectionModel().hasSelection();
	},
	getActiveItem_templatesViewer : function(){
		var _that = ProjectManager.TemplateSelectionPanel.prototype;
		var lay = this.templatesViewer.getLayout().activeItem
		return lay;
	},
	setActiveElement_templatesViewer : function(item){
		var viewer = this.getActiveItem();
		var index = viewer.selectedIndex();
		var lay = this.getLayout();
		lay.setActiveItem(item);
		viewer = this.getActiveItem();
		viewer.selectItem(index);
	},
	on_rowselect_gridSelectionModel : function(val){
		return '<img class="list-thumb" src="'+val+'"/>';
	},
	renderer_gridColumn1 : function(value, metaData, record, rowIndex, colIndex, store){
		return '<img class="list-thumb" src="'+record.data.icon+'"/>' + value;
	},
	obj_onshow:function(){
		if(this.tree.root.childNodes.length == 0){
			this.tree.fireEvent('beforeexpand');
		}
	},
	tree_onbeforeexpand : function(tree) {
		std.mod.ProjectManager.getProjectTemplates({callback:TemplateSelectionPanel.prototype.loadProjectData.createDelegate(this)});
		this.txt_itemLocation.setValue(std.mod.ProjectManager.workspace);
	},
	tree_on_append : function(tree,parent,node,index){
		//alert('algo');
		this.tree.getSelectionModel().select(this.tree.root.firstNode);
	},
	on_click_tree : function(node, e){
		if(node.isSelected() && node.isExpanded())
			this.showNodeDetail(node);
		else
			node.expand();
	},
	on_beforeselect_defaultSelectionModel : function(sm,node,oldnode){
		var _that = ProjectManager.TemplateSelectionPanel.prototype;
		std.mod.ProjectManager.getAppTemplates({callback:TemplateSelectionPanel.prototype.loadApplicationData.createDelegate(this),projecttype:node.attributes.projecttype});     
		this.swapWizard(node.attributes.wizard,oldnode && oldnode.attributes.wizard?oldnode.attributes.wizard:null);
	},
	findNode : function(params) {
		var node = params.node.findChild(params.attribute,params.value);
		if(node != null)
			return node;
		else {
			var children = params.node.childNodes;
			
			for(var i = 0; i < children.length;i++){
				params['node'] = children[i];
				return this.findNode(params)
			}            
		}
	},
	showNodeDetail : function(node){
		var selNode = node;
		var detailEl = this.detailsPanel.body;
		if(selNode){
			detailEl.hide();
			this.detailsTemplate.overwrite(detailEl,selNode.attributes);
			detailEl.slideIn('l', {
				stopFx:true,
				duration:.1
			});
		}else{
			Ext.getCmp('btn_next').disable();
			detailEl.update('');
		}
	}
});

ProjectManager.TemplateSelectionPanel.prototype.loadDependencies = function(wizardextension){
	if(typeof(wizardextension.Item) == "object"){
		for(i in wizardextension.Item )
			if(i !== 'remove')
				std.include(wizardextension.Item[i]);
	}
	else
		std.include(wizardextension.Item);
}

ProjectManager.TemplateSelectionPanel.prototype.initializeWizard = function(project,app){
	var project = project || this.tree.getSelectionModel().getSelectedNode();
	var app = app ;//|| this
	if(project.attributes.wizardextension != null) {
		var wizardextension = project.attributes.wizardextension;
		if(project.attributes.wizard == null){
			var Assembly = wizardextension.Assembly;					
			//try{
				/// THIS LINE MOST BE REPLACED FOR A KCL.FACTORY() METHOD CALL TO AVOID ERRORS INCLUSION, INJECTION.
				var string2 = "new "+Assembly+"({id:'"+project.id+"'});"
				var wizard = eval(string2);
				if(wizard instanceof IWizard){
					project.attributes.wizard = wizard;
					project.attributes.wizard.buildGUI();		
					this.swapWizard([project.attributes.wizard]);//,app.wizard]);
				}				
			/*}catch(e){
				Ext.Msg.alert("Error", e);
			}*/
		}
	}
}

ProjectManager.TemplateSelectionPanel.prototype.swapWizard = function(wizard,old){
	std.mod.ProjectManager.projectWindow.wizard.setIterable(wizard && wizard.collection);
	if(wizard instanceof Array){
		for(w in wizard){
			if(w != "remove" && wizard[w] && wizard[w].collection){
				for(var i = 0; i < wizard[w].collection.length;i++){
					if(!std.mod.ProjectManager.projectWindow.wizard.isContained(wizard[w].collection[i]))
						std.mod.ProjectManager.projectWindow.wizard.add(wizard[w].collection[i]);
				}
			}
		}
	}
	else {
		if(wizard && wizard.collection){
			for(var i = 0; i < wizard.collection.length;i++){
				if(!std.mod.ProjectManager.projectWindow.wizard.isContained(wizard.collection[i]))
					std.mod.ProjectManager.projectWindow.wizard.add(wizard.collection[i]);
			}
		}
	}
}

ProjectManager.TemplateSelectionPanel.prototype.loadApplicationData = function(loader,success,response) {
	response = Ext.util.JSON.decode(response.responseText);
	this.store.loadData(response.info);
	this.store.sort('sortorder','ASC');
    this.templatesViewer.getActiveItem().selectItem(0);
    
    this.initializeWizard();
}

String.prototype.ellipse = function(maxLength){
    if(this.length > maxLength){
        return this.substr(0, maxLength-3) + '...';
    }
    return this;
}
