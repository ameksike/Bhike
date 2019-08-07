Kcl.Class('Explorer',
{
    extend: FloattingPanel,
    construct:function(params){
		this.parent.construct.apply(this, [this]);
	},
    behavior:{
        buildGUI:function(params){
            var _this = Explorer.prototype;

            this.propertiesPanel = new PropertiesPanel();
            
            this.defaultSelectionModel = new Ext.tree.DefaultSelectionModel();
            this.tbItem1 = new Ext.Button();
            this.toolBar = new Ext.Toolbar();                
            this.menuItem1 = new Ext.menu.Item();
            this.menuItem2 = new Ext.menu.Item();
            this.menuItem3 = new Ext.menu.Item();
            this.menuItem4 = new Ext.menu.Item();
            this.menuItem5 = new Ext.menu.Item();
            this.contextMenu = new Ext.menu.Menu();
            this.rootNode = new Ext.tree.TreeNode();
            ///
            ///menuItem1
            ///
            this.menuItem1.id = "rebuild-project";
            this.menuItem1.setText("Rebuild Project");
            ///
            ///menuItem4
            ///
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
            this.menuItem2.id = "close-node";
            this.menuItem2.setText("Close Project");
            ///
            ///menuItem5
            ///
            this.menuItem5.id = "delete-node";
            this.menuItem5.setText("Remove");
            this.menuItem5.iconCls = 'icon-edition-delete';       
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
            this.menuItem3.setText("Properties");
            this.menuItem3.iconCls = 'icon-view-properties';
            ///
            ///contextMenu
            ///
            this.contextMenu.addItem(this.menuItem1);
            this.contextMenu.addItem(this.menuItem2);
            this.contextMenu.addItem(this.menuItem4);
            this.contextMenu.addItem('-');
            this.contextMenu.addItem(this.mit_add);
            this.contextMenu.addItem('-');
            this.contextMenu.addItem(this.menuItem5);
            this.contextMenu.addItem('-');
            this.contextMenu.addItem(this.menuItem3);
            
            this.contextMenu.on('itemclick',_this.on_itemclick_contextMenu);
            ///
            /// defaultSelectionModel
            ///               
            this.defaultSelectionModel.on('beforeselect',_this.on_beforeselect_defaultSelectionModel,this);
            ///
            ///tbItem1
            ///
            this.tbItem1.iconCls = 'icon-view-properties';
            this.tbItem1.setTooltip('Show Properties');
            this.tbItem1.disabled = true;
            this.tbItem1.on('click',_this.on_click_tbItem1,this);
            ///
            ///btn_showAll
            ///
            this.btn_showAll = new Ext.Button();
            this.btn_showAll.iconCls = 'icon-explorer-showall';
            this.btn_showAll.setTooltip('Show All Files');            
            this.btn_showAll.hidden = true;
            this.btn_showAll.enableToggle = true;
            this.btn_showAll.pressed = true;
            //this.btn_showAll.on('click',_this.btn_showAll_on_click,this);
            ///
            ///toolBar
            ///
            this.toolBar.add(this.tbItem1);
            this.toolBar.add('-');
            this.toolBar.add(this.btn_showAll);
            ///
            ///rootNode
            ///
            this.rootNode.setText("BHike Projects");
            this.rootNode.typeOfNode = 'solution';
            this.rootNode.id = 'root-node';
            this.rootNode.setText('/');
            ///
            ///tree
            ///
            this.tree = new Ext.tree.TreePanel();
            ///this.tree.iconCls = 'icon-project-explorer';
            ///this.tree.setTitle("Project Explorer");
            this.tree.border = false;
            this.tree.ddGroup = 'editable';
            this.tree.setHeight(300);
            this.tree.rootVisible = false;
            this.tree.treeLoader = this.treeLoader;
            this.tree.autoScroll = true;
            this.tree.enableDD = true;
			this.tree.containerScroll = true;
            this.tree.contextMenu = this.contextMenu;
            this.tree.selModel = this.defaultSelectionModel;
            this.tree.setRootNode(this.rootNode);
            this.tree.on('contextmenu',this.on_contextmenu_obj,this);
            this.tree.on('beforeexpandnode',this.tree_on_beforeexpandnode,this);
            this.tree.on('beforecollapsenode',this.tree_on_beforecollapsenode,this);
            this.tree.on('dblclick',_this.obj_on_dblclick,this);
            ///
            ///obj
            ///
            //this.obj = new Ext.Panel(/*this.parent.parent.obj.cloneConfig(*/{title:"Project Explorer",tbar:this.toolBar});//));
            this.obj.closeAction = 'hide';
            this.obj.iconCls = 'icon-explorer';
            this.obj.region = 'north';
            this.obj.layout = 'fit';
            this.obj.setHeight(250);            
            //this.obj.autoShow = true;
            this.obj.add(this.tree);                        
            ///
            ///btn_explorer
            ///
            this.btn_explorer = new Ext.Button();
            this.btn_explorer.iconCls = 'icon-explorer';
            this.btn_explorer.setTooltip("Project Explorer");
            this.btn_explorer.on('click',_this.btn_explorer_onclick,this);

            std.mod.ProjectManager.gui.toolBar.insertItem(this.btn_explorer,std.mod.ProjectManager.gui.toolBar.obj.items.length);
            std.mod.ProjectManager.gui.east.addItem(this.obj);
            std.mod.ProjectManager.gui.east.addItem(this.propertiesPanel.obj);            
        }            
    }
});
