Kcl.Class('StartPage', 
{
    property:{
        //components fields
        obj:null,
        gridPanel:null,
        store:null
    },
    behavior:{        
        buildGUI:function(){
            var _this = StartPage.prototype;
            this.store = new Ext.data.JsonStore({
                url:'app/client/html/startpage-data.json',
                //autoLoad:true,
                root:'data',
                fields: ['title','content']
            });
            this.store.on('load',_this.store_onload,this);
            
            this.gridStore = new Ext.data.JsonStore({
                fields: ['image',{
                    name:'topic', 
                    type: 'string'
                },{
                    name:'links',
                    type:'string'
                },{
                    name:'description', 
                    type:'string'
                }]
            });            
            this.gridStore.on('load',_this.gridStore_onload,this);
            this.northRegion = new Ext.Panel({
                region:'north',
                bodyCssClass:'start-page-header',
                height:95,
                margins:" 0 0 0 2"
            });
            this.actionsSection = new Ext.tree.TreePanel({
                border:false,
                region:'north',		    
                height:45,
                lines:false,
                selModel:new Ext.tree.DefaultSelectionModel({
					listeners:{'beforeselect':function(){return false;}}
				}),
                rootVisible:false,
                root: {
                    text: 'root',
                    children:[]
                },
                addItem:function(item){                    
                    var node = new Ext.tree.TreeNode({
                        //text:item.text,
                        leaf:true//,
                        //iconCls:item.iconCls
                    });
                    for(var i in item){
                        //if(node.attributes[i]!= null)
                            node.attributes[i]=item[i];
                        //else
                            node[i] = item[i];                           
                    }
                    node.on('click',item.handler);
                    this.root.appendChild(node);
                }
            });
            this.westCenterRegion = new Ext.Panel({
				border:false,
				height:'100%',
				region:'center',
				items:[{
					xtype:'fieldset',
					border:false,
					layout:'fit',
					text:'Actions:',
					items:this.actionsSection
				}]
			});
            this.westRegion = new Ext.Panel({
                region:'west',
                frame:false,
                margins:'0 2 2 2',
                width:250,
                layout:'border',
                defaults:{
                //frame:false,
                //border:false
                },
                items:[this.westCenterRegion,{
					align:'bottom',
                    region:'south',                    
                    padding:'5',
                    height:60,
                    frame:true,
                    border:false,
                    items:[{
                            xtype:'checkbox',
                            boxLabel:'Close page after project load',
                            checked : std.mod.Main.settings.startpage.closeOnProjectLoad
                            
                    },{
                            xtype:'checkbox',
                            boxLabel:'Show page on startup',
                            checked : std.mod.Main.settings.startpage.showOnStartup
                    }]
                }]
            });
            //
            //gridColumnModel
            //
            this.gridColumnModel = new Ext.grid.ColumnModel([{
                id:'icon', 
                header:'icon',
                dataIndex:'image', 
                renderer:{fn:_this.iconColumn_renderer,scope:this}
            },{
                id:'name', 
                //hidden:true,
                header:'name', 
                //renderer:{fn:_this.iconColumn_renderer,scope:this},
                //width:100, 
                dataIndex:'topic'
            }]);                       	
            //
            //gridView
            //
            this.gridView = new Ext.grid.GridView();
            this.gridView.emptyText = '<div style="padding:10px; text-align:center; font-weight:bold;">No templates available</div>';
            
            /*this.gridPanel.selectedIndex = _this.selectedIndex_gridPanel;
            this.gridPanel.selectItem = _this.selectItem_gridPanel;
            this.gridPanel.selectedItemId = _this.selectedItemId_gridPanel;
            this.gridPanel.hasTarget = _this.hasTarget_gridPanel;	*/    
			
			///
			///btn_startpage
			///
			this.btn_startpage = new Ext.Button();
			this.btn_startpage.setText("SP");
			this.btn_startpage.setTooltip("Show Start Page");
			this.btn_startpage.on('click',_this.btn_startpage_onclick,this);
			///
            this.centerRegion = new Ext.TabPanel({
                region:'center',
                activeTab:0,
                items:[],
                border:false
            //tabPosition:'bottom'
            });
            ///
            ///obj
            ///	
            this.obj = new Ext.Panel();
            this.obj.layout  = 'border';
            this.obj.setTitle("Start Page");
            this.obj.closable = true;           
            this.obj.on('beforerender',_this.obj_beforerender,this);
			this.obj.on('beforeclose',_this.obj_onbeforeclose,this);
            
            this.obj.add(this.centerRegion);
            this.obj.add(this.northRegion);		
            this.obj.add(this.westRegion);
        }
    }
});
