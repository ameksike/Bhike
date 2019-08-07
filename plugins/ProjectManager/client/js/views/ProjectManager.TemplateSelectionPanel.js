Kcl.Class('ProjectManager.TemplateSelectionPanel',
{
	behavior: {
		buildGUI : function(params) {
			var _this = ProjectManager.TemplateSelectionPanel.prototype;			
			///
			///defaultSelectionModel
			///
			this.defaultSelectionModel = new Ext.tree.DefaultSelectionModel();
			this.defaultSelectionModel.on('beforeselect',_this.defaultSelectionModel_onbeforeselect,this);
			this.defaultSelectionModel.on('selectionchange',_this.defaultSelectionModel_onselectionchange,this);
			///
			///tree_installedTemplatesRoot
			///
			this.tree_installedTemplatesRoot = new Ext.tree.TreeNode();
			///
			///tree_installedTemplates
			///
			this.tree_installedTemplates = new Ext.tree.TreePanel({				
				singleExpand:true,
				title:'Installed Templates'
			});
			this.tree_installedTemplates.border = false;
			this.tree_installedTemplates.rootVisible = false;
			this.tree_installedTemplates.setRootNode(this.tree_installedTemplatesRoot);
			this.tree_installedTemplates.selModel = this.defaultSelectionModel;
			this.tree_installedTemplates.setWidth(150);            
			this.tree_installedTemplates.useArrows = true;            
			this.tree_installedTemplates.lines = false;
			this.tree_installedTemplates.autoScroll = true;
			this.tree_installedTemplates.on('load',_this.tree_onload,this);
			this.tree_installedTemplates.on('expandnode',_this.tree_onexpandnode,this);
			///
			///treeSorter
			///
			this.treeSorter = new Ext.tree.TreeSorter(this.tree_installedTemplates,{
				dir:'asc', folderSort:true, property:'text'
			});
			///
			///accordion_categories
			///
			this.accordion_categories = new Ext.Panel({margins:'2 2 0 2',layoutConfig:{titleCollapse:true,hideCollapseTool:true}});
			this.accordion_categories.layout = 'accordion';
			this.accordion_categories.activeItem = 0;
			this.accordion_categories.region = 'west';			
			this.accordion_categories.setWidth(168);
			this.accordion_categories.add(this.tree_installedTemplates);
			///
			///label1
			///
			this.label1 = new Ext.form.Label({ style: { margin: '0px 5px' }});
			this.label1.hidden = true;
			this.label1.setText("Framework:");
			///
			///cmb_version
			///
			this.cmb_version = new Ext.form.ComboBox();
			this.cmb_version.hidden = true;
			this.cmb_version.setWidth(98);
			this.cmb_version.editable = false;
			this.cmb_version.mode = 'local';
			this.cmb_version.store = this.cmb_versionStore;
			this.cmb_version.typeAhead = true;
			this.cmb_version.triggerAction = 'all';
			this.cmb_version.lazyInit = false;
			this.cmb_version.displayField = 'alias';
			this.cmb_version.valueField = 'version';
			this.cmb_version.on('beforeselect',_this.cmb_version_onbeforeselect,this);
			///
			///label2
			///
			this.label2 = new Ext.form.Label({ style: { margin: '0px 5px' }});
			this.label2.setText("Sort By:");
			///
			///cmb_sortSelect
			///
			this.cmb_sortSelect = new Ext.form.ComboBox();
			this.cmb_sortSelect.typeAhead = true;
			this.cmb_sortSelect.triggerAction = 'all';
			this.cmb_sortSelect.setWidth(80);
			this.cmb_sortSelect.editable = false;
			this.cmb_sortSelect.mode = 'local';
			this.cmb_sortSelect.valueField = 'name';
			this.cmb_sortSelect.displayField = 'desc';
			this.cmb_sortSelect.lazyInit = false;
			this.cmb_sortSelect.store = this.cmb_sortSelectStore;
			this.cmb_sortSelect.setValue("sortorder");
			this.cmb_sortSelect.on('select',_this.cmb_sortSelect_onselect,this);
			///
			///btn_views
			///
			this.btn_views = new Ext.Button();
			this.btn_views.iconCls = 'details-view';
			this.btn_views.setTooltip("Details View");			
			this.btn_views.enableToggle = true;
			this.btn_views.on('toggle',_this.btn_views_ontoggle,this);
			///
			///txt_filter
			///
			this.txt_filter = new Ext.form.TextField();
			this.txt_filter.id = "filter";
			this.txt_filter.emptyText = "Search Template";
			this.txt_filter.setWidth(120);
			this.txt_filter.cls = 'search-filter';
			this.txt_filter.enableKeyEvents = true;
			this.txt_filter.selectOnFocus = true;
			this.txt_filter.on('keyup',_this.txt_filter_onkeyup,this);
			this.txt_filter.on('blur',_this.txt_filter_onblur,this);
			///
			///toolBar1
			///
			this.toolBar1 = new Ext.Toolbar();
			this.toolBar1.add('->');
			this.toolBar1.add(this.label1);
			this.toolBar1.add(this.cmb_version);
			this.toolBar1.add(this.label2);
			this.toolBar1.add(this.cmb_sortSelect);
			this.toolBar1.add('-');
			this.toolBar1.add(' ');
			this.toolBar1.add(this.btn_views);
			this.toolBar1.add(' ');
			this.toolBar1.add('-');
			this.toolBar1.add(this.txt_filter);
			///
			///thumbTemplate
			///
			this.thumbTemplate = new Ext.XTemplate(
				'<tpl for=".">',
				'<div class="thumb-wrap" id="{name}">',
				'<div class="thumb"><img src="{icon}" title="{name}"/></div>',
				'<span>{shortName}</span></div>',
				'</tpl>'
			);
			this.thumbTemplate.compile();
			///
			///dataView
			///
			this.dataView = new Ext.DataView({ cls:'icons-viewer' });
			this.dataView.tpl = this.thumbTemplate;
			this.dataView.singleSelect = true;
			this.dataView.autoScroll = true;
			this.dataView.overClass = 'x-view-over';
			this.dataView.itemSelector = 'div.thumb-wrap';
			this.dataView.emptyText = '<div style="padding:10px; text-align:center; font-weight:bold;">No templates available</div>';
			this.dataView.store = this.store;
			this.dataView.prepareData = _this.formatData.createDelegate(this);
			this.dataView.selectedIndex = _this.dataView_selectedIndex;
			this.dataView.selectItem = _this.dataView_selectItem;
			this.dataView.selectedItemId = _this.dataView_selectedItemId;
			this.dataView.hasTarget = _this.dataView_hasTarget;
			this.dataView.on('selectionchange',_this.dataView_onselectionchange,this);
			this.dataView.on('beforeselect',_this.dataView_onbeforeselect,this);
			this.dataView.on('containerclick',_this.dataView_oncontainerclick,this);
			///
			///col_name
			///
			this.col_name = new Ext.grid.Column();
			this.col_name.header = "Name";
			this.col_name.dataIndex = 'name';
			this.col_name.width = 80;
			this.col_name.renderer = _this.col_name_renderer;
			///
			///col_projecttype
			///
			this.col_projecttype = new Ext.grid.Column();
			this.col_projecttype.header = "Type";
			this.col_projecttype.id = 'type';
			this.col_projecttype.dataIndex = 'projecttype';
			///
			///gridColumnModel
			///
			this.gridColumns = new Array();
			this.gridColumns.push(this.col_name);
			this.gridColumns.push(this.col_projecttype);
			this.gridColumnModel = new Ext.grid.ColumnModel(this.gridColumns);			
			///
			///gridSelectionModel
			///
			this.gridSelectionModel = new Ext.grid.RowSelectionModel();
			this.gridSelectionModel.singleSelect = true;
			this.gridSelectionModel.on('selectionchange',_this.gridSelectionModel_onselectionchange,this);
			///
			///gridView
			///
			this.gridView = new Ext.grid.GridView();
			this.gridView.emptyText = '<div style="padding:10px; text-align:center; font-weight:bold;">No templates available</div>';
			///
			///gridPanel
			///
			this.gridPanel = new Ext.grid.GridPanel();
			this.gridPanel.store = this.store;
			this.gridPanel.colModel = this.gridColumnModel;
			this.gridPanel.selModel = this.gridSelectionModel;
			this.gridPanel.autoExpandColumn = 'type';
			this.gridPanel.autoScroll = true;
			this.gridPanel.border = false;
			this.gridPanel.setHeight('100%');
			this.gridPanel.enableKeyEvents = true,
			this.gridPanel.view = this.gridView;
			this.gridPanel.selectedIndex = _this.gridPanel_selectedIndex;
			this.gridPanel.selectItem = _this.gridPanel_selectItem;
			this.gridPanel.selectedItemId = _this.gridPanel_selectedItemId;
			this.gridPanel.hasTarget = _this.gridPanel_hasTarget;
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
			this.templatesViewer.setActiveElement = _this.templatesViewer_setActiveElement;
			///
			///detailsTemplate
			///
			this.detailsTemplate = new Ext.XTemplate(
				'<div class="details">',
				'<tpl for=".">',
				'<b class="image-label">Preview Image:</b>',
				'<img src="{previewimage}" title="{name} preview."/>',				
				'<div class="details-info">',
				'<b>Name:</b>',
				'<span>{name}</span>',
				'<b>Type:</b>',
				'<span>{projecttype}</span>',
				'<b>Description:</b>',
				'<span>{description}</span></div>',
				'</tpl>',
				'</div>'
			);
			this.detailsTemplate.compile();
			///
			///detailsPanel
			///
			this.detailsPanel = new Ext.Panel({ margins:'2 2 0 2' });
			this.detailsPanel.autoScroll = true;
			this.detailsPanel.id = "detailsPanel";
			this.detailsPanel.region = 'east';
			this.detailsPanel.tpl = this.detailsTemplate;
			this.detailsPanel.emptyText = '<div style="padding:10px; text-align:center; font-weight:bold;">No description available</div>';
			this.detailsPanel.setWidth(190);
			///
			///viewer
			///
			this.viewer = new Ext.Panel({
				tbar:this.toolBar1
			});
			this.viewer.region = 'center';
			this.viewer.layout = 'border';
			this.viewer.border = false;
			this.viewer.add(this.templatesViewer);
			this.viewer.add(this.detailsPanel);
			///
			///txt_itemName
			///
			this.txt_itemName = new Ext.form.TextField();
			this.txt_itemName.id = 'txt_itemName';
			this.txt_itemName.setWidth(320);
			this.txt_itemName.emptyText = "<Enter_name>";
			this.txt_itemName.enableKeyEvents = true;
			this.txt_itemName.vtype = 'alphanum';
			this.txt_itemName.alloBlank = false;
			this.txt_itemName.fieldLabel = "Name";
			this.txt_itemName.on('keyup',_this.txt_itemName_onkeyup,this);
			///
			///txt_itemLocation
			///
			this.txt_itemLocation = new Ext.form.TextField();
			this.txt_itemLocation.fieldLabel = "Location";
			this.txt_itemLocation.allowBlank = false;
			this.txt_itemLocation.setWidth(320);
			this.txt_itemLocation.editable = false;
			this.txt_itemLocation.changeValue = _this.txt_itemLocation_changeValue;
			this.txt_itemLocation.on('change',_this.txt_itemLocation_onchange,this);
			//
			//btn_locationBrowse
			//
			this.btn_locationBrowse = new Ext.Button();
			this.btn_locationBrowse.text = "Browse...";
			this.btn_locationBrowse.on('click',_this.btn_locationBrowse_onclick,this);
			//
			//formOpenFile
			//
			this.formOpenFile = new Ext.Panel();
			this.formOpenFile.layout = 'form';
			this.formOpenFile.add(this.txt_itemLocation);            
			//
			//pnl_openFile
			//
			this.pnl_openFile = new Ext.Panel();
			this.pnl_openFile.layout = 'hbox';
			this.pnl_openFile.add(this.formOpenFile);
			this.pnl_openFile.add(this.btn_locationBrowse);
			///
			///txt_projectName
			///
			this.txt_projectName = new Ext.form.TextField();
			this.txt_projectName.fieldLabel = "Project Name";
			this.txt_projectName.emptyText = "<Enter_name>";
			this.txt_projectName.vtype = 'alphanum';
			this.txt_projectName.allowBlank = false;
			this.txt_projectName.setWidth(320);
			this.txt_projectName.enableKeyEvents = true;
			this.txt_projectName.changeable = true;
			//this.txt_projectName.on('keyup',_this.on_keyup_txt_projectName,this);
			///
			///chbx_solutionFolder
			///
			this.chbx_solutionFolder = new Ext.form.Checkbox();
			this.chbx_solutionFolder.align = 'right';
			this.chbx_solutionFolder.boxLabel = "Multi-Project";
			this.chbx_solutionFolder.checked = true;
			///
			///form
			///
			this.form = new Ext.form.FormPanel({
				margins:'2 2 2 2',
				padding:'5 10 5 10'
			});
			this.form.region = 'south';
			this.form.monitorValid = true;
			this.form.setHeight(70);
			this.form.frame = true,
			this.form.border = false;
			this.form.add(this.txt_itemName);
			this.form.add(this.pnl_openFile);
			//this.form.add(this.txt_projectName);
			this.form.add(this.chbx_solutionFolder);
			///
			///obj
			///
			this.obj = new Ext.Panel({ margins:'2 2 2 2'});
			this.obj.setHeight(400);
			this.obj.layout = 'border';
			this.obj.border = false;
			this.obj.add(this.accordion_categories);
			this.obj.add(this.viewer);
			this.obj.add(this.form);
			this.obj.on('beforerender',_this.obj_onbeforerender,this);
		}
	}
});
