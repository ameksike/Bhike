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
    behavior:{
        construct: function(params){
			this.parent.construct.apply(this, [this]);
            this.openProjects = [];
            //this.buildGUI(params);
        },
		btn_explorer_onclick:function(){
			if(!this.obj.isVisible()){
				this.obj.show();
				this.obj.doLayout();
			}
		},
        on_contextmenu_obj : function(node, e) {
			//	Register the context node with the menu so 
			//	that a Menu Item's handler function can access		
			//  it via its parentMenu property.
				
			node.select();
			var c = node.getOwnerTree().contextMenu;
			c.contextNode = node;
			c.showAt(e.getXY());
			var path = this.getPath();
		},
		on_click_tbItem1 : function(){
			var _that = Explorer.prototype;
			if(!this.propertiesPanel.obj.isVisible())
				this.propertiesPanel.show();
			if(this.tree.getSelectionModel().getSelectedNode()!= null)
				this.propertiesPanel.showProperties(this.tree.getSelectionModel().getSelectedNode().attributes.data);
		},
		on_beforeselect_defaultSelectionModel : function(sm,node){
			switch(node.attributes.type){
				case 'physic':
					if(node.leaf)
						break;
				case 'project':
					this.enable_componentAdition();
					break;
				default:
					this.disable_componentAdition();
					break;
			}
			
			this.tbItem1.enable();
			
			if(this.propertiesPanel.obj.isVisible())
				this.propertiesPanel.showProperties(node.attributes.data);
			
		},
		enable_componentAdition : function(){
			std.mod.ProjectManager.gui.toolBar.btn_newFile.setDisabled(false);
		},
		disable_componentAdition : function(){
			std.mod.ProjectManager.gui.toolBar.btn_newFile.setDisabled(true);
		},
		on_itemclick_contextMenu : function(item) {
			var n = item.parentMenu.contextNode;
			switch (item.id) {
				case 'execute-project':
					if (n.parentNode) {
						var sURL = self.location+std.Router.uri+'project/'+n.attributes.data.name+'/';
						var sName = n.attributes.data.name;
						var sFeatures = 'left=112,top=50,width=800,height=550,toolbar=1,resizable=0';
						
						window.open(sURL,sName,sFeatures);
					}
					break;
				case 'close-node':
					if (n.parentNode) {
						n.remove();
					}
					break;
				case 'rebuild-project':					
					break;
				case 'delete-node':
					Ext.Msg.alert("Erase it?", n.text);
					break;
					
			}
		},
		executeProject : function(){/// THIS IS A TEMPORAL FEATURE, MOST BE INCLUDE IN EXECUTION MODULE
			var activeProject = this.getActiveProject();
			if(activeProject){
				var sURL = self.location+std.Router.uri+'project/'+activeProject.data.Name+'/';
				var sName = activeProject.data.Name;
				var sFeatures = 'left=112,top=50,width=800,height=550,toolbar=1,resizable=0';
				window.open(sURL,sName,sFeatures);
			}
		},
		openProject : function( project ){
			if(!this.obj.isVisible())
				this.obj.setVisible(true);
			var existsProject = this.tree.root.findChild('serial',project.data.Serial);
			if( existsProject == null){        
				var newProject = new Ext.tree.TreeNode({
					icon: 'plugins/OpenFileDialog/client/img/defaults/FileIcons/bhproj.png',
					text: project.data.Name
				});
				newProject.attributes.data = {
					path : project.data.Path,
					name : project.data.Name
				}
				newProject.attributes.type = 'project';
				newProject.attributes.serial= project.data.Serial;
				newProject.attributes.name = project.data.Name;
				
				var data = {itemtype:'virtual'};
				for(var i in project.data)
					data[i.toLowerCase()] = project.data[i];        
				
				var nproperties = new Ext.tree.TreeNode();
				//nproperties.disable();
				nproperties.allowChild = false;
				nproperties.attributes.type = 'properties';
				nproperties.attributes.iconCls = 'icon-virtual-folder';
				nproperties.attributes.data = data;
				nproperties.setText("Properties");
				newProject.appendChild(nproperties);
				
				
				this.openProjects[project.data.Serial] = project;
				this.tree.expand();

				this.tree.root.appendChild(newProject);
				
				newProject.expand();		
				
				
				this.restoreSession(project);
			}
			else
				this.tree.getSelectionModel().select(existsProject);

			if(!this.activeProject || this.openProjects.lenght == 1)
				this.setActiveProject(project.data.Serial);
          	
          this.obj.ownerCt.expand();
		},
		setActiveProject : function( projName ){
			var _this = Explorer.prototype;
			var activeName = "";
			if(this.activeProject != null){
				activeName = this.openProjects[this.activeProject].data.Name;			
				this.tree.root.findChild( 'serial', this.activeProject ).setText( activeName );
			}

			this.activeProject = projName;
			activeName = this.openProjects[projName].data.Name;
			this.tree.root.findChild( 'serial', projName ).setText( '<b>'+activeName+'</b>' );
		},
		restoreSession : function(project){
			std.mod.Main.restoreSession(project);	
		},
		getActiveProject : function(){
			return this.openProjects[this.activeProject];
		},
		obj_on_dblclick : function(node,e){
			var currentProject = this.getCurrentProject();//this.openProjects[node.getPath('serial').split('/')[2]];
			switch(node.attributes.type){
				case 'project':
				case 'properties':			
					var propertiesViewer = new PropertiesViewer(currentProject);
					//propertiesViewer.show();	
					propertiesViewer.obj.setTitle(node.attributes.data.name);
					std.mod.Main.gui.addItem(propertiesViewer.obj);
					break;
				case 'empty':
					e.stop();
					break;	
				default:
					if(node.isLeaf()){
						var path = node.getPath('name');
						var item = path.substr(currentProject.data.Name.length + 3,path.length);
						std.mod.Main.notify({
							path: currentProject.data.Path,
							item: item,
							project: currentProject,
							type:'file'
						});
					}
					//alert(node.attributes.name);
					break;
			}
		},
		getCurrentProject : function(){
			var node = this.tree.getSelectionModel().getSelectedNode();
			if(node != null)
				return this.openProjects[node.getPath('serial').split('/')[2]];
		},
		getPath : function(){
			var node = this.tree.getSelectionModel().getSelectedNode();;
			if(node != null){					
				var path = node.getPath('name');
				var currentProject = this.getCurrentProject();
				var item = path.substr(currentProject.data.Name.length + 3,path.length);
				var bar = '/';
				if(node.isLeaf()){
					var fileName = item.split('/');
					fileName = fileName[fileName.length-1];
					item = item.substr(0,item.length - fileName.length);
					bar = '';
				}
				if(node.attributes.type == 'project')
					bar = '';
				return currentProject.data.Path + item + bar;
			}
			return false;
		},
		loadPhisicalContent : function(obj,success,response){
			var data = Ext.util.JSON.decode(response.responseText);
			if(success){
				var target = this.tree.getSelectionModel().getSelectedNode();
				if(data.content.length==0){
					if(target.findChild('type','empty') == null)
						target.appendChild({
							text:"[Empty folder]",
							type:'empty',
							cls:'x-tree-noicon',
							leaf:true,
							disabled:true
						});
				}
				else
					for(var i = 0; i< data.content.length;i++){
						var nnode = new Ext.tree.TreeNode({
							leaf:!data.content[i].container,
							expandable:data.content[i].container,
							type:'physic',
							name: data.content[i].name,
							data:{
								name: data.content[i].name
							}
						});
						
						var enode = target.findChild('name',data.content[i].name);
						if(enode!= null)
							target.removeChild(enode);
						
						nnode.setText(data.content[i].name);
						target.appendChild(nnode);
					}
			}
			else
				Ext.Msg.alert("Error during loading project physical content.",data.msg);
		},
		tree_on_beforeexpandnode : function(node, deep, anim){
			if(node.id != this.tree.root.id){
				var serial = node.getPath('serial').split('/')[2];
				var path = this.openProjects[serial].data.Path;
				var branch = node.getPath('name');
				branch = branch.substr(branch.split('/')[2].length+2,branch.length)+"/";
				std.mod.ProjectManager.getPhisicalContent({
					params:{
						path:path,
						branch: branch
					},
					callback:Explorer.prototype.loadPhisicalContent.createDelegate(this)
				});
					
				this.tree.getSelectionModel().select(node);
			}
		},
		tree_on_beforecollapsenode:function(node,deep,anim){
			node.select();
		},
		mitem_addItem:function(){
			var current = this.getCurrentProject();
			if(current){
				var addItem = new TemplatePanel({path:this.getPath(),title:current.data.Name});
				addItem.show();
			}
		}
	}
});
