/*****
 * OpenFileDialog Properties:
 * *************************
 * @name: id
 * @type: string
 * @description: Indicates the name used in code to identify the object.
 * ----------------------------------------------------------------------------------------------
 * @name: addExtension
 * @type: boolean
 * @description: Controls whether extensions are automatically added to file names
 * ----------------------------------------------------------------------------------------------
 * @name: autoUpgradeEnabled
 * @type: boolean
 * @description: Update component when there changes in files.
 * ----------------------------------------------------------------------------------------------
 * @name: checkFileExists
 * @type: boolean
 * @description: Indicates whether warning appears when the user specifies a file that not exist.
 * ----------------------------------------------------------------------------------------------
 * @name: checkPathExists
 * @type: boolean
 * @description: Checks that the specified path exist before returning form the dialog.
 * ----------------------------------------------------------------------------------------------
 * @name: defaultExt
 * @type: string
 * @description: The default extension. If the user types a file name this extension will be 
 * added at the end of the file name if one is not specified.
 * ----------------------------------------------------------------------------------------------
 * @name: fileName
 * @type: string
 * @description: The file first shown in the dialog box, or the last one selected by the user.
 * ----------------------------------------------------------------------------------------------
 * @name: filter
 * @type: string
 * @description: The file filters to display in the dialog box, for example 
 * "JavaScript Files|*.js|All Files|*.*".
 * ----------------------------------------------------------------------------------------------
 * @name: filterIndex
 * @type: integer
 * @description: The index of the file filter selected in the dialog box. The fist item has an 
 * index of 1.
 * ----------------------------------------------------------------------------------------------
 * @name: icon
 * @type: cssClass
 * @description: The icon to display in the title bar of the dialog.
 * ----------------------------------------------------------------------------------------------
 * @name: initialDirectory
 * @type: string
 * @description: The initial directory for the dialog box.
 * ----------------------------------------------------------------------------------------------
 * @name: multiSelect
 * @type: boolean
 * @description: Controls whether multiple file can be selected in the dialog.
 * ----------------------------------------------------------------------------------------------
 * @name: readOnly
 * @type: boolean
 * @description: The state of read-only.
 * ----------------------------------------------------------------------------------------------
 * @name: restoreDirectory
 * @type: boolean
 * @description: Controls whether the dialog box restores the current directory before closing.
 * ----------------------------------------------------------------------------------------------
 * @name: showHelp
 * @type: boolean
 * @description: Show the help button.
 * ----------------------------------------------------------------------------------------------
 * @name: title
 * @type: string
 * @description: The string to display in the title bar of the dialog.
 * ----------------------------------------------------------------------------------------------
 * 
 * ******/
//std.include('plugins/OpenFileDialog/client/js/controllers/OpenFileDialog.class.js');
Kcl.Class( 'OpenFileDialog', 
{
	require : [
		'plugins/OpenFileDialog/client/css/main.css',
		'plugins/OpenFileDialog/client/css/icons.css',
		'plugins/OpenFileDialog/client/js/controllers/OpenFileDialog.class.js'
	],
    extend: Kcl.Plugin,
    property:{               
        lookup:{}
    },
    behavior:{
        construct: function(params){
            var _this = OpenFileDialog.prototype;
            this.store = new Ext.data.JsonStore({
                url: std.frontController.getRequest("getDirContent", "OpenFileDialog"),
                root: 'info',
                fields: [
                'name', 'icon',{
                    name:'empty', 
                    type: 'boolean'
                },{
                    name:'path',
                    type:'string'
                },{
                    name:'fileType',
                    type:'string'
                },{
                    name:'target',
                    type:'boolean'
                }]
            });
            this.store.on('load',_this.store_onload,this);
            ///////////////////////////////////
            this.fileName         = !params || !params.fileName ? "": params.fileName;
            this.initialDirectory = !params || !params.initialDirectory ? "/var/www": params.initialDirectory;
            this.title            = !params || !params.title? "Open file": params.title;
            this.multiSelect      = !params || !params.multiSelect ? true : !params.multiSelect;
            this.filterIndex      = !params || !params.filterIndex ? 0 : params.filterIndex;
            this.callback         = !params || !params.callback ? null : params.callback;
            this.foldersOnly      = !params || !params.foldersOnly? false: params.foldersOnly;
            this.buildGUI();

        },
        buildGUI:function(){
            var _this = OpenFileDialog.prototype;
            
            //Components declaration region
            this.dialogBox = new Ext.form.TextField();            
            this.gridSelectionModel = new Ext.grid.RowSelectionModel();
            this.gridView = new Ext.grid.GridView();            
            this.gridSelectionModel.singleSelect = _this.multiSelect;
            this.gridpanel = new Ext.grid.GridPanel();
            this.appViewer = new Ext.Panel();
            this.defaultSelectionModel = new Ext.tree.DefaultSelectionModel();            
            this.toolBar = new Ext.Toolbar();
            this.toolBar2 = new Ext.Toolbar();
            this.addressBar = new Ext.form.ComboBox();
            this.extensionBox = new Ext.form.ComboBox();                       
            //
            //thumbTemplate
            //
            this.thumbTemplate = new Ext.XTemplate(
                '<tpl for=".">',
                '<div class="thumb-wrap" id="{name}">',
                '<div class="thumb"><img src="{icon}" title="{name}"></div>',
                '<span>{shortName}</span></div>',
                '</tpl>'
            );
            this.thumbTemplate.compile();            
            //
            //dataview.##Important all its contents it's in a single line, the one that's fallowing
            //
            this.dataview = new Ext.DataView({
				id:'dataview',
				tpl: this.thumbTemplate,
				singleSelect: _this.multiSelect,
				autoScroll: true,
				overClass:'x-view-over',
				itemSelector: 'div.thumb-wrap',
				emptyText : '<div style="padding:10px; text-align:center; font-weight:bold;">No templates available</div>',
				store: this.store,
				prepareData:_this.formatData.createDelegate(this),
				selectedIndex:function(){
					var selNode = this.getSelectedIndexes();
					/*[0].projectType;*/
					return selNode[0];
				},
				selectItem:function(item){
					this.select(item);
				},
				selectedItemId:function(){
					var selNode = this.getSelectedNodes();
					/*[0].projectType;*/ 
					selNode = selNode[0];
					return selNode.id;
				}
			});
			this.dataview.on('selectionchange',_this.dataview_selectionchange,this);
			this.dataview.on('dblclick',_this.doCallback,this);
			this.dataview.on('loadexception',_this.onLoadException,this);
			this.dataview.on('beforeselect',function(view){return view.store.getRange().length > 0;});
            //
            //gridView
            //           
            this.gridView.emptyText = '<div style="padding:10px; text-align:center; font-weight:bold;">No files were found</div>';
            //
            //gridColumnmodel
            //            
            this.gridColumnModel = new Ext.grid.ColumnModel([{
                id:'icon',
                dataIndex:'icon',
                header:'Icon',
                hidden:true,
                width:50
            },{
                id:'name',
                dataIndex:'name',
                header:'Name',
                sortable:true,
                editor: new Ext.form.TextField(),
                width:100,
                renderer:_this.gridColumn2_renderer
            },{
                id:'size', 
                header:'Size', 
                width:50, 
                dataIndex:'size',
                hidden:true
            },{
                id:'type', 
                header:'Type', 
                width:100, 
                dataIndex:'fileType',
                sortable:true
            },{
                id:'path', 
                header:'Path', 
                width:100, 
                dataIndex:'path',
                hidden:true
            }]);
            //
            //gridSelectionModel
            //
            this.gridSelectionModel.on('rowselect',_this.gridSelectionModel_onrowselect,this);
            //
            //gridpanel
            //            
            this.gridpanel.store = this.store;
            this.gridpanel.colModel = this.gridColumnModel;
            this.gridpanel.selModel = this.gridSelectionModel;
            this.gridpanel.autoExpandColumn = 'name';
            this.gridpanel.autoScroll = true;
            this.gridpanel.border = false;
            this.gridpanel.setHeight('100%');
            this.gridpanel.enableKeyEvents = true,
            this.gridpanel.view = this.gridView;
            this.gridpanel.on('afterrender',_this.gridpanel_onafterrender,this);
            this.gridpanel.on('loadexception',_this.onLoadException);
            this.gridpanel.on('rowdblclick',_this.gridpanel_onrowdblclick,this);
            this.gridpanel.on('keydown',_this.gridpanel_onkeydown,this);
            this.gridpanel.on('rowclick',_this.gridpanel_onrowclick,this);
            this.gridpanel.selectedIndex = _this.selectedIndex_gridpanel;
            this.gridpanel.selectItem = _this.selectItem_gridpanel;
            this.gridpanel.selectedItemId = _this.selectedItemId_gridpanel;
            //
            //appViewer
            //            
            this.appViewer.layout = 'card';
            this.appViewer.activeItem = 1;
            this.appViewer.region = 'center';
            this.appViewer.border = false;
            this.appViewer.add(this.dataview);
            this.appViewer.add(this.gridpanel);
            this.appViewer.getActiveItem = _this.getActiveItem_appViewer;
            this.appViewer.setActiveElement = _this.setActiveElement_appViewer;
            //
            //defaultSelectionModel
            //
            this.defaultSelectionModel.on('beforeselect',_this.defaultSelectionModel_onbeforeselect);
            //
            //rootNode
            //
            this.rootNode = new Ext.tree.TreeNode();
            this.rootNode.attributes.path = this.initialDirectory;
            this.rootNode.setText('root');            
            //
            //tree
            //
            this.tree = new Ext.tree.TreePanel({margins:'0 3 0 0',singleExpand:true});
            this.tree.rootVisible = false;
            this.tree.setRootNode(this.rootNode);
            this.tree.selModel = this.defaultSelectionModel;
            this.tree.region = 'west';
            this.tree.setWidth(150);            
            this.tree.useArrows = true;            
            this.tree.lines = false;
            this.tree.autoScroll = true;
            this.tree.border = false;
            this.tree.on('click',_this.tree_onclick,this);
            this.tree.on('beforeexpandnode',_this.tree_onbeforeexpandnode,this);            
            //
            //store1
            //
            this.store1 = new Ext.data.JsonStore({
                url: std.frontController.getRequest("getDirContent", "OpenFileDialog"),
                method:'GET',
                fields: ['text',{name:'path',type:'string'}]
            });
            this.store1.on('beforeload',_this.store1_onbeforeload);
            this.store1.on('load',_this.store1_onload);
            //
            //addressBar
            //
            this.addressBar.setValue(_this.initialDirectory);            
            this.addressBar.store = this.store1;
            this.addressBar.mode = 'local';
            this.addressBar.editable = true;
            this.addressBar.typeAhead = true;
            this.addressBar.triggerAction = 'all';
            this.addressBar.lazyInit = false
            this.addressBar.displayField = 'path';
            this.addressBar.enableKeyEvents = true;
            this.addressBar.setWidth(255);            
            this.addressBar.on('keypress',_this.addressBar_onkeypress,this);
            //
            //tbItem1
            //
            this.tbItem1 = new Ext.Button();
            this.tbItem1.iconCls = 'icon-back';
            //
            //tbItem2
            //
            this.tbItem2 = new Ext.SplitButton();
            this.tbItem2.iconCls = 'icon-foward';
            //
            //tbItem3
            //
            this.tbItem3 = new Ext.Button();
            this.tbItem3.iconCls = 'icon-up';
            this.tbItem3.on('click',_this.stepBack,this);
            //
            //tbItem4
            //
            this.tbItem4 = new Ext.Button();
            this.tbItem4.iconCls = 'icon-reload';
            this.tbItem4.on('click',_this.tbItem4_onclick,this);
            //
            //searchFilter
            //
            this.searchFilter = new Ext.form.TextField();
            this.searchFilter.id = 'filter';
            this.searchFilter.cls = 'search-filter';
            this.searchFilter.enableKeyEvents = true;
            this.searchFilter.emptyText = "Search File";
            this.searchFilter.selectOnFocus = true;
            this.searchFilter.setWidth(120);
            this.searchFilter.on('render',_this.on_render_searchFilter);
            this.searchFilter.on('keyup',_this.filter);
            //
            //toolBar
            //
            this.toolBar.add(this.tbItem1);
            this.toolBar.add(this.tbItem2);
            this.toolBar.add(this.tbItem3);
            this.toolBar.add(this.addressBar);
            this.toolBar.add(this.tbItem4);
            this.toolBar.add(this.searchFilter);           
            //
            //dialogBox
            //
            this.dialogBox.setWidth(200);
            this.dialogBox.enableKeyEvents = true;
            this.dialogBox.allowBlank = false;
            this.dialogBox.setValue(this.fileName);
            this.dialogBox.blankText = "A filename is required";
            this.dialogBox.fieldLabel = "File Name";
            //
            //store2
            //
            this.store2 = new Ext.data.ArrayStore({
                fields: ['displayText','ext'],
                data: [['All Files','*.*'], ['Php Files', '*.php']]
            });
            //
            //extensionBox
            //            
            this.extensionBox.store = this.store2;
            this.extensionBox.triggerAction = 'all';
            this.extensionBox.forceSelection = true;
            this.extensionBox.mode = 'local';
            this.extensionBox.typeAhead = true;
            this.extensionBox.displayField = 'displayText';
            this.extensionBox.valueField = 'ext';
            this.extensionBox.margins = '0 0 0 8';
            this.extensionBox.setWidth(115);
            this.extensionBox.setValue(this.store2.getAt(this.filterIndex).data.ext);
            this.extensionBox.on('select',_this.extensionBox_onselect,this);
            //
            //splitButton1
            //
            this.splitButton1 = new Ext.SplitButton();
            this.splitButton1.setText("Sort by");
            //
            //button1
            //
            this.button1 = new Ext.Button();
            this.button1.setText("New Folder");
            //
            //bntGrid
            //
            this.btnGrid = new Ext.Button();
            this.btnGrid.iconCls = 'icons-view';
            this.btnGrid.setTooltip("Icons View");
            this.btnGrid.enableToggle = true;
            this.btnGrid.toggleGroup = 'viewers';
            this.btnGrid.pressed = true;
            this.btnGrid.on('click',_this.on_click_btnGrid);
            //
            //bntDataview
            //
            this.btnDataview = new Ext.Button();
            this.btnDataview.iconCls = 'details-view';
            this.btnDataview.setTooltip("Details View");
            this.btnDataview.enableToggle = true;
            this.btnDataview.toggleGroup = 'viewers';
            this.btnDataview.on('click',_this.on_click_btnDataview);
            
            //
            //toolBar2
            //
            this.toolBar2.add(this.splitButton1);
            this.toolBar2.add(this.button1);
            this.toolBar2.add('->');
            //this.toolBar2.add(this.btnGrid);
            //this.toolBar2.add(this.btnDataview);
            //
            //centerPanel
            //
            this.centerPanel = new Ext.Panel({tbar:this.toolBar2});
            this.centerPanel.region = 'center';
            this.centerPanel.layout = 'border';
            this.centerPanel.add(this.tree);
            this.centerPanel.add(this.appViewer);
            //
            //form
            //
            this.form = new Ext.Panel();
            this.form.layout = 'form';
            this.form.add(this.dialogBox);
            //
            //southPanel
            //
            this.southPanel = new Ext.Panel();
            this.southPanel.region = 'south';
            this.southPanel.layout = 'hbox';
            this.southPanel.setDisabled(this.foldersOnly);
            this.southPanel.setVisible(!this.foldersOnly);
            this.southPanel.frame = true;
            this.southPanel.border = false;
            this.southPanel.margins = '2 0 0 0';
            this.southPanel.padding = '0 5 0 40';
            this.southPanel.setHeight(40);
            this.southPanel.add(this.form);
            this.southPanel.add(this.extensionBox);
            //this.southPanel.hidden = true;
            //
            //btnOpen
            //
            this.btnOpen = new Ext.Button();
            this.btnOpen.setText("Open");
            this.btnOpen.on('click',_this.getPath,this);
            //
            //btnCancel
            //
            this.btnCancel = new Ext.Button();
            this.btnCancel.setText("Cancel");
            this.btnCancel.on('click',_this.btnCancel_onclick,this);
            //
            //obj
            // 
            this.obj = new Ext.Window({tbar:this.toolBar});
            this.obj.setTitle(this.title);
            this.obj.setSize(500,430);
            this.obj.layout = 'border';
            this.obj.resizable = false;
            this.obj.modal = true;
            this.obj.constrain = true;
            this.obj.addButton(this.btnOpen);
            this.obj.addButton(this.btnCancel);
            this.obj.add(this.centerPanel);
            this.obj.add(this.southPanel);
            this.obj.on('afterrender',_this.obj_onafterrender,this);
        }
    }
});
