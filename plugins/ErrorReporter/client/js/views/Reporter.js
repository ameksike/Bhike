Kcl.Class('Reporter',
    {
        extend: FloattingPanel,
        behavior:{
            construct:function(params){
                this.parent.construct(params);
                this.store = new Ext.data.JsonStore({
                    url: /*"plugins/ErrorReporter/server/data.json",*/std.FrontController.getRequest("getNoifications", "ErrorReporter"),
                    root: 'info',
                    fields: [{
                        name:'TypeE', 
                        type: 'string'
                    },{
                        name:'Line',
                        type:'integer'
                    },{
                        name:'File',
                        type:'string'
                    },{
                        name:'Description', 
                        type:'string'
                    },{
                        name:'Date', 
                        type:'string'
                    }]
                });
                //this.store.on('load',_this.on_load_store,this);
                this.buildGUI();			
            },
            buildGUI:function(){
                var _this = Reporter.prototype;  
            
                this.gridSelectionModel = new Ext.grid.RowSelectionModel();
                this.gridView = new Ext.grid.GridView();         
                //
                //gridColumnModel
                //
                this.gridColumnModel = new Ext.grid.ColumnModel([new Ext.grid.RowNumberer({
                    header:'#'    
                }),{
                    id:'type', 
                    header:'Type', 
                    width:80, 
                    dataIndex:'TypeE'
                },{
                    id:'description', 
                    header:'Description', 
                    width:150, 
                    dataIndex:'Description'
                },{
                    id:'file', 
                    header:'File', 
                    width:100, 
                    dataIndex:'File'
                },{
                    id:'line', 
                    header:'Line', 
                    width:50, 
                    dataIndex:'Line'
                },{
                    id:'date', 
                    header:'Date', 
                    width:150, 
                    dataIndex:'Date'
                }]);
                //
                //gridSelectionModel
                //
                this.gridSelectionModel.singleSelect = true;            
                //
                //gridView
                //
                this.gridView.emptyText = '<div style="padding:10px; text-align:center; font-weight:bold;">No reports to show</div>';
                //
                //btn_all
                //
                this.btn_all = new Ext.Button();
                this.btn_all.width = 40;
                this.btn_all.setText("All");
                this.btn_all.pressed = true;
                //
                //btn_errors
                //
                this.btn_errors = new Ext.Button();
                this.btn_errors.setText("Errors");
                this.btn_errors.iconCls = 'remove-build-path';
                //
                //btn_warnings
                //
                this.btn_warnings = new Ext.Button();
                this.btn_warnings.setText("Warnings");
                //
                //btn_logs
                //
                this.btn_logs = new Ext.Button();
                this.btn_logs.setText("Logs");
                this.btn_logs.width = 40;
                //
                //toolBar
                //
                this.toolBar = new Ext.Toolbar();
                this.toolBar.defaults = {
                    enableToggle:true,
                    toggleGroup:'tg-reports'
                };
                this.toolBar.add(this.btn_all);
                this.toolBar.add('-');
                this.toolBar.add(this.btn_errors);
                this.toolBar.add(this.btn_warnings);
                this.toolBar.add(this.btn_logs);
                //
                //obj
                //
                this.obj = new Ext.grid.GridPanel({
                    tbar:this.toolBar,
                    title:'Balhh'
                });
                this.obj.setTitle("Reports");
                this.obj.store = this.store;
                this.obj.colModel = this.gridColumnModel;
                this.obj.selModel = this.gridSelectionModel;
                this.obj.autoExpandColumn = 'description';
                this.obj.autoScroll = true;
                this.obj.border = false;
                this.obj.setHeight('100%');
                this.obj.enableKeyEvents = true,
                this.obj.view = this.gridView;
            //this.store.load();           
            },        
            load : function (path){
                this.store.load({
                    params:{
                        path  : path
                    }
                });  
            }   
        }
    });
