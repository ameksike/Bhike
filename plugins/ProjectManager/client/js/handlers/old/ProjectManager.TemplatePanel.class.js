Kcl.Class('ProjectManager.TemplatePanel', 
{
	extend:ProjectManager.TemplatePanel,
    behavior:{
		construct: function(params){			
			params != null && params.componentType != null ? this.componentType = params.componentType : this.componentType = 'Item';
			params != null && params.path != null ? this.path = params.path : this.path = null;
			params != null && params.title != null ? this.title = params.title : this.title = 'nobody';
			this.project = '';//params.project;
                this.lookup = {};
            
                //////////////////////////////////
                this.data = new Ext.data.JsonStore({					
					fields: [
						'DefaultName',
						'Name', 
						'Description', 
						'Icon', 
						'Type',
						'TemplateID',
						{name:'SortOrder',type:'integer'},
						'SubType'
					]
                });
                ///
                this.store = new Ext.data.JsonStore({					
					fields: [
						'DefaultName',
						'Name', 
						'Description', 
						'Icon', 
						'Type',
						'TemplateID',
						{name:'SortOrder',type:'integer'},
						'SubType'
					]
                });
            
                this.treeLoader = new Ext.tree.TreeLoader();
            
            /////////////////////////////////////////////
			this.buildGUI();
		},
		updateForm:function(){			
			var data = this.templatesViewer.getActiveItem().store.getAt(this.templatesViewer.getActiveItem().selectedIndex()).data;
			var value = '';
			data.DefaultName == null || data.DefaultName ==  '' ? value = data.Name : value = data.DefaultName;
			this.txt_name.changeValue(value);
			
		},
		on_click_btn_iconView : function(){
			var _that = ProjectManager.TemplatePanel.prototype;
			this.templatesViewer.setActiveElement(0);
		},
		on_click_btn_detailView : function(){
			var _that = ProjectManager.TemplatePanel.prototype;
			this.templatesViewer.setActiveElement(1);
		},
		on_select_cmb_sortSelect : function(cmb,record,index){
			var _that = ProjectManager.TemplatePanel.prototype;
			var v = cmb.getValue();
			var active = _that.templatesViewer.getActiveItem();
			active.store.sort(v, v == 'name' ? 'asc' : 'desc');
			active.selectItem(0);
		},
		on_keyup_txt_filter : function(){
			this.filter();
		},
		filter : function(){
			var active = this.templatesViewer.getActiveItem();
			active.store.filter('Name',this.txt_filter.getValue());
			active.selectItem(0);
		},
		on_click_btn_browsePath : function(){
			var _this = this;
			var openFile = new OpenFileDialog({
				initialDirectory:this.txt_projectPath.getValue(),
				title:'Select Path',
				onlyFolder:true,
				callback:function(path){
					_this.txt_projectPath.setValue(path)
				}
			});
			openFile.show();
		},
		on_keyup_txt_projectName : function(){
			if(this.txt_projectName.changeable)
				this.txt_projectName.changeable = false;
			this.project.attributes.name = this.txt_projectName.getValue();
		},
		on_keyup_txt_name : function(comp,e){
			this.txt_name.changeValue(comp.getValue());
		},
		changeValue_txt_name : function(value){
			var _that = ProjectManager.TemplatePanel.prototype;
			this.txt_name.setValue(value);
			var proj = this.txt_projectName;
			if(proj.changeable){
				proj.setValue(this.txt_name.getValue());
				//this.project.attributes.name = proj.getValue();
			}        
		},
		txt_projectPath_onchange : function(cmp,nv,ov){
			this.project.attributes.path = nv;
		},
		on_selectionchange_gridSelectionModel : function(sm){
			var _that = ProjectManager.TemplatePanel.prototype;
			var selNode = sm.getSelected();
			
			var detailEl = this.detailsPanel.body;
			if(selNode){
				var data = this.lookup[selNode.data.TemplateID];
				detailEl.hide();
				this.detailsTemplate.overwrite(detailEl, data);
				detailEl.slideIn('r', {
					stopFx:true,
					duration:.1
				});
				this.updateForm();
				//this.getsTarget();
			}else{        
				detailEl.update();
				//this.losesTarget();
			}
		},
		on_selectionchange_dataView : function(dv,selects){
			var selNode = dv.getSelectedNodes();
			var detailEl = this.detailsPanel.body;
			if(selNode && selNode.length > 0){
				selNode = selNode[0];
				//Ext.getCmp('btn_next').enable();
				var data = this.lookup[selNode.id];
				detailEl.hide();
				this.detailsTemplate.overwrite(detailEl, data);
				detailEl.slideIn('l', {
					stopFx:true,
					duration:.1
				});        
				this.updateForm();
				//this.getsTarget();
			}else{
				//Ext.getCmp('btn_next').disable();
				//this.txt_name.changeValue("");
				detailEl.update();
				//this.losesTarget();
			}
		},
		on_beforeselect_dataView : function(view){
			return view.store.getRange().length > 0;
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
			var _that = ProjectManager.TemplatePanel.prototype;
			var lay = this.templatesViewer.getLayout().activeItem//.id;
			//var res = Ext.getCmp(lay);
			return lay;//res;
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
			return '<img class="list-thumb" src="'+record.data.Icon+'"/>' + value;
		},
		viewer_onbeforerender:function(){
			std.mod.ProjectManager.getTemplates({type:this.componentType,callback:TemplatePanel.prototype.loadComponentData.createDelegate(this)});
		},
		tree_on_append : function(tree,parent,node,index){
			alert('algo');
			this.tree.getSelectionModel().select(this.tree.root.firstNode);
		},
		on_click_tree : function(node, e){
			var _that = ProjectManager.TemplatePanel.prototype;
			if(node.isSelected() && node.isExpanded())
				_that.showNodeDetail(node);
			else
				node.expand();
		},
		on_beforeselect_defaultSelectionModel : function(sm,node){
			if(!node.isExpanded())
				node.expand();
				
			var result = [];
			this.data.queryBy(function(record,id){
				if(record.data.Type.match(node.attributes.text) || record.data.SubType.match(node.attributes.text))
					result[result.length] = record.data;	
			},this);
			this.store.loadData(result);
			this.templatesViewer.getActiveItem().selectItem(0);
		},
		on_selectionchange_defaultSelectionModel : function(sm,node){
			this.project.icon = node.attributes.icon;
			this.project.attributes.type = node.attributes.projecttype;
			this.project.description = node.attributes.description;
			this.project.attributes.path = this.txt_projectPath.getValue();
		},
		loadComponentData : function(loader,success,response) {
			response = Ext.util.JSON.decode(response.responseText);
			if(response.success){				
				///ComponentType Node in tree
				for(var i = 0; i < response.data.length; i++){
					var types = response.data[i].Type.split('/');
					for(var j = 0; j < types.length;j++)
					{
						var ntype = this.tree.root.findChild('text',types[j],true);
						if(ntype == null)
						{
							ntype = new Ext.tree.TreeNode({cls:'x-tree-noicon'});
							ntype.setText(types[j]);					
							this.tree.root.appendChild(ntype);
						}
						if(ntype.attributes.SortOrder == null || ntype.attributes.SortOrder > response.data[i].SortOrder )
							ntype.attributes.SortOrder = response.data[i].SortOrder;
					}					
				}			
				///ComponentSubType Node in tree
				for(var i = 0; i < response.data.length; i++){					
					if(response.data[i].SubType != null && response.data[i].SubType != '')
					{
						var types = response.data[i].Type.split('/');
						for(var j = 0; j < types.length;j++)
						{
							var ntype = this.tree.root.findChild('text',types[j],true);
							if(ntype != null){
								var stype = ntype.findChild('text',response.data[i].SubType,true);
								if(stype == null){		
									var nstype = new Ext.tree.TreeNode({cls:'x-tree-noicon'});
									nstype.setText(response.data[i].SubType);					
									ntype.appendChild(nstype);
								}
								ntype = nstype;
								if(ntype.attributes.SortOrder == null || ntype.attributes.SortOrder > response.data[i].SortOrder )
									ntype.attributes.SortOrder = response.data[i].SortOrder;
							}
						}
					}					
				}
				this.tree.expandAll();
				
				this.data.loadData(response.data);
				this.data.sort('SortOrder','ASC');
				var record = this.data.getAt(0);
				var node = this.tree.root.findChild('text',record.data.Type,true);
				
				node.select();			
				//this.store.sort('SortOrder','ASC');
				this.templatesViewer.getActiveItem().selectItem(0);
			}
			else
				Ext.Msg.alert("Error",response.msg);
		},
		loadProjectData : function(loader,success,response) {
			response = Ext.util.JSON.decode(response.responseText);
			var root = this.tree.root;
			for(var i in response){
				if(i!=='remove'){
					if(response[i].projecttype==null)response[i].projecttype = 'Other';
					var node = this.findNode({node:root,attribute:'projecttype',value:response[i].projecttype});
					if( node == null){
						//alert(response[i].projecttype);
						var nn = new Ext.tree.TreeNode();
						nn.text = response[i]['projecttype'];
						for(var j in response[i])
							nn.attributes[j] = response[i][j];
						/*nn.attributes.projecttype = response[i]['projecttype'];
						nn.attributes.icon = response[i]['icon'];
						nn.attributes.sortorder = response[i]['sortorder'];
						if(response[i].projectsubtype==null){
							var nsn = new Ext.tree.TreeNode();
							nsn.text = response[i]['name'];
							for(var j in response[i])
								nsn.attributes[j] = response[i][j];
							nn.appendChild(nsn);
						}
						else{
							var nsn = new Ext.tree.TreeNode();
							for(var j in response[i])
								nsn.attributes[j] = response[i][j];
							nsn.text = response[i]['projectsubtype'];
							nn.appendChild(nsn);
						}*/
						
						
						root.appendChild(nn);
						//nn.text = nn.attributes.prototype;
					}
					
				}        
			}
			this.tree.getSelectionModel().select(this.tree.root.firstChild);
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
			return null;
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
		},
		onLoadException : function(v,o){
			var _that = ProjectManager.TemplatePanel.prototype;
			var active = _that.templatesViewer.getActiveItem();
			active.getEl().update('<div style="padding:10px;">Error loading templates.</div>');
		},
		show:function(){
			this.obj.show();
		},
		btn_cancel_on_click:function(){
			this.obj.close();
		},
		btn_add_on_click:function(){
			if(this.path !== null)
			{
				var tplData = this.templatesViewer.getActiveItem().store.getAt(this.templatesViewer.getActiveItem().selectedIndex()).data;
				var params = {
					component:this.componentType,
					tpl:tplData.TemplateID,
					path:this.path,
					name:this.txt_name.getValue(),
					project:std.mod.ProjectManager.explorer.getCurrentProject().data.Name
				};
				var con = new Ext.data.Connection();
				con.request({
					url:std.frontController.getRequest("buildComponent", "ProjectManager",params),
					method:'POST',
					callback:this.added.createDelegate(this)
				});		
			}
		},
		added:function(obj,success,response){
			if(success)
			{
				this.obj.close();
				this.refreshContent();
			}
		},
		refreshContent:function(){
			
		}
	}
});


String.prototype.ellipse = function(maxLength){
    if(this.length > maxLength){
        return this.substr(0, maxLength-3) + '...';
    }
    return this;
}
