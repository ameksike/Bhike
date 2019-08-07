/*
 * $package: BHike
 * 
 * $description: Explorer is a Ksike's JavaScript class definition that....
 * $authors: no-body
 * $created: Wed, 11 Apr 12 11:52:13 -0400
 * $license: GPL v3
 **/

Kcl.Class('ProjectManager.Explorer', 
{		
	extend: ProjectManager.Explorer,
	property:{
		connection: false,
		activeProject : null
	},    
    behavior:{
        construct: function(params){
			this.parent.construct.apply(this, [this]);
			this.manager = std.mod.ProjectManager;
            this.projects = this.manager.projects;
            this.connection =  this.manager.connection;
            this.activeProject = this.manager.activeProject;
            this.nodeSearchKey = "name";
        },
        mitem_remove_onclick : function(item,e) {
			var node = this.tree.getSelectionModel().getSelectedNode();
			this.verifyRemove(node);			
		},
		verifyRemove : function(node){
			var _this = ProjectManager.Explorer.prototype;
			var msg = "Do you want to remove " + node.attributes.name + "'s content?";
			Ext.Msg.show({
				title:'Remove Content',
				msg: msg,
				buttons: Ext.Msg.YESNO,
				fn: _this.doRemove,
				scope:this,
				node:node,
				icon: Ext.MessageBox.QUESTION			   
			});
		},
		doRemove : function(btn,s,opt){
			var _this = ProjectManager.Explorer.prototype;
			if(btn == "yes") {
				var params = {};
				params.location = this.getProjectFromNode(opt.node).location;
				params.items = [];
				params.items.push(this.getInnerNodePath(opt.node));
				params.on_success = _this.removed;
				params.node = opt.node;
				params.scope = this;
				std.mod.ProjectManager.removeItems(params);
			}
		},
		removed : function(resp, opt) {
			var data = Ext.util.JSON.decode(resp.responseText);
			if(data.success) {
				opt.data.node.parentNode.removeChild(opt.data.node,true);
			}
			//console.log(data);
		},
        tree_oncontextmenu : function(node, e) {
			//	Register the context node with the menu so 
			//	that a Menu Item's handler function can access		
			//  it via its parentMenu property.
				
			node.select();
			var c = node.getOwnerTree().contextMenu;
			c.contextNode = node;
			c.showAt(e.getXY());
		},
		defaultSelectionModel_onbeforeselect : function(sm,node){
			switch(node.attributes.artifact){
				case 'project':
					//this.enable_componentAdition();
					break;
				default:
					//this.disable_componentAdition();
					break;
			}
			
			this.tbItem1.enable();
			this.propertiesPanel.showProperties(node.attributes);
			
		},
        obj_ondblclick : function(node,e){
			if(node.attributes.artifact != 'Folder') {
				var project = this.getProjectFromNode(node);			
				var artifact_info = {
					manager:project.manager,
					projectPath: project.location,
					item: this.getInnerNodePath(node),
					type: node.attributes.artifact
				};
				std.mod.Main.trigger(artifact_info,"artifact_ondblclick");
			}
		},
		btn_showAll_ontoggle : function(btn,pressed){
			function a(node){
				if(node.attributes.artifact == "virtual")
					if(!pressed) node.getUI().hide();
					else node.getUI().show();
				node.eachChild(a);
			}
			this.tree.root.eachChild(a);
		},
		tbItem1_onclick : function(){
			this.propertiesPanel.showProperties(this.tree.getSelectionModel().getSelectedNode().attributes,true);
		},
        openProject: function(proj){
			var _this = ProjectManager.Explorer.prototype;
			var project = proj;
			if(project != null){				
				this.obj.show();
				var openned = this.getProjectFromPath(proj.data.path);
				if(openned)
					return this.tree.getSelectionModel().select(openned.node);
				else{					
					var project = new ProjectManager.Project({ 
						location : proj.data.path,	
						manager : proj.data.manager, 
						version : proj.data.version, 
						name : proj.data.name
					});										
					this.manager.addProject(project);			
				}
			}
		},
		buildProjectNode : function(project){
			if(project) {
				project.node = new Ext.tree.TreeNode();
				project.node.expanded = false;
				project.node.attributes.name = project.name;
				project.node.setText(project.name);		
				project.node.attributes.artifact = "Project";
				this.tree.root.appendChild(project.node).expand();
			}
		},
		obj_onbeforeexpandnode : function(node,opt){
			var _this = ProjectManager.Explorer.prototype;
			if(node.id != "root-node") {
				var project = this.getProjectFromNode(node);
				var npa = node.getPath(this.nodeSearchKey);
				//var path = project.path.replace(project.node.attributes.name+"/",'')+npa.substr(2,npa.length)+"/";
				var path = npa.substr(2,npa.length)+"/"
				var url = std.frontController.getRequest("getItems", "ProjectManager",{
					projectLocation:project.location,
					contentBranch: path.replace(project.node.attributes.name+"/",""),
					artifact:node.attributes.artifact
				});
				this.connection.request({
					url:url,
					method:'POST',
					success: _this.getContent.createDelegate(this)
				});
			}
		},
		getContent : function(response,opt){
			var _response = Ext.util.JSON.decode(response.responseText);
			if(_response.success) {
				var _data = _response.data;
				var proj = this.getProjectFromPath(_data.path);
				var chain = "//"+_data.path.replace(proj.location.replace(proj.node.attributes.name+"/",""),"");
				var path = chain.substr(0,chain.length-1);
				var node = this.getNodeFromPath(path);
				this.fillNode(node,_data.content);
			}			
		},
		fillNode : function(node,content){
			if(content.length == 0){
				if(node.findChild('type','empty') == null)
					node.appendChild({
							text:"[Empty folder]",
							type:'empty',
							cls:'x-tree-noicon',
							leaf:true,
							disabled:true
					});
			}
			else{
				//node.removeAll();
				for(var i in content)
					if(i != "remove") {
						var artifact = i == std.mod.ProjectManager.metadataFolderName ? "virtual" : content[i].artifact;
						var nnode = new Ext.tree.TreeNode({				
							expandable : content[i].container,
							leaf : !content[i].container,
							artifact : artifact,
							text : i,
							name : i,
							icon : content[i].icon,
							hidden: (artifact == "virtual" && !this.btn_showAll.pressed),
							data : content[i].data
						});
						var found = node.findChild(this.nodeSearchKey,i);
						if(found) node.replaceChild(nnode,found);
						else node.appendChild(nnode);
					}
			}
			node.select();
		},
		btn_explorer_onclick :function(){
			this.obj.show();
		},
		getInnerNodePath : function(node){
			var proj = this.getProjectFromNode(node);
			var path = node.getPath(this.nodeSearchKey);
			path = path.replace("//"+proj.name+"/","");
			return path;		
		},
		getProjectFromNode : function(keynode){
			for(var p in this.projects )
				if(p != "remove")
					if(this.projects[p].node.id == keynode.id || keynode.isAncestor(this.projects[p].node))
						return this.projects[p];
		},
		getProjectFromPath : function(path){
			for(var p in this.projects)
				if(p != "remove")
					if(path.match(this.projects[p].location))
						return this.projects[p];
		},
		getNodeFromPath : function(path,attr){
			var attr = attr || this.nodeSearchKey; var keys = path.split(this.tree.pathSeparator);
			var c = 2; var ch = this.tree.root.findChild(attr,keys[c++]);
			while(ch && c < keys.length)
				ch = ch.findChild(attr,keys[c++]);
			return ch;
		}	
	}
});
