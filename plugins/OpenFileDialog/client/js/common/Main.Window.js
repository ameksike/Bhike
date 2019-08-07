/*****
 * MainWindow Properties:
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
Kcl.Class( 'MainWindow', 
{
    extend: Kcl.Plugin,
    property:{
        fileName:null,
        title:null,
        initialDirectory:null,
        icon:null,
        store: null,
        dataview:null,
        gridview:null,
        appViewer:null,
        tree:null,
        panel:null,
        toolBar:null,
        dialogBox:null,
        treeLoader:null,
        obj:null,
        path:null,
        lookup:{}
    },
    behavior:{
        construct: function(params){
            var _this = MainWindow.prototype;
            _this.store = new Ext.data.JsonStore({
                url: std.FrontController.getRequest("getFiles", "MainWindow"),
                //url: 'app/server/include/MainWindow.php',
                root: 'info',
                fields: [
                'name', 'icon',{
                    name:'size', 
                    type: 'float'
                },{
                    name:'url',
                    type:'string'
                },{
                    name:'fileType',
                    type:'string'
                }],
                listeners: {
                    'load': function(){
                        //_this.appViewer.getActiveItem().selectItem(0);
                    }
                }
            });
			
            _this.treeLoader = new Ext.tree.TreeLoader({
                dataUrl: std.FrontController.getRequest("treeHandler", "MainWindow"),
                requestMethod: 'GET',
                listeners:{
                    "beforeload": /*this.onAppSelect*/ function(tl, node) {
                        tl.baseParams = {
                            nodePath    : node.attributes.nodePath,
                            typeOfNode  : node.attributes.typeOfNode
                        };								
                    }
                }
            });
            ///////////////////////////////////
            this.fileName = !params || !params.fileName ? "": params.fileName;
            this.initialDirectory = !params || !params.initialDirectory ? "/home": params.initialDirectory;
            this.title = !params || !params.title? "Open file": params.title;
            this.buildGUI();

        },
        buildGUI:function(){
            var _this = MainWindow.prototype;
			
            _this.initTemplates();
		
            var formatSize = function(data){
                if(data.size < 1024) {
                    return data.size + " bytes";
                } else {
                    return (Math.round(((data.size*10) / 1024))/10) + " KB";
                }
            };

            var formatData = function(data){
                data.shortName = data.name.ellipse(15);
                data.sizeString = formatSize(data);
                //data.description = new Date(data.description).format("m/d/Y g:i a");
                this.lookup[data.name] = data;
                return data;
            };

            this.dataview = new Ext.DataView({
                tpl: this.thumbTemplate,
                singleSelect: true,
                autoScroll: true,
                overClass:'x-view-over',
                itemSelector: 'div.thumb-wrap',
                emptyText : '<div style="padding:10px; text-align:center; font-weight:bold;">No templates available</div>',
                store: this.store,					
                listeners: {
                    'selectionchange': {
                        fn:_this.dataview_selectionchange, 
                        scope:this, 
                        buffer:100
                    },						
                    'dblclick'       : {
                        fn:_this.doCallback, 
                        scope:this
                    },
                    'loadexception'  : {
                        fn:_this.onLoadException, 
                        scope:this
                    },
                    'beforeselect'   : {
                        fn:function(view){
                            return view.store.getRange().length > 0;
                        }
                    }
                },
                prepareData: formatData.createDelegate(this),					
                selectedIndex:function(){
                    var selNode = this.getSelectedIndexes();//[0].projectType;
                    return selNode[0];						
                },
                selectItem:function(item){
                    this.select(item);
                },
                selectedItemId:function(){
                    var selNode = this.getSelectedNodes();//[0].projectType;
                    selNode = selNode[0];
                    return selNode.id;
                }
            });
				
            this.gridview = new Ext.grid.GridPanel({
                tpl: this.thumbTemplate,
                autoExpandColumn:'name',
                autoScroll: true,
                border:false,
                height:'100%',
                view: new Ext.grid.GridView({
                    emptyText : '<div style="padding:10px; text-align:center; font-weight:bold;">No templates available</div>'
                }),
                store: this.store,
                columns:[{
                    id:'icon', 
                    header:'icon', 
                    width:50, 
                    dataIndex:'icon', 
                    renderer:function(val){
                        return '<img class="list-thumb" src="'+val+'"/>';
                    }
                },{
                    id:'name', 
                    header:'name', 
                    width:100, 
                    dataIndex:'name'
                },{
                    id:'size', 
                    header:'Size', 
                    width:50, 
                    dataIndex:'size'
                },{
                    id:'type', 
                    header:'Type', 
                    width:100, 
                    dataIndex:'fileType'
                },{
                    id:'url', 
                    header:'Path', 
                    width:100, 
                    dataIndex:'url',
                    hidden:true
                }],
                sm: new Ext.grid.RowSelectionModel({
                    singleSelect:true,
                    listeners:{
                        'selectionchange': {
                            fn:_this.gridview_selectionchange, 
                            scope:this, 
                            buffer:100
                        }
                    }						
                }),
                listeners: {
                    'loadexception'  : {
                        fn:_this.onLoadException, 
                        scope:this
                    },
                    'rowdblclick':function(grid,rowIndex,e){
                        var res = grid.getStore().getAt(rowIndex);
                        //alert(res.data.fileType);
                        if(res.data.fileType=='Folder')
                            _this.loadData(res.data.url);
                        else{// Here is necesarily to implement the extensions use.
                            _this.path = res.data.url;
                            _this.obj.close();
                            _this.getPath();
                        }
                    }
                },
                selectedIndex:function(){
                    var selected = this.getSelectionModel().getSelected();
                    return this.getStore().indexOf(selected);
                },
                selectItem:function(item){
                    this.getSelectionModel().selectRow(item);
                },
                selectedItemId:function(){
                    var selNode = this.getSelectionModel().getSelected();
                    return selNode.data.url; //return selNode.data.name; this is the original Value
                }
            });
				
            _this.appViewer = new Ext.Panel({
                layout:'card',
                activeItem:1,
                region: 'center',					
                items:[this.dataview,this.gridview],
                getActiveItem: function(){
                    var lay = this.getLayout().activeItem.id;
                    return Ext.getCmp(lay);
                },
                setActiveElement: function(item){
                    var viewer = this.getActiveItem();
                    var index = viewer.selectedIndex();
                    this.getLayout().setActiveItem(item);
                    viewer = this.getActiveItem();
                    viewer.selectItem(index);
                }
            });
				
            _this.tree = new Ext.tree.TreePanel({
                region:'west',
                margins:'2 2 0 0',
                width:150,
                useArrows:true,
                singleExpand:true,
                lines:false,
                rootVisible:false,
                autoScroll:true,
                emptyText:'< No Project Templates Loaded >',
                loader: _this.treeLoader,                                        
                root: new Ext.tree.AsyncTreeNode({
                    expanded: true,
                    typeOfNode:'root',
                    nodePath:'root',
                    text:"root",
                    defaults:{
                        singleClickExpand:true
                    }
                }),
                selModel: new Ext.tree.DefaultSelectionModel({
                    listeners:{
                        'beforeselect' :{
                        }
                    }
                }),
                listeners:{
                    'expandnode':function(node){
                         _this.loadData(node.attributes.nodePath);
                    },
                    'click':function(node, e){
                        _this.loadData(node.attributes.nodePath);
                    }
                }			
            });
			
            this.toolBar = new Ext.Toolbar({
                items:[{
                    iconCls:'icon-back'
                },{
                    iconCls:'icon-foward',
                    xtype:'splitbutton'
                },{
                    iconCls:'icon-up'
                },{
                    xtype:'combo',
                    width: 300,
                    editable: true,
                    mode: 'local',
                    typeAhead: true,
                    triggerAction: 'all',
                    lazyInit: false,
                    displayField: 'name',
                    valueField: 'ver',
                    store: new Ext.data.ArrayStore({
                       fields: ['ver', 'name'],
                       data : [[0, this.initialDirectory]]
                    }),
                    value:0,
                    listeners: {								
                                        }
               },{
                    iconCls:'icon-reload',
                    handler:function(){
                        _this.tree.getLoader().load(_this.tree.root)
                    }
               },' ',{
                    xtype: 'textfield',
                    id: 'filter',
                    emptyText:'Search File',
                    cls:'search-filter',
                    selectOnFocus: true,
                    width: 120,
                    listeners: {
                        'render': {
                            fn:function(){
                                Ext.getCmp('filter').getEl().on('keyup', function(){
                                    this.filter();
                                }, this, {buffer:500});
                            },scope:this
                        }
                    }
                }]
            });
			
            this.dialogBox = new Ext.form.TextField({
                width:360,
                enableKeyEvents:true,
                allowBlank:false,
                value:this.fileName,
                fieldLabel:'File Name',
                listeners:{
                    'change': function(comp, newValue, oldValue){
                         this.changeValue(newValue);
                     },
                    'keyup':function(comp,e){
                         this.changeValue(comp.getValue());
                    }
                }
            });
			
			
            this.panel = new Ext.Panel({
                layout: 'border',
                border: false,					
                items:[{
                    region:'center',
                    layout:'border',					
                    defaults:{
                        border:false
                    },
                    tbar:[{
                        xtype:'splitbutton',
                        text:'Sort by'
                    },{
                        text:'New Folder'
                    },'->',{
                        disabled:true,
                        xtype:'splitbutton',
                        iconCls:'icons-view',
                        menu:[{							
                            iconCls:'icons-view',
                            text:'Icons view',
                            enableToggle:true,
                            pressed:true,
                            toggleGroup:'viewers',
                            handler: function(){
                                var a = _this.appViewer;
                                a.setActiveElement(0);
                            }
                        },{
                            iconCls:'details-view',
                            text:'Details view',
                            enableToggle:true,
                            toggleGroup:'viewers',
                            handler: function(){
                                var b = _this.appViewer;
                                b.setActiveElement(1);
                            }
                        }]
                    },{
                        iconCls:'icon-menuhelp'
                    }]/*[{
                        id: 'sortSelect',
                        xtype: 'combo',
                        typeAhead: true,
                        triggerAction: 'all',
                        width: 120,
                        editable: false,
                        mode: 'local',
                        displayField: 'desc',
                        valueField: 'name',
                        lazyInit: false,
                        value: 'name',
                        store: new Ext.data.ArrayStore({
                            fields: ['name', 'desc'],
                            data : [['name', 'Name'],['size', 'File Size'],['lastmod', 'Last Modified']]
                        }),
                        listeners: {
                            'select': {
                                fn:this.sortImages, 
                                scope:this
                            }
                        }
                    },'-',' ',' ', '-']*/,
                    items:[this.tree,this.appViewer]
                },{
                    region:'south',
                    height:70,
                    border:false,
                    layout:'form',
                    margins:'2 0 0 0',
                    padding:'5 10 5 10',
                    frame:true,						
                    items:[this.dialogBox,{
                        xtype:'combo',
                        id:'cmb_',
                        width:360,			    
                        fieldLabel:'File type'
                    }]
                }]
            });
				
            _this.obj = new Ext.Window({
                title: this.title,
                width:550,
                layout:'fit',
                resizable:false,
                modal: true,
                constrain:true,                
                items: [{
                    layout:'card',
                    border:false,
                    height:415,
                    activeItem:0,
                    items: this.panel,
                    tbar:this.toolBar
                }],
                buttons:[{
                    text:'Open',
                    handler:function(){
                        _this.path = _this.appViewer.getActiveItem().selectedItemId();
                        
                        _this.getPath();
                        
                        _this.obj.close();
                    }                  
                    
                },{
                    text:'Cancel',
                    handler:function(){
                        _this.obj.close();
                    }
                }]
            });
							
        }	
    },
    initTemplates:function(){
        this.thumbTemplate = new Ext.XTemplate(
            '<tpl for=".">',
            '<div class="thumb-wrap" id="{name}">',
            '<div class="thumb"><img src="{icon}" title="{name}"></div>',
            '<span>{shortName}</span></div>',
            '</tpl>'
            );
        this.thumbTemplate.compile();      
    },
    show:function(){
        var _this = MainWindow.prototype;
        _this.obj.show();
    },
    loadData:function(path){
        var _this = MainWindow.prototype;
        _this.store.load({
            params:{
                path: path
            }
        });
    },
    getPath:function(){
        var _this = MainWindow.prototype;
        std.FrontController.send({
            action: 'getProjectInfo',
            controller: 'ProjectManager',
            params:{ 'path':_this.path.split('.')[0]+'.' }
        });
    }
});