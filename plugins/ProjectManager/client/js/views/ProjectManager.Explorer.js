Kcl.Class('ProjectManager.Explorer',
{
    extend: Main.FloattingPanel,
    construct:function(){
		this.parent.construct.apply(this, [this]);
	},
    behavior:{
        buildGUI:function(params){
			var _this = ProjectManager.Explorer.prototype;
			///
			///propertiesPanel
			///
			this.propertiesPanel = new ProjectManager.PropertiesPanel();
			this.propertiesPanel.buildGUI();
			///
            ///menuItem1
            ///
            this.menuItem1 = new Ext.menu.Item();
            this.menuItem1.id = "rebuild-project";
            this.menuItem1.setText("Rebuild Project");
            ///
            ///menuItem4
            ///
            this.menuItem4 = new Ext.menu.Item();
            this.menuItem4.id = "execute-project";
            this.menuItem4.setText("Execute Project");
            ///THIS MOST BE DEFINED IN THE EXECUTION MODULE
            std.mod.ProjectManager.gui.map.addBinding({
				stopEvent:true,
				key: Ext.EventObject.F5,
				ctrl:true,
				fn: _this.executeProject,
				scope:this
			});
            ///
            ///menuItem2
            ///
            this.menuItem2 = new Ext.menu.Item();
            this.menuItem2.id = "close-node";
            this.menuItem2.setText("Close Project");
            ///
            ///mitem_remove
            ///
            this.mitem_remove = new Ext.menu.Item();
            this.mitem_remove.setText("Remove");
            this.mitem_remove.iconCls = 'icon-edition-delete';
            this.mitem_remove.on("click",_this.mitem_remove_onclick,this);
			///START ADD REGION
			std.mod.ProjectManager.gui.toolBar.btn_newFile.setIconClass('icon-new-item');
			std.mod.ProjectManager.gui.toolBar.btn_newFile.setTooltip("Add New Item");
			std.mod.ProjectManager.gui.toolBar.btn_newFile.on('click',_this.mitem_addItem,this);
			std.mod.ProjectManager.gui.toolBar.btn_newFile.setDisabled(true);
			///
			///mit_addNewItem
			///
			this.mit_addNewItem = new Ext.menu.Item();
			this.mit_addNewItem.setText("New Item");
			this.mit_addNewItem.setIconClass('icon-new-item');
			this.mit_addNewItem.on('click',_this.mitem_addItem,this);
            ///
            ///mit_menu
            ///
            this.mit_menu = new Ext.menu.Menu();
            this.mit_menu.add(this.mit_addNewItem);
            //std.mod.ProjectManager.gui.menuBar.addItem(this.mit_addNewItem, "madd");
            ///
            ///mit_add            
            ///
            this.mit_add = new Ext.menu.Item();
            this.mit_add.setText('Add');
            this.mit_add.menu = this.mit_menu;
            ///END ADD REGION
            ///
            ///menuItem3
            ///
            this.menuItem3 = new Ext.menu.Item();
            this.menuItem3.setText("Properties");
            this.menuItem3.iconCls = 'icon-view-properties';
            ///
            ///contextMenu
            ///
            this.contextMenu = new Ext.menu.Menu();
            this.contextMenu.addItem(this.menuItem1);
            this.contextMenu.addItem(this.menuItem2);
            this.contextMenu.addItem(this.menuItem4);
            this.contextMenu.addItem('-');
            this.contextMenu.addItem(this.mit_add);
            this.contextMenu.addItem('-');
            this.contextMenu.addItem(this.mitem_remove);
            this.contextMenu.addItem('-');
            this.contextMenu.addItem(this.menuItem3);            
            //this.contextMenu.on('itemclick',_this.on_itemclick_contextMenu);
            ///
            /// defaultSelectionModel
            ///
            this.defaultSelectionModel = new Ext.tree.DefaultSelectionModel();               
            this.defaultSelectionModel.on('beforeselect',_this.defaultSelectionModel_onbeforeselect,this);
            ///
            ///tbItem1
            ///
            this.tbItem1 = new Ext.Button();
            this.tbItem1.iconCls = 'icon-view-properties';
            this.tbItem1.setTooltip('Show Properties');
            this.tbItem1.disabled = true;
            this.tbItem1.on('click',_this.tbItem1_onclick,this);
            ///
            ///btn_showAll
            ///
            this.btn_showAll = new Ext.Button();
            this.btn_showAll.iconCls = 'icon-explorer-showall';
            this.btn_showAll.setTooltip('Show All Files');
            this.btn_showAll.enableToggle = true;
            this.btn_showAll.pressed = false;
            this.btn_showAll.on('toggle',_this.btn_showAll_ontoggle,this);
            ///
            ///toolBar
            ///
            this.toolBar = new Ext.Toolbar();
            this.toolBar.add(this.tbItem1);
            this.toolBar.add('-');
            this.toolBar.add(this.btn_showAll);
            ///
            ///btn_explorer
            ///
            this.btn_explorer = new Ext.Button();
            this.btn_explorer.iconCls = 'icon-explorer';
            this.btn_explorer.setTooltip("Solution Explorer");
            this.btn_explorer.on('click',_this.btn_explorer_onclick,this);
            ///
            ///rootNode
            ///            
            this.rootNode = new Ext.tree.TreeNode();
            this.rootNode.typeOfNode = 'root';
            this.rootNode.id = 'root-node';
            ///
            ///tree
            ///
            this.tree = new Ext.tree.TreePanel({tbar:this.toolBar});
            this.tree.setTitle("Solution Explorer",'icon-explorer');
            this.tree.ddGroup = 'editable';
            this.tree.border = false;
            this.tree.rootVisible = false;
            this.tree.autoScroll = true;
            this.tree.enableDD = true;
			this.tree.containerScroll = true;
            this.tree.contextMenu = this.contextMenu;
            this.tree.selModel = this.defaultSelectionModel;
            this.tree.setRootNode(this.rootNode);
            this.tree.on('contextmenu',_this.tree_oncontextmenu,this);
            this.tree.on('beforeexpandnode',_this.obj_onbeforeexpandnode,this);
            //this.tree.on('beforecollapsenode',this.obj_onbeforecollapsenode,this);
            this.tree.on('dblclick',_this.obj_ondblclick,this);
            ///
            ///treeSorter
            ///
            this.treesorter = new Ext.tree.TreeSorter(this.tree, {
				folderSort: true,
				dir: "asc"
			});
			///
			///tabpanel
			///
			this.tabpanel = new Ext.TabPanel();
			this.tabpanel.region = 'center';
			this.tabpanel.activeTab = 0;
			this.tabpanel.add(this.tree);			
			this.tabpanel.border = false;
            ///
            ///obj
            ///
            this.obj = new Ext.Panel({defaults:{split:true}});
            this.obj.layout = "border";
            this.obj.border = false;
            this.obj.add(this.tabpanel);
            this.obj.add(this.propertiesPanel.obj);
            //this.obj.doLayout();
            ///ADD COMPONENTS TO WRAPPER
            std.mod.ProjectManager.gui.east.add(this.obj);
            std.mod.ProjectManager.gui.toolBar.insertItem(this.btn_explorer,std.mod.ProjectManager.gui.toolBar.obj.items.length-1);
        }      
    }
});
