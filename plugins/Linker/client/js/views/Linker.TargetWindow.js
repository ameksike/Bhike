var Linker_TargetWindow = function(linker_designer){
	///	CONSTRUCTOR
	this.linker_designer = linker_designer || null;
	this.controllers =  [];
	//ENDOF CONSTRUCTOR
	
	this.buildGUI = function(){
		var _this = Linker_TargetWindow.prototype;
		///
		///store
		///
		this.store = new Ext.data.ArrayStore({
			fields:[{
				name: 'trigger_class',
				type: 'string'
			}, {
				name: 'trigger_action',
				type: 'string'
			}, {
				name: 'target_class',
				type: 'string'
			},{
				name: 'target_action',
				type: 'string'
			},{
				name: 'mode',
				type: 'string'
			},{
				name: 'active',
				type: 'bool'
			}]
		});
		///
		///class_combo
		///
		this.class_combo = new Ext.form.ComboBox();
		this.class_combo.mode = 'local';
		this.class_combo.allowBlank = false;
		this.class_combo.emptyText = "[class]";
		this.class_combo.store = new Ext.data.JsonStore({fields:['file','name','methods']});
		this.class_combo.typeAhead = true;
		this.class_combo.triggerAction = 'all';
		this.class_combo.lazyInit = false;
		this.class_combo.displayField = 'name';
		this.class_combo.valueField = 'name';
		///
		///action_combo
		///
		this.action_combo = new Ext.form.ComboBox();
		this.action_combo.mode = 'local';
		this.action_combo.allowBlank = false;
		this.action_combo.emptyText = "[action]";
		this.action_combo.store = new Ext.data.JsonStore({fields:['name']});
		this.action_combo.typeAhead = true;
		this.action_combo.triggerAction = 'all';
		this.action_combo.lazyInit = false;
		this.action_combo.displayField = 'name';
		this.action_combo.valueField = 'name';		
		///
		///mode_combo
		///
		this.mode_combo = new Ext.form.ComboBox();
		this.mode_combo.mode = 'local';
		this.mode_combo.store = new Ext.data.ArrayStore();
		this.mode_combo.typeAhead = true;
		this.mode_combo.triggerAction = 'all';
		this.mode_combo.lazyInit = false;
		this.mode_combo.displayField = 'name';
		this.mode_combo.valueField = 'version';
		///
		///triggerClass_column
		///
		this.triggerClass_column = new Ext.grid.Column();
		this.triggerClass_column.header = "Trigger Class";
		this.triggerClass_column.menuDisabled = true;
		this.triggerClass_column.dataIndex = 'trigger_class';
		this.triggerClass_column.editor = this.class_combo;
		///
		///triggerAction_column
		///
		this.triggerAction_column = new Ext.grid.Column();
		this.triggerAction_column.header = "Trigger Action";
		this.triggerAction_column.menuDisabled = true;
		this.triggerAction_column.dataIndex = 'trigger_action';
		this.triggerAction_column.editor = this.action_combo;
		///
		///targetClass_column
		///
		this.targetClass_column = new Ext.grid.Column();
		this.targetClass_column.header = "Target Class";
		this.targetClass_column.menuDisabled = true;
		this.targetClass_column.dataIndex = 'target_class';
		this.targetClass_column.editor = this.class_combo;
		///
		///targetAction_column
		///
		this.targetAction_column = new Ext.grid.Column();
		this.targetAction_column.header = "Target Action";
		this.targetAction_column.menuDisabled = true;
		this.targetAction_column.dataIndex = 'target_action';
		this.targetAction_column.editor = this.action_combo;
		///
		///mode_column
		///
		this.mode_column = new Ext.grid.Column({
			editor : this.class_combo
		});
		this.mode_column.header = "Mode";
		this.mode_column.width = 70;
		this.mode_column.menuDisabled = true;
		this.mode_column.dataIndex = 'mode';
		//this.mode_column.editor = this.mode_combo;
		///
		///active_column
		///
		this.active_column = new Ext.grid.BooleanColumn({
			trueText:"Yes",
			falseText:"No"
		});
		this.active_column.header = 'Active';
		this.active_column.dataIndex = 'active';
		this.active_column.width = 50;
		this.active_column.menuDisabled = true;		
      	this.active_column.editor = new Ext.form.Checkbox({
          margins:'0px 0px 0px 10px'
      	});
		///
		///columns
		///
		this.columns = new Array();
		this.columns.push(new Ext.grid.RowNumberer());		
		this.columns.push(this.triggerClass_column);
		this.columns.push(this.triggerAction_column);
		this.columns.push(this.targetClass_column);
		this.columns.push(this.targetAction_column);
		this.columns.push(this.mode_column);
      	this.columns.push(this.active_column);
		///
		///columnModel
		///
		this.columnModel = new Ext.grid.ColumnModel({defaults:{resizable:false,sortable:true}, columns:this.columns, menuDisabled:true});
		///
		///editor_plugin
		///
		this.editor_plugin = new Ext.ux.grid.RowEditor({saveText: 'Update'});
		///
		///gridview
		///
		/*this.gridview = new Ext.grid.GroupingView();
        this.gridview.markDirty = false;*/
        ///
        ///rowSelectionModel
		///
		this.rowSelectionModel = new Ext.grid.RowSelectionModel();
		///
		///gridpanel
		///
		this.gridpanel = new Ext.grid.EditorGridPanel();
		this.gridpanel.selModel = this.rowSelectionModel;
		this.gridpanel.store = this.store;
		this.gridpanel.border = false;
		this.gridpanel.plugins = [this.editor_plugin];
		//this.gridpanel.view = this.gridview;    
		this.gridpanel.colModel = this.columnModel;
		this.gridpanel.on('beforeedit', _this.gridpanel_onbeforeedit,this);
		///
		///btn_addLink
		///
		this.btn_addLink = new Ext.Button();
		this.btn_addLink.setText("Add Link");
		this.btn_addLink.on('click',_this.btn_addLink_onclick,this);            
        ///
        ///btn_cancel
        ///
        this.btn_cancel = new Ext.Button();
        this.btn_cancel.setText("Cancel");
        this.btn_cancel.on('click',_this.btn_cancel_onclick,this);
        ///
        ///btn_apply
        ///
        this.btn_apply = new Ext.Button();
        this.btn_apply.setText("Apply");
        this.btn_apply.on('click',_this.btn_apply_onclick,this);
        ///
        ///btn_acept
        ///
        this.btn_acept = new Ext.Button();
        this.btn_acept.setText("Acept");
		///
		///obj
		///
		this.obj = new Ext.Window({closeAction : 'hide',defaults:{height:300},tbar:[this.btn_addLink]});
		this.obj.setTitle("Links Manager");
		this.obj.layout = 'hbox';
		this.obj.modal = true;
		this.obj.constrain = true;
		this.obj.setWidth(570);
		this.obj.resizable = false;
		this.obj.border = false;
		this.obj.add(this.gridpanel);
		this.obj.addButton(this.btn_cancel);
		this.obj.addButton(this.btn_apply);
		this.obj.addButton(this.btn_acept);
		this.obj.on('beforerender',_this.obj_onbeforerender,this);
		this.obj.on('close',function(){this.obj.hide();},this);
		this.obj.on('beforeshow',_this.obj_onbeforeshow,this);
	}	
}

Linker_TargetWindow.prototype.btn_apply_onclick = function(){
	if(this.gridpanel.getStore().getCount() > 0) { // then start graphic
		var classNames = this.joinArray(this.gridpanel.getStore().collect('trigger_class'),this.gridpanel.getStore().collect('target_class'));
		var models = [];
		for(var i in classNames)
			if(i != 'remove'){
				var targetFile = this.getFileNameOfClass(classNames[i]);
				models[classNames[i]] = new Linker_Model({
					'@attributes':{	Name: classNames[i], TargetFile: targetFile}
				});
				this.linker_designer.classes[classNames[i]]= models[classNames[i]];						
			}
		for(var i = 0; i < this.gridpanel.getStore().getCount(); i++){
			var record = this.gridpanel.getStore().getAt(i);
			if(models[record.data.trigger_class].oPorts.indexOf(record.data.trigger_action) == -1) models[record.data.trigger_class].oPorts.push(record.data.trigger_action);
			if(models[record.data.target_class].iPorts.indexOf(record.data.target_action) == -1) models[record.data.target_class].iPorts.push(record.data.target_action);
			
			this.linker_designer.addLink(new Link(record.data));						
		}		
		this.linker_designer.renderDiagram();
	}
}

Linker_TargetWindow.prototype.getFileNameOfClass = function(className){
	for(var i in this.controllers)
		if(i != 'remove')
			if(this.controllers[i].name == className)
				return this.controllers[i].file;
	return false;
}

Linker_TargetWindow.prototype.joinArray = function(){
	var array = [];
	var found = [];
	for(var i in arguments)
		if(i != 'remove')
			for(var j in arguments[i])
				if(j!= 'remove' && !found[arguments[i][j]]){
					array.push(arguments[i][j]);
					found[arguments[i][j]] = true;
				}
	return array;
}

Linker_TargetWindow.prototype.btn_addLink_onclick = function(){
	var l = new Ext.data.Record({
		trigger_class: '[class]',
		trigger_action: '[action]',
		target_class: "[class]",
		target_action:'[action]',
		mode:'pre-order',
		active: true
	});
	this.gridpanel.getStore().insert(this.gridpanel.getStore().getCount(), l);
	this.gridpanel.getView().refresh();
	this.gridpanel.getSelectionModel().selectRow(this.gridpanel.getStore().getCount()-1);
}

Linker_TargetWindow.prototype.btn_cancel_onclick = function(e){
	this.obj.hide();
}
	
Linker_TargetWindow.prototype.gridpanel_onbeforeedit = function(e){
	var column = this.gridpanel.getColumnModel().getColumnById(this.gridpanel.getColumnModel().getColumnId(e.column));
	if(column.editor.id == this.action_combo.id)
	{	
		var prev_column = this.gridpanel.getColumnModel().getColumnById(this.gridpanel.getColumnModel().getColumnId(e.column - 1));
		var value = e.record.get(prev_column.dataIndex);

		var record = prev_column.editor.getStore().getAt(prev_column.editor.getStore().find('name',value));
		if(record){
			column.editor.getStore().loadData(record.data.methods);
		}
		else
			e.cancel = true;
	}	
}

Linker_TargetWindow.prototype.classTree_oncheckchange = function(node,checked){
	if(checked){
		if(this.linker_designer){
			this.linker_designer.addClass(this.controllers[node.id]);
			var arrow = this.linker_designer.uml.arrow;

			//this.linker_designer.diagrammed_classes[0].port("o", "out1").joint(this.linker_designer.diagrammed_classes[1].port("i", "in"), arrow);
	
		}
	}
	else {
		this.linker_designer.removeClass(this.controllers[node.id]);
	}
}
	
Linker_TargetWindow.prototype.addClasses = function(){
	var result = [];
	for(i in this.controllers)
		if(i != 'remove'){
			result.push(this.controllers[i]);
		}
	this.class_combo.getStore().loadData(result);
}

Linker_TargetWindow.prototype.obj_onbeforeshow = function(){
	var links = this.linker_designer.links;
	var data = [];
	for(var l in links)
		if(l != 'remove') {
			data.push([
				links[l].trigger_class,
				links[l].trigger_action,
				links[l].target_class,
				links[l].target_action,
				links[l].mode,
				links[l].active])
		}
	this.gridpanel.getStore().loadData(data);
}

Linker_TargetWindow.prototype.obj_onbeforerender = function(cmp,e){
	this.getControllers({
		scope:this,
		success: function(response,option){
			var data  = Ext.util.JSON.decode(response.responseText);			
			for(i in data.classes_data)	
				if(i != 'remove')
					if(typeof this.controllers[data.classes_data[i].file] === 'undefined'){
						this.controllers[data.classes_data[i].file] = { 
							name:data.classes_data[i].name, 
							methods:data.classes_data[i].methods,
							file:data.classes_data[i].file
						};
					}
			this.addClasses();
		}
	});	
}

Linker_TargetWindow.prototype.getControllers = function(params){
	var connection = new Ext.data.Connection();
	connection.request({
		url:'../dev/project/testedproj/index.php/Linker/getControllers',
		method:'POST',
		scope:params.scope,
		success: params.success,
      	failure:function(response,opt){
          Ext.Msg.alert("Error",'Server-side failure with status code ' + response.status);
      	},
		params:params.params      
	});
}

Linker_TargetWindow.prototype.show = function(c){
	this.obj.show();
}


