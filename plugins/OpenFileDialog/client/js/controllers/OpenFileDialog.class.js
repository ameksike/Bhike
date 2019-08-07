Kcl.Class('OpenFileDialog',{
	extend:OpenFileDialog,
	property:{
		connection:new Ext.data.Connection()
	},
	formatSize : function(data){
		if(data.size < 1024) {
			return data.size + " bytes";
		} else {
			return (Math.round(((data.size*10) / 1024))/10) + " KB";
		}
	},
	formatData : function(data){
		data.shortName = data.name.ellipse(15);
		data.sizeString = this.formatSize(data);
		//data.description = new Date(data.description).format("m/d/Y g:i a");
		this.lookup[data.name] = data;
		return data;
	},
	show : function(){ this.obj.show(); },
	obj_onafterrender : function(){
		this.tree.getRootNode().expand();	
		this.gridpanel.focus();	
	},
	tree_onbeforeexpandnode : function(node,deep,anim){
		var _this = OpenFileDialog.prototype;
		this.connection.request({
			url:std.frontController.getRequest("nodesRouter", "OpenFileDialog",{
				path    : node.attributes.path,
				typeOfNode  : node.attributes.text
			}),
			method:'POST',
			success:_this.onNodesRoutered,
			node:node,
			scope:this
		});		
	},
	onNodesRoutered : function(response,opt){
		var result = Ext.util.JSON.decode(response.responseText);
		var data = result.data;
		if(result.success){
			if(opt.node.hasChildNodes())
				opt.node.removeAll(true);
			for(var i in data)
				if(i != 'remove'){				
					var newNode = new Ext.tree.TreeNode(data[i]);
					opt.node.appendChild(newNode);
				}
		}
		else
			console.log(result.msg);
	},
	gridColumn2_renderer : function(val,a,store){
		var empty = '';
		if(store.data.empty)
			empty = " [Empty folder]"
		return '<div class="filedata"><img class="list-thumb" src="'+store.data.icon+'"/><div class="filename">'+val+empty+'</div></div>';
	},
	on_keypress_obj : function(e){
		var _that = OpenFileDialog.prototype;
		if(e.getKey() == e.BACKSPACE)
			this.stepBack();
	},
	on_render_searchFilter : function(){
		var _that = OpenFileDialog.prototype;
	//_that.searchFilter.getEl().on('keyup', _that.filter)
	},
	tbItem4_onclick : function(){
		if(this.tree.getRootNode().isExpanded()){
			this.tree.root.expanded = false;
			this.tree.getRootNode().removeAll();
		}
		this.tree.root.expand();
		this.loadData();
	},
	addressBar_onkeypress : function(cmb,e){
		switch(e.getKey()){
			case e.ENTER:
			this.loadData(this.addressBar.getValue());
			break;        
		}
	},
	store1_onload : function(){
		var _that = OpenFileDialog.prototype;
		/*_that.store.load({
			params:{
				'path'		: _that.addressBar.getValue(),
				'extension' : _that.extensionBox.getValue().split('.')[1]
			}
		});*/
	},
	store1_onbeforeload : function(sts,obj){
		var _that = OpenFileDialog.prototype;
		params = {
			path	:_that.addressBar.getValue()
		}
	},
	tree_onclick : function(node,event){
		var _that = OpenFileDialog.prototype;
		this.addressBar.setValue(node.attributes.path);
		/*this.store.load({
			params:{
				'path'		: this.addressBar.getValue(),
				'extension' : this.extensionBox.getValue().split('.')[1]
			}
		});*/
		this.loadData(node.attributes.path);
		node.expand();
		this.tree.getSelectionModel().select(node);
	},
	defaultSelectionModel_onbeforeselect : function(sm,node){
		//_that.loadData(node.attributes.path);
		//sm.select(node);
    },
    gridpanel_onafterrender : function(){
		var _that = OpenFileDialog.prototype;
		this.appViewer.getActiveItem().focus();
		this.loadData(this.initialDirectory);
	},
	gridpanel_onrowdblclick : function(gd,rIndex,e){
		gd.getSelectionModel().selectRow(rIndex);
	},
	gridpanel_onkeydown : function(e){
		var _that = OpenFileDialog.prototype;
		e.stopEvent();
		var smodel = this.gridpanel.getSelectionModel();
		switch(e.getKey()){
			case e.ENTER:
				/*if(this.gridpanel.getSelectionModel().getSelections().length > 0)
					if(smodel.getSelections().length == 1)
					{	
						var record = smodel.getSelected();
						if(record.data.fileType=='Folder')
							this.loadData(record.data.path);
						else
							this.getPath();
					}*/
				this.gridpanel.fireEvent('rowdblclick');    
				break;
			case e.BACKSPACE:			
				_that.stepBack();
				break;
			case e.DELETE:
				if(smodel.getSelections().length > 0)
					_that.deleteFiles(smodel.getSelections());
				break;
			case e.ARROWUP:										
				smodel.selectPrevious();
				break;	
			case e.ARROWDOWN:										
				smodel.selectNext();
				break;
			case e.F2:
				alert("Rename");
				break;
		}
	},
	gridpanel_onrowclick : function(grid,rowIndex,e){
		var _that = OpenFileDialog.prototype;
		
		grid = grid || this.gridpanel;
		rowIndex = rowIndex || grid.getStore().indexOf(grid.getSelectionModel().getSelected());
		var res = grid.getStore().getAt(rowIndex);
		//alert(res.data.fileType);
		if(res.data.fileType=='Folder'&& !(res.data.target))//||res.data.empty
			this.loadData(res.data.path);
		else{// Here is necessary to implement the extensions use.
			this.getPath();
		}
	},
	gridSelectionModel_onrowselect : function(sm,rowIndex,record){
		var _that = OpenFileDialog.prototype;
		if(record.data.fileType == 'File')
			this.dialogBox.setValue(record.data.name);
	},
	extensionBox_onselect : function(){
	   this.loadData(this.addressBar.getValue());
	},
	store_onload : function(str,rLoaded){
		var _that = OpenFileDialog.prototype;
		this.store.sort([{
			field:'fileType',
			direction:'DESC'
		},{
			field:'name',
			direction:'ASC'
		}]);
		this.dialogBox.setValue('');
		this.appViewer.getActiveItem().selectItem(0);
	},
	loadData : function(path){
		var _that = OpenFileDialog.prototype;
		this.addressBar.setValue(path);
		this.store.load({
			params:{
				'path'	: this.addressBar.getValue(),
				'extension' : this.extensionBox.getValue().split('.')[1],
				'foldersOnly' : this.foldersOnly
			}
		});        
	},
	getPath : function(){
		var _that = OpenFileDialog.prototype;
		var path = this.addressBar.getValue();
		
		if(!this.foldersOnly){
			if(this.dialogBox.isValid()){
				path += this.dialogBox.getValue();
				if(this.callback)
					this.callback(path);
			}
		}
		else{
			if(this.callback)
				this.callback(this.gridpanel.getSelectionModel().getSelected().data.path);
		}   

		this.obj.close();    		
	},
	stepBack : function(){
		var _that = OpenFileDialog.prototype;
		var path = this.addressBar.getValue();
		var i = path.length-1;
		var count = 0;
		for(i;i>0;i--){
			if(path[i]=='/')
				count++;
			if(count==2)    
				break;
		}
		var substr = path.substring(0, i+1);
		this.loadData(substr!=''?substr:'/');
	},
	deleteFiles : function(files){
		var errase;
		switch(files.length){
			case 0:
				break;
			case 1:
				if(files[0].data.fileType == 'Folder')
					errase = Ext.Msg.confirm("BHike","Do you really want to delete " + files[0].data.name+" and all its contents?",deleteDesition);
				else
					errase = Ext.Msg.confirm("BHike","Do you really want to delete " + files[0].data.name+" ?",deleteDesition);
				break;
			default:
				errase = Ext.Msg.confirm("BHike","Do you really want to delete all these files?",deleteDesition);
		}

		function deleteDesition(btn){
			switch(btn){
				case 'yes':

					break;
			}
		}
	},
	filter : function(){
		var _that = OpenFileDialog.prototype;
		var active = _that.appViewer.getActiveItem();
		active.store.filter('name',this.getValue());
		active.selectItem(0);
	},
	selectedIndex_gridpanel : function(){
		var selected = this.getSelectionModel().getSelected();
		return this.getStore().indexOf(selected);
	},
	selectItem_gridpanel : function(item){
		this.getSelectionModel().selectRow(item);
	},
	selectedItemId_gridpanel : function(){
		var selNode = this.getSelectionModel().getSelected();
		return selNode.data.path; //return selNode.data.name; this is the original Value
	},
	getActiveItem_appViewer : function(){
		var lay = this.getLayout().activeItem.id;
		return Ext.getCmp(lay);
	},
	setActiveElement_appViewer : function(item){
		var viewer = this.getActiveItem();
		var index = viewer.selectedIndex();
		this.getLayout().setActiveItem(item);
		viewer = this.getActiveItem();
		viewer.selectItem(index);
	},
	on_click_btnGrid : function(){
		var _that = OpenFileDialog.prototype;
		_that.appViewer.setActiveElement(0);
	},
	on_click_btnDataview : function(){
		var _that = OpenFileDialog.prototype;
		_that.appViewer.setActiveElement(1);
	},
	btnCancel_onclick : function(){
		this.obj.close();
	}
});
