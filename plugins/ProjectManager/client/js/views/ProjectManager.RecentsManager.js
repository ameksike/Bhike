/*
 * $package: BHike
 * 
 * $description: RecentProjectsPanel is a Ksike's JavaScript class definition that....
 * $authors: no-body
 * $created: Wed, 31 Oct 12 16:58:45 -0500
 * $license: GPL v3
 **/

Kcl.Class('ProjectManager.RecentsManager',
{
    property:{
        obj:null
    },
    behavior:{
        buildGUI:function(){
			var _this = ProjectManager.RecentsManager.prototype;
			///
            ///mitem_openProject
            ///
            this.mitem_openProject = new Ext.menu.Item();            
			this.mitem_openProject.iconCls = 'icon-open-file';
            this.mitem_openProject.setText("Open Project");
            this.mitem_openProject.on('click',_this.mitem_openProject_onclick,this);
            ///
            ///mitem_removeRecent
            ///
            this.mitem_removeRecent = new Ext.menu.Item();            
            this.mitem_removeRecent.iconCls = 'icon-edition-delete';
            this.mitem_removeRecent.setText("Remove from recents");
            this.mitem_removeRecent.on('click',_this.mitem_removeRecent_onclick,this);
			///
            ///contextMenu
            ///
            this.contextMenu = new Ext.menu.Menu();
            this.contextMenu.addItem(this.mitem_openProject);
            this.contextMenu.addItem(this.mitem_removeRecent);
			///
			///selModel
			///
			this.selModel = new Ext.tree.DefaultSelectionModel();
			//this.selModel.on('beforeselect',_this.selModel_onbeforeselect);			
			///
			///tree
			///
			this.tree = new Ext.tree.TreePanel();
			this.tree.autoScroll = true;
            this.tree.border = false;
            this.tree.lines = false;
            this.tree.rootVisible = false;
            this.tree.contextMenu = this.contextMenu;
            this.tree.selModel = this.selModel;
			this.tree.setRootNode({nodeType:'async',children:[]});           
            this.tree.on('click',_this.tree_onclick,this);            
            this.tree.on('contextmenu',_this.tree_oncontextmenu,this);
            //this.tree.on('append',_this.tree_onappend,this);
			//
			//this.obj
			//
			this.obj = new Ext.form.FieldSet();
            this.obj.padding = '0 10 0 0';
            this.obj.border = false;
            this.obj.layout = 'fit';
            this.obj.setHeight(300);
            this.obj.setTitle("Recent Projects:");
            this.obj.on('beforerender',_this.obj_onbeforerender,this);
            this.obj.add(this.tree);
		}
    }
});
