Kcl.Class('ProjectManager.RecentsManager',
{
	extend: ProjectManager.RecentsManager,
	property:{
        recentProjects:[],
        connection: new Ext.data.Connection()
	},
	behavior:{
		construct:function(params) {
			this.buildGUI();
		},
		obj_onbeforerender : function(obj) {
			this.load();
		},
		mitem_openProject_onclick : function(cmp,e){
			var node = this.tree.getSelectionModel().getSelectedNode();
			return this.tree.fireEvent('click',node);
		},
		mitem_removeRecent_onclick : function(cmp,e){
			var node = this.tree.getSelectionModel().getSelectedNode();
			this.remove(node);
		},
        tree_oncontextmenu : function(node, e) {
			node.select();
			var c = node.getOwnerTree().contextMenu;
			c.contextNode = node;
			c.showAt(e.getXY());
		},
		load : function() {
			var _this = ProjectManager.RecentsManager.prototype;
			std.mod.ProjectManager.loadRecentProjects({ on_success:_this.loaded, scope:this});
		},
        loaded : function(response,opt) {
			var _this = ProjectManager.RecentsManager.prototype;
			var _response = Ext.util.JSON.decode(response.responseText);
			//var _response = JSON.parse(e.data);
			if(_response.success){
				this.recentProjects = _response.data;
				std.mod.ProjectManager.gui.toolBar.btn_openFile.menu.removeAll();
				if(this.tree.root.hasChildNodes()) this.tree.root.removeAll();
				for(i in this.recentProjects){
					if(i != 'remove')
					{	
						//
						//recent project node
						//
						var data = 	{
							icon	:this.recentProjects[i].icon,
							text	:i,
							path	:this.recentProjects[i].path,
							qtip	: this.recentProjects[i].description,
							leaf	:true,
							status 	: this.recentProjects[i].status != "not-found"
						};									
						this.tree.root.appendChild(data);
						//
						//recent project menu
						//						
						var rcentProjMenu = new Ext.menu.Item(data);
						rcentProjMenu.on('click',_this.btn_openFile_onclick,this);
						std.mod.ProjectManager.gui.toolBar.btn_openFile.menu.add(rcentProjMenu);				
					}
				}
			}
		},
		tree_onclick : function(node,e) {
			if(node.attributes.status) {
				std.mod.ProjectManager.openProject(node.attributes.path)
			}
			else {
				var _this = ProjectManager.RecentsManager.prototype;
				Ext.Msg.show({
				   title:'Recent Project Manager Info',
				   msg: "Project " + node.text+ "'s reference was not found.<br/>Do you want to remove it from recent's records?",
				   buttons: Ext.Msg.OKCANCEL,
				   fn: _this.processResult,
				   scope:this,
				   icon: Ext.MessageBox.INFO,
				   node:node
				});
			}
		},
		processResult : function(value,s,opt) {
			switch(value) {
				case 'ok':
					this.remove(opt.node);
					break;
			}
		},
		remove : function(node) {
			var _this = ProjectManager.RecentsManager.prototype;
			var params = {
				project_data:{name:node.text,path:node.attributes.path},
				on_success:_this.removed,
				scope:this,
				node:node
			};
			std.mod.ProjectManager.removeRecentProject(params);
		},
		removed : function(response,opt) {
			var _response = Ext.util.JSON.decode(response.responseText);
			if(_response.success) {
				opt.params.node.parentNode.removeChild(opt.params.node,true);
				console.log(_response.msg);
			}
		},
		selModel_onbeforeselect : function() {
			return false;
		},
		btn_openFile_onclick:function(menu,item,e) {
			std.mod.ProjectManager.openProject(menu.path);		
		},
		tree_onappend : function(tree,nparent,node,index) {}
	}
});
