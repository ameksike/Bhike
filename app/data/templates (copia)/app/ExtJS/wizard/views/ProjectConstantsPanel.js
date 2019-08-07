/*
 * @application: BHike
 * @version: 0.1
 * @package: alpha
 * 
 * @description: ProjectConstantsPanel is a class that implements...
 * @authors: Nosinc
 * @created: 14-oct-2011 2:39:33
 * @license: GPL v3
 **/

Kcl.Class( 'ProjectConstantsPanel', 
{
    property:{
        obj:null
    },
    behavior:{
        construct: function(params){
            var _this = ProjectConstantsPanel.prototype;
            this.lookup = {};
            _this.store = new Ext.data.GroupingStore({
                reader: new Ext.data.ArrayReader({}, ['name','value','category','description']),
                sortInfo:{field: 'name', direction: "ASC"},
                groupField:'category'                
            });
            //this.store.on('load',_this.on_load_store);
        },
        buildGUI:function(){
            var _this = ProjectConstantsPanel.prototype;
            
            this.gridSelectionModel = new Ext.grid.RowSelectionModel();
            this.gridView = new Ext.grid.GroupingView();            
            //
            //gridColumnModel
            //
            this.gridColumnModel = new Ext.grid.ColumnModel([{
                id:'name', 
                header:'Name', 
                width:50, 
                dataIndex:'name'
            },{
                id:'value', 
                header:'Value', 
                width:100, 
                dataIndex:'value'
            },{
                id:'category', 
                header:'Category',
                hidden:true,
                width:30, 
                dataIndex:'category'
            }]);
            //
            //gridSelectionModel
            //
            this.gridSelectionModel.singleSelect = true;
            this.gridSelectionModel.on('rowselect',_this.on_rowselect_gridSelectionModel.createDelegate(this));
            //
            //gridView
            //
            this.gridView.emptyText = '<div style="padding:10px; text-align:center; font-weight:bold;">No templates available</div>';
            this.gridView.forceFit = true;
            this.gridView.groupTextTpl = '{text}({[values.rs.length]} {[values.rs.length > 1 ? "Items" : "Item"]})';
            //
            //gridPanel
            //
            _this.gridPanel = new Ext.grid.EditorGridPanel({
                tbar:this.toolBar,
                margins:'2 2 2 2'
            });
            this.gridPanel.clicksToEdit = 1;
            this.gridPanel.region = 'center';
            this.gridPanel.store = this.store;
            this.gridPanel.colModel = this.gridColumnModel;
            this.gridPanel.selModel = this.gridSelectionModel;
            this.gridPanel.autoExpandColumn = 'value';
            this.gridPanel.autoScroll = true;
            this.gridPanel.columnLines = true;
            this.gridPanel.enableHdMenu = false;
            this.gridPanel.border = true;
            this.gridPanel.setHeight('100%');
            this.gridPanel.enableKeyEvents = true,
            this.gridPanel.view = this.gridView;
           /* this.gridPanel.selectedIndex = _this.selectedIndex_gridPanel;
            this.gridPanel.selectItem = _this.selectItem_gridPanel;
            this.gridPanel.selectedItemId = _this.selectedItemId_gridPanel;*/
            this.gridPanel.on('aftershow',_this.on_load_store);
            //
            //template
            //
            this.template = new Ext.XTemplate(
                '<div class="config-details">',
                '<tpl for="."><div class="config-details-info">',
                '<b>Constant:</b>',
                '<span>{name}</span>',
                '<b>Description:</b>',
                '<span>{description}</span></div>',
                '</tpl>',
                '</div>'
            );
            this.template.compile();
            //
            //detailsPanel
            //
            this.detailsPanel = new Ext.Panel({
                title:'Details',
                margins:'2 2 2 0'
            });
            this.detailsPanel.tpl = this.template;
            this.detailsPanel.region = 'east';
            this.detailsPanel.setWidth(250);            
            //
            //obj
            //
            this.obj = new Ext.Panel({
                title:'Constants'
            });
            this.obj.layout = 'border';
            this.obj.add(this.gridPanel);
            this.obj.add(this.detailsPanel);
            this.obj.on('resize',_this.on_resize_obj);
        }	
    }	
});