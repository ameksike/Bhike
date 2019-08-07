Kcl.Class('ProjectManager.TemplateSelectionPanel',
{
	extend : ProjectManager.TemplateSelectionPanel,
	property: {
		connection : new Ext.data.Connection(),
		template : new ProjectManager.Template()
	},
	behavior: {
		construct : function(params) {
			this.manager = params && typeof(params.manager) == "object" ? params.manager : undefined;
			this.templateFilters = params && typeof(params.templateFilters) == "array" ? templateFilters : []; //,filters:[{"Icon":"icon.png"},{"ProjectType":["Ksike","Symfony"]}]};
			this.item = params && params.item instanceof ProjectManager.Item ? params.item : new ProjectManager.Item();
			this.type = params && typeof(params.type) == "string" ? params.type : "item";
			this.template.set("type",this.type);
			this.lookup = {};
			//////////////////////////////////
			this.store = new Ext.data.JsonStore({
				root:'templates',
				fields: [
					'name',
					{ name:'icon', type:'string' },
					{ name:'previewimage', type:'string' },
					{ name:'projecttype', type:'string' },
					{ name:'projectsubtype', type:'string' },
					{ name:'description', type:'string' },
					{ name:'sortorder', type:'integer' },
					{ name:'enablelocationbrowsebutton', type:'boolean' },
					{ name:'location', type:"string" },
					{ name:'locationfield', type:'string' },
					{ name:'enableeditoflocationfield', type:'boolean' },
					{ name:'providedefaultname', type:'boolean' },
					{ name:'defaultname', type:'string' },
					{ name:'customdatasignature', type:'string' },
					{ name:'numberofparentcategoriestorollup', type:'integer' },
					{ name:'promptforsaveoncreation', type:'boolean' },
					'requiredframework',
					{ name:'showbydefault', type:'boolean' },
					{ name:'templategroupid', type:'string' },
					{ name:'supportscodeseparation', type:'boolean' },
					'languagedropdown',
					{ name:'supportsmasterpage',type:'boolean' },
					{ name:'templateid',type:'string' }
				]
			});
			this.store.on('load',this.store_onload,this);
			///
			///cmb_versionStore
			///
			this.cmb_versionStore = new Ext.data.JsonStore({
				root:'frameworks',
				fields: ['version', 'name','alias'],
				sortInfo: {
					field: 'version',
					direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
				}
			});			
			///
			///store_sort
			///
			this.cmb_sortSelectStore = new Ext.data.ArrayStore({
				fields: ['name', 'desc'],
				data : [['sortorder', 'Default'],['name', 'Name'],['projecttype', 'Type']]
			});
			this.buildGUI();
		},
		updateValues : function (data) {
			this.txt_itemName.setValue(data.name);
			var proj = this.txt_projectName;
			if(proj.changeable){
				proj.setValue(this.txt_itemName.getValue());				
			}
			var viewer = this.templatesViewer.getLayout().activeItem;
			var index = viewer.selectedIndex();
			var data = this.store.getAt(index).data;
			this.template.set("name",data.name);
			this.template.set("id",data.templateid);
			this.template.set("location",data.location);
			if(this.item instanceof ProjectManager.Item)	{
				this.item.set("safename",this.txt_itemName.getValue());
				this.item.set("name",data.name);			
				this.item.set("template",this.template);
			}
		},
		applyTemplateRestrictions : function(data) {
			this.btn_locationBrowse.setDisabled(data.enablelocationbrowsebutton === false);
			switch(data.locationfield){
				case 'Disabled':					
					this.pnl_openFile.disable();
					break;
				case 'Hidden':
					this.form.setHeight(45);
					this.pnl_openFile.hide();
					break;
				default:
					this.form.setHeight(70);
					this.pnl_openFile.enable();
					this.pnl_openFile.show();
					break;
			}
			this.obj.doLayout();
			this.detailsPanel.body.hide();
			this.detailsTemplate.overwrite(this.detailsPanel.body, data);
			this.detailsPanel.body.slideIn('l', {
				stopFx:true,
				duration:.1
			});        
			this.updateValues(data);			
		},
		txt_itemName_onkeyup : function (txt, e) {
			this.item.set('safename',txt.getValue());
		},
		txt_itemLocation_changeValue : function(nval) {
			this.setValue(nval);
			this.fireEvent("change",{txt:this,nv:nval,ov:this.value});
		},
		txt_itemLocation_onchange : function(txt,nv,ov) {
			this.item.set('location',nv != undefined ? nv : txt.nv != undefined ? txt.nv : ov != undefined ? ov : txt.ov != undefined ? txt.ov : "");
		},
		txt_filter_onblur : function (txt){
			txt.setValue(""); txt.fireEvent('keyup',txt);
		},
		txt_filter_onkeyup : function (txt,e) {
			var active = this.templatesViewer.getLayout().activeItem;
			active.store.filter('name',txt.getValue());
			active.selectItem(0);
		},
		cmb_sortSelect_onselect : function(cmb,cmb_rec,index) {
			var active = this.templatesViewer.getLayout().activeItem;
			active.store.sort(cmb.getValue(), 'asc'); active.selectItem(0);
		},
		cmb_version_onbeforeselect : function(cmb,cmb_rec,index) {
			var tree = this.accordion_categories.getLayout().activeItem;
			var projecttype = tree.getSelectionModel().getSelectedNode().attributes.projecttype;
			var projectsubtype = tree.getSelectionModel().getSelectedNode().attributes.projectsubtype;
			this.store.filterBy(function(store_rec,id) {
				if(store_rec.data.projecttype.match(projecttype) && store_rec.data.projectsubtype.match(projectsubtype)) {
					if(store_rec.data.requiredframework == undefined || store_rec.data.requiredframework == "")
						return true;
					else if( cmb_rec.data.name != "none" && (store_rec.data.requiredframework.version >= cmb_rec.data.version ) )
						return true;
				}
				return false;
			},this);
			var viewer = this.templatesViewer.getLayout().activeItem;
			viewer.selectItem(0);
		},
		btn_views_ontoggle : function(btn,pressed) {
			btn.setIconClass(pressed ? 'icons-view' : 'details-view');
			btn.setTooltip(pressed ? "Icons View" : "Details View");
			this.templatesViewer.setActiveElement(pressed ? 1 : 0);						
		},
		dataView_onselectionchange : function(dv,selections){		
			var selNode = dv.getSelectedNodes();
			//var detailEl = this.detailsPanel.body;
			if(selNode && selNode.length > 0){
				selNode = selNode[0];        
				var data = this.lookup[selNode.id];
				this.applyTemplateRestrictions(data);        
				//this.getsTarget();
			}else{
				//Ext.getCmp('btn_next').disable();
				//this.txt_itemName.changeValue("");
				this.detailsPanel.body.update();
				//this.losesTarget();
			}
		},
		gridSelectionModel_onselectionchange : function(sm) {
			var selected = sm.getSelected();
			if(selected){
				var data = this.lookup[selected.data.name];
				this.applyTemplateRestrictions(data); 
				//this.getsTarget();
			}else{        
				this.detailsPanel.body.update();
				//this.losesTarget();
			}
		},
		dataView_onbeforeselect : function(view,node,selections){
			return view.store.getRange().length > 0;
		},
		dataView_oncontainerclick : function(dw,e) {
			this.txt_itemName.setValue("");
		},
		templatesViewer_setActiveElement : function(item){
			var viewer = this.getLayout().activeItem;
			var index = viewer.selectedIndex();
			var lay = this.getLayout();
			lay.setActiveItem(item);
			viewer = this.getLayout().activeItem;
			viewer.selectItem(index);
		},
		store_onload : function(store,records,opts) {
			this.poblate_tree(records);
		},
		poblate_tree : function(records) {
			var tree = this.accordion_categories.getLayout().activeItem;
			for(var r in records)
				if(r != 'remove') {
					var tpl_projectsubtype = records[r].data.projectsubtype;					
					var tpl_projecttypes = records[r].data.projecttype.split("/");
					if(tpl_projecttypes.length == 0) tpl_projecttypes.push("Others");						
					for(var key in tpl_projecttypes)
						if(key != "remove") {
							var found = tree.root.findChild('text',tpl_projecttypes[key]);
							if(found == null) {
								var newtypenode = new Ext.tree.TreeNode({
									text:tpl_projecttypes[key],
									projecttype:tpl_projecttypes[key],
									cls:'x-tree-noicon'
								});
								if(tpl_projectsubtype) {
									var newsubtypenode = new Ext.tree.TreeNode({
										text:tpl_projectsubtype,
										projecttype:tpl_projecttypes[key],
										projectsubtype : tpl_projectsubtype,
										cls:'x-tree-noicon'										
									});
									newtypenode.appendChild(newsubtypenode);
								}
								tree.root.appendChild(newtypenode);
							} else {
								if(tpl_projectsubtype) {
									var newsubtypenode = new Ext.tree.TreeNode({
										text:tpl_projectsubtype,
										projecttype:tpl_projecttypes[key],
										projectsubtype : tpl_projectsubtype,
										cls:'x-tree-noicon'										
									});
									found.appendChild(newsubtypenode);
								}
							}
						}					
				}
			tree.fireEvent("load");			
		},		
		col_name_renderer : function(value, metaData, record, rowIndex, colIndex, store){
			return '<img class="list-thumb" src="'+record.data.icon+'"/>' + value;
		},
		btn_locationBrowse_onclick : function(){
			var txt = this.txt_itemLocation;
			var openFile = new OpenFileDialog({
				initialDirectory:this.txt_itemLocation.getValue(),
				title:'Select Path',
				foldersOnly:true,
				callback:function( path ){ txt.changeValue(path); }
			});
			openFile.show();
		},
		dataView_selectItem : function(item) { 
			this.select(item); 
		},
		gridPanel_selectItem : function(item) { 
			this.getSelectionModel().selectRow(item);
		},
		dataView_selectedIndex : function() { 
			var selNode = this.getSelectedIndexes(); 
			return selNode[0]; 
		},
		gridPanel_selectedIndex : function() { 
			var selected = this.getSelectionModel().getSelected(); 
			return this.getStore().indexOf(selected); 
		},
		dataView_selectedItemId : function() { 
			var selNode = this.getSelectedNodes(); 
			selNode = selNode[0]; 
			return selNode.id;
		},
		gridPanel_selectedItemId : function() { 
			var sel = this.getSelectionModel().getSelected(); 
			return sel.data.templateid;
		},
		dataView_hasTarget : function(){
			return this.getSelectedNodes().lenght != 0;
		},
		gridPanel_hasTarget : function(){
			return this.getSelectionModel().hasSelection();
		},
		anchor_search : function(value,array,resp) {
			var root = array.shift();
			if(root) {
				if(root.attributes.projecttype == value )
					resp.push(root);
				if(!root.isLeaf())
					array = array.concat(root.childNodes);
				return this.anchor_search(value,array,resp);
			}
		},
		defaultSelectionModel_onbeforeselect : function(sm,node) {
			this.item.set("manager",node.attributes.projecttype);
			var filters = [{property:'projecttype',value:node.attributes.projecttype, anyMatch : true}];
			this.store.filter(filters);	
			this.cmb_framework_update(node);
			if(node.attributes.projectsubtype != undefined) filters.push({property:'projectsubtype',value:node.attributes.projectsubtype});
			this.store.filter(filters);			
		},
		cmb_framework_update : function(node) {
			var fws = [];
			var none = false;
			this.store.each(function(store_rec){
				if(store_rec.data.projecttype == node.attributes.projecttype) {
					if(store_rec.data.requiredframework == undefined || store_rec.data.requiredframework == "") {
						if(!none) { none = true; fws.push({name:'none',alias:'None',version:0}); }
					}
					else fws.push(store_rec.data.requiredframework);
				}
			},this);
			this.label1.setVisible(fws.length > 1);
			this.label1.setDisabled(fws.length <= 1)
			this.cmb_version.setVisible(fws.length > 1);
			this.cmb_version.setDisabled(fws.length <= 1);
			if(fws.length > 1) {				
				this.cmb_versionStore.loadData({frameworks:fws});
				this.cmb_version.setValue(this.cmb_versionStore.getAt(0).data.version);
			}			
		},
		defaultSelectionModel_onselectionchange : function(sm,node) {
			var viewer = this.templatesViewer.getLayout().activeItem;
			viewer.selectItem(0);
		},
		tree_onexpandnode : function(node) {
			var tree = this.accordion_categories.getLayout().activeItem;			
			if(node.id != tree.root.id) {
				node.select();
			}
		},
		tree_onload : function(node) {
			var tree = this.accordion_categories.getLayout().activeItem;
			tree.root.firstChild.expand();
			this.txt_itemLocation.changeValue(std.mod.ProjectManager.workspace);
		},
		concat_arrays : function (array1, array2) {
			for(var i in array2) if(array1.indexOf(array2[i]) == -1 && typeof(array2[i]) != 'function') array1.push(array2[i]);
		},
		obj_onbeforerender : function(wind) {
			var _this = ProjectManager.TemplateSelectionPanel.prototype;
			var params = {};
			params.params = { category : "installed",type : this.type, filters:this.templateFilters};
			params.on_success = _this.onTemplateInfoRecieved;
			params.scope = this;
			std.mod.ProjectManager.getTemplatesData(params);
		},
		onTemplateInfoRecieved : function(resp,opt) {
			var _resp = Ext.util.JSON.decode(resp.responseText);
			if(_resp.success) {
				var data = _resp.data;
				var preparedData = this.prepareData(data);
				this.store.loadData({templates:preparedData});
				this.store.sort('sortorder','ASC');
			}			
		},
		prepareData : function(data) {
			var r = [];
			for(var d in data)
				if(d != "remove") {
					var tpldata = {};
					tpldata.resultname = d.toLowerCase();
						for ( var template in data[d])
							if(template != "remove")
								tpldata[template.toLowerCase()] = data[d][template];
					r.push(tpldata);
				}
			return r;
		},
		formatData : function(data){
			if(data.name)
				data.shortName = data.name.ellipse(13);
			this.lookup[data.name] = data;
			return data;
		}
	}
});
