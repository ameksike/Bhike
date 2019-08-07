Kcl.Class('ProjectManager.TemplatePanel', 
    {
        extend:CardItem,
        behavior:{
            construct: function(params){
                var _this = ProjectManager.TemplatePanel.prototype;                
            //this.buildGUI();
            },
            buildGUI:function(){
                var _this = ProjectManager.TemplatePanel.prototype;
            
                //Components declaration region
                this.defaultSelectionModel = new Ext.tree.DefaultSelectionModel();
                this.toolBar1 = new Ext.Toolbar();
                this.gridSelectionModel = new Ext.grid.RowSelectionModel();
                this.gridView = new Ext.grid.GridView();
                //
                //defaultSelectionModel
                //
                this.defaultSelectionModel.on('beforeselect',_this.on_beforeselect_defaultSelectionModel,this);
                //this.defaultSelectionModel.on('selectionchange',_this.on_selectionchange_defaultSelectionModel,this);
                //
                //rootNode
                //
                this.rootNode = new Ext.tree.AsyncTreeNode({
                    requesting:'category'                
                });
                this.rootNode.setText('Installed Templates');
                this.rootNode.attributes.type = 'templates';
                //this.rootNode.on('beforechildrenrendered',_this.tree_on_append,this);
                //
                //tree
                //
                this.tree = new Ext.tree.TreePanel({
                    margins:'2 2 0 2',
                    title:'Installed Templates'
                });
                this.tree.loader = _this.treeLoader;
                this.tree.rootVisible = false;
                this.tree.setRootNode(this.rootNode);
                this.tree.selModel = this.defaultSelectionModel;            
                this.tree.region = 'west';
                this.tree.setWidth(150);           
                this.tree.lines = false;
                this.tree.autoScroll = true;
                //this.tree.border = false;
                //this.tree.on('click',_this.on_click_tree,this);
                //this.tree.on('loaded',_this.tree_on_append,this);
                //this.tree.on('render',_this.on_beforerender_tree,this);
                //
                //treeSorter
                //
                this.treeSorter = new Ext.tree.TreeSorter(this.tree,{
                    dir:'asc',
                    folderSort:true/*,
                    sortType:function(node){
							return parseInt(node.attributes.SortOrder,10);
					}*/
                });
                //
                //store_version
                //
                this.store_version = new Ext.data.ArrayStore({
                    fields: ['version', 'name'],
                    data : [[0, 'ksike 1.1']]//,[1, 'ksike 2.0']
                });
                //
                //cmb_version
                //
                this.cmb_version = new Ext.form.ComboBox();
                this.cmb_version.setWidth(120);
                this.cmb_version.editable = false;
                this.cmb_version.mode = 'local';
                this.cmb_version.store = this.store_version;
                this.cmb_version.typeAhead = true;
                this.cmb_version.triggerAction = 'all';
                this.cmb_version.lazyInit = false;
                this.cmb_version.displayField = 'name';
                this.cmb_version.valueField = 'version';
                this.cmb_version.setValue(0);
                //
                //label1
                //
                this.label1 = new Ext.Button({
                    margins:'0 5 0 5'
                });
                this.label1.setText("Sort By:");
                //
                //store_sort
                //
                this.store_sort = new Ext.data.ArrayStore({
                    fields: ['name', 'desc'],
                    data : [['default', 'Default'],['type', 'Type']]
                });
                //
                //cmb_sortSelect
                //
                this.cmb_sortSelect = new Ext.form.ComboBox();
                this.cmb_sortSelect.typeAhead = true;
                this.cmb_sortSelect.triggerAction = 'all';
                this.cmb_sortSelect.setWidth(120);
                this.cmb_sortSelect.editable = false;
                this.cmb_sortSelect.mode = 'local';
                this.cmb_sortSelect.valueField = 'name';
                this.cmb_sortSelect.displayField = 'desc';
                this.cmb_sortSelect.lazyInit = false;
                this.cmb_sortSelect.store = this.store_sort;
                this.cmb_sortSelect.setValue("default");
                //this.cmb_sortSelect.on('select',_this.on_select_cmb_sortSelect);
                //
                //btn_iconView
                //
                this.btn_iconView = new Ext.Button();
                this.btn_iconView.iconCls = 'icons-view';
                this.btn_iconView.setTooltip("Icons View");
                this.btn_iconView.enableToggle = true;
                this.btn_iconView.pressed = true;
                this.btn_iconView.toggleGroup = 'viewers';
                this.btn_iconView.on('click',_this.on_click_btn_iconView,this);
                //
                //btn_detailView
                //
                this.btn_detailView = new Ext.Button();
                this.btn_detailView.iconCls = 'details-view';
                this.btn_detailView.setTooltip("Details View");
                this.btn_detailView.enableToggle = true;            
                this.btn_detailView.toggleGroup = 'viewers';
                this.btn_detailView.on('click',_this.on_click_btn_detailView,this);
                //
                //txt_filter
                //
                this.txt_filter = new Ext.form.TextField();
                this.txt_filter.id = "filter";
                this.txt_filter.emptyText = "Search Template";
                this.txt_filter.setWidth(120);
                this.txt_filter.cls = 'search-filter';
                this.txt_filter.enableKeyEvents = true;
                this.txt_filter.selectOnFocus = true;
                this.txt_filter.on('keyup',_this.on_keyup_txt_filter,this);
                //
                //toolBar1
                //
                this.toolBar1.add(this.cmb_version);
                this.toolBar1.add(this.label1);
                this.toolBar1.add(this.cmb_sortSelect);
                this.toolBar1.add('-');
                this.toolBar1.add(' ');
                this.toolBar1.add(this.btn_iconView);
                this.toolBar1.add(this.btn_detailView);
                this.toolBar1.add(' ');
                this.toolBar1.add('-');
                this.toolBar1.add(this.txt_filter);
                //
                //thumbTemplate
                //
                this.thumbTemplate = new Ext.XTemplate(
                    '<tpl for=".">',
                    '<div class="thumb-wrap" id="{TemplateID}">',
                    '<div class="thumb"><img src="{Icon}" title="{Name}"></div>',
                    '<span>{shortName}</span></div>',
                    '</tpl>'
                    );
                this.thumbTemplate.compile();
                //********************************************************************************//
                var formatData = function(data){
                    if(data.Name)
                        data.shortName = data.Name.ellipse(13);
                    //data.description = new Date(data.description).format("m/d/Y g:i a");
                    this.lookup[data.TemplateID] = data;
                    return data;
                };
                //
                //dataView
                //
                this.dataView = new Ext.DataView({id:'dataview'});
                this.dataView.tpl = this.thumbTemplate;
                this.dataView.singleSelect = true;
                this.dataView.autoScroll = true;
                this.dataView.overClass = 'x-view-over';
                this.dataView.itemSelector = 'div.thumb-wrap';
                this.dataView.emptyText = '<div style="padding:10px; text-align:center; font-weight:bold;">No templates available</div>';
                this.dataView.store = this.store;
                this.dataView.prepareData = formatData.createDelegate(this);
                this.dataView.selectedIndex = _this.selectedIndex_dataView;
                this.dataView.selectItem = _this.selectItem_dataView;
                this.dataView.selectedItemId = _this.selectedItemId_dataView;
                this.dataView.hasTarget = _this.hasTarget_dataView;
                this.dataView.on('selectionchange',_this.on_selectionchange_dataView,this);
                this.dataView.on('beforeselect',_this.on_beforeselect_dataView);            
                //
                //gridColumnModel
                //
                this.gridColumnModel = new Ext.grid.ColumnModel([{
                    id:'icon', 
                    header:'icon', 
                    width:50, 
                    dataIndex:'Icon', 
                    hidden:true
                },{
                    id:'name', 
                    header:'Name', 
                    width:100, 
                    dataIndex:'Name',
                    renderer:_this.renderer_gridColumn1
                },{
                    id:'type', 
                    header:'Type', 
                    width:100, 
                    dataIndex:'Type'
                }]);
                //
                //gridSelectionModel
                //
                this.gridSelectionModel.singleSelect = true;
                this.gridSelectionModel.on('selectionchange',_this.on_selectionchange_gridSelectionModel.createDelegate(this));
                //
                //gridView
                //
                this.gridView.emptyText = '<div style="padding:10px; text-align:center; font-weight:bold;">No templates available</div>';
                //
                //gridPanel
                //
                this.gridPanel = new Ext.grid.GridPanel();
                this.gridPanel.store = this.store;
                this.gridPanel.colModel = this.gridColumnModel;
                this.gridPanel.selModel = this.gridSelectionModel;
                this.gridPanel.autoExpandColumn = 'name';
                this.gridPanel.autoScroll = true;
                this.gridPanel.border = false;
                this.gridPanel.setHeight('100%');
                this.gridPanel.enableKeyEvents = true,
                this.gridPanel.view = this.gridView;
                this.gridPanel.selectedIndex = _this.selectedIndex_gridPanel;
                this.gridPanel.selectItem = _this.selectItem_gridPanel;
                this.gridPanel.selectedItemId = _this.selectedItemId_gridPanel;
                this.gridPanel.hasTarget = _this.hasTarget_gridPanel;
                //
                //templatesViewer
                //
                this.templatesViewer = new Ext.Panel({
                    margins:'2 0 0 0',
                    defaults:{
                        border:false
                    }
                });
                this.templatesViewer.activeItem = 0;
                this.templatesViewer.region = 'center';
                this.templatesViewer.layout = 'card';
                this.templatesViewer.add(this.dataView);
                this.templatesViewer.add(this.gridPanel);
                this.templatesViewer.getActiveItem = _this.getActiveItem_templatesViewer.createDelegate(this);
                this.templatesViewer.setActiveElement = _this.setActiveElement_templatesViewer;
                //
                //detailsTemplate
                //
                this.detailsTemplate = new Ext.XTemplate(
                    '<div class="details">',
                    '<tpl for=".">',
                    '<img src="{Icon}"><div class="details-info">',
                    '<b>Type:</b>',
                    '<span>{Type}</span>',
                    '<b>Description:</b>',
                    '<span>{Description}</span></div>',
                    '</tpl>',
                    '</div>'
                    );
                this.detailsTemplate.compile();
                //
                //detailsPanel
                //
                var i = 0;
                this.detailsPanel = new Ext.Panel({
                    margins:'2 2 0 2'
                });
                this.detailsPanel.id = "detailsPanel";
                this.detailsPanel.region = 'east';
                this.detailsPanel.tpl = this.detailsTemplate;
                this.detailsPanel.emptyText = '<div style="padding:10px; text-align:center; font-weight:bold;">No description available</div>';
                this.detailsPanel.setWidth(190);
                //
                //viewer
                //
                this.viewer = new Ext.Panel({
                    tbar:this.toolBar1
                });
                this.viewer.region = 'center';
                this.viewer.layout = 'border';
                this.viewer.border = false;
                this.viewer.add(this.templatesViewer);
                this.viewer.add(this.detailsPanel);
                this.viewer.on('beforerender',_this.viewer_onbeforerender,this);
                //
                //txt_name
                //
                this.txt_name = new Ext.form.TextField();
                this.txt_name.id = 'txt_name';
                this.txt_name.setWidth(320);
                this.txt_name.emptyText = "<Enter_name>";
                this.txt_name.vtype = 'classname';
                this.txt_name.enableKeyEvents = true;
                this.txt_name.alloBlank = false;
                this.txt_name.fieldLabel = "Name";
                this.txt_name.changeValue = _this.changeValue_txt_name.createDelegate(this);
                //this.txt_name.on('keyup',_this.on_keyup_txt_name,this);
                //
                //txt_projectPath
                //
                this.txt_projectPath = new Ext.form.TextField();
                this.txt_projectPath.fieldLabel = "Location";
                this.txt_projectPath.setWidth(320);
                this.txt_projectPath.editable = false;
                //this.txt_projectPath.on('change',_this.txt_projectPath_onchange,this);
                //
                //btn_browsePath
                //
                this.btn_browsePath = new Ext.Button();
                this.btn_browsePath.text = "Browse...";
                //this.btn_browsePath.on('click',_this.on_click_btn_browsePath,this);
                //
                //formOpenFile
                //
                this.formOpenFile = new Ext.Panel();
                this.formOpenFile.layout = 'form';
                this.formOpenFile.add(this.txt_projectPath);            
                //
                //pnl_openFile
                //
                this.pnl_openFile = new Ext.Panel();
                this.pnl_openFile.layout = 'hbox';
                this.pnl_openFile.add(this.formOpenFile);
                this.pnl_openFile.add(this.btn_browsePath);
				//
				//idenfitierVTYPE
				//
                Ext.form.VTypes.classnameText = "Not a identifier value.";
                Ext.form.VTypes.classnameMask = /[a-z0-9_.]/i;
                Ext.form.VTypes.classname = function(val, field) {
					return /[a-z0-9_]/i.test(val);
				}
                //
                //txt_projectName
                //
                this.txt_projectName = new Ext.form.TextField();
                this.txt_projectName.fieldLabel = "Project Name";
                this.txt_projectName.emptyText = "<Enter_name>";
                this.txt_projectName.vtype = 'classname';
                this.txt_projectName.allowBlank = false;
                this.txt_projectName.setWidth(320);
                this.txt_projectName.enableKeyEvents = true;
                this.txt_projectName.changeable = true;
                //this.txt_projectName.on('keyup',_this.on_keyup_txt_projectName,this);
                //
                //chbx_solutionFolder
                //
                this.chbx_solutionFolder = new Ext.form.Checkbox();
                this.chbx_solutionFolder.align = 'right';
                this.chbx_solutionFolder.boxLabel = "Multi-Project";
                this.chbx_solutionFolder.checked = true;
                //
                //form
                //
                this.form = new Ext.form.FormPanel({
                    margins:'2 2 2 2',
                    padding:'5 10 5 10'
                });
                this.form.region = 'south';
                this.form.setHeight(45);
                this.form.frame = true,
                this.form.border = false;
                this.form.add(this.txt_name);
                //this.form.add(this.txt_projectName);
                //this.form.add(this.chbx_solutionFolder);
                ///
                ///selector
                ///
                this.selector = new Ext.Panel({
                    margins:'2 2 2 2'
                });
                this.selector.setHeight(400);
                this.selector.layout = 'border';
                this.selector.border = false;
                this.selector.add(this.tree);
                this.selector.add(this.viewer);
                this.selector.add(this.form);
                ///
				///btn_add
				///
				this.btn_add = new Ext.Button();
				this.btn_add.setText("Add");
				this.btn_add.on('click',_this.btn_add_on_click,this);//_this.cardManager.prevCard();
				///
				///btn_cancel
				///
				this.btn_cancel = new Ext.Button();
				this.btn_cancel.setText("Cancel");
				this.btn_cancel.on('click',_this.btn_cancel_on_click,this);            
                ///
				///obj
				///
				this.obj = new Ext.Window({
					keys: [{
						key: 27, // Esc key
						handler: function(){
							this.obj.close();
						},
						scope: this
					},{
						key: 13, // Enter key
						//handler: _this.btn_finish_click,
						scope: this
					}]
				});
				this.obj.setTitle("Add New Item - "+this.title);
				this.obj.setWidth(650);
				this.obj.resizable = false;
				this.obj.modal = true;
				this.obj.constrain = true;
				this.obj.iconCls = 'icon-new-item';
				this.obj.add(this.selector);
				//this.obj.addButton(this.btn_back);
				//this.obj.addButton(this.btn_next);
				this.obj.addButton(this.btn_add);
				this.obj.addButton(this.btn_cancel);
				this.obj.on('resize',function(){this.doLayout(true,true);});
            }
        }
    });
