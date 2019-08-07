/**
 * @Namespace:
 * @Class: DevStruct
 * @Description: 
 * @Authors: Nosinc
 * @Making Date: 22/12/2010
 * @Update Date: 22/12/2010
 *
 * @package: BHike
 * @subpackage: client
 * @version: 0.1 alpha
 *
 */

Kcl.Class('ProjectManagerGUI', 
{	
    behavior:{
        construct: function(params){
            this.buildGUI();
            
            return this.gui;
        },
        buildGUI:function(params){
			this.gui = params.gui;
                        
            this.gui.menuBar.addItem({//--- Nuevo
                text:'Project',
                iconCls:'icon-new-project',
                //handler:{fn:this.newProject,scope:this}
            }, "mnew");

            this.gui.menuBar.addItem({//--- Abrir
                text:'Project',
                iconCls:'icon-open-project',
                //handler:{ fn: _this.openProject, scope:this}
            }, "mopen");
                        
            this.gui.menuBar.addItem({//--- Abrir
                text:'Project',
                checked:true
            }, "mview-toolbars");

            this.gui.menuBar.addItem({//--- Menu Proyecto
                text:'Project',
                menu:[{
                    text:'Property'
                },{
                    text:'Make Module'
                },{
                    text:'Export Template',
                    disabled:true
                }]
            });
            
            ////////// IN START PAGE
            /*this.node_CreateProject = new Ext.tree.TreeNode();
            this.node_CreateProject.setText("New Project");
            this.node_CreateProject.setIconCls('icon-new-project');
            this.node_CreateProject.on('click',_this.newProject,this);
            this.gui.startPage.actionsSection.addItem(this.node_CreateProject);*/
            
            this.gui.startPage.actionsSection.addItem({//--- Abrir
                text:'Open Project',
                iconCls:'icon-open-project',
                //handler:{fn:_this.openProject,scope:this}
            });
            ///////// Project Explorer Section
            _this.projectExplorer = new ProjectExplorer();
            
            this.gui.toolBar.addItem({
                text:'PE',
                tooltip:'Project Explorer',
                enableToogle:true,
                toogle:true,
                handler: function(){
                    _this.projectExplorer.show();
                }
            },"tbapp-starts-on");
            this.gui.east.addItem({
                layout:'border',
                frame:false,
                defaults:{
                    frame:false,
                    split:true
                },
                items:[_this.projectExplorer.obj,_this.projectExplorer.propertiesPanel.obj]
            });
            ///////// Project Explorer Section ends here
         
            
            //--- Barra de Proyecto
            //
            //btn_newProject
            //            
            this.btn_newProject = new Ext.Button();
            this.btn_newProject.iconCls = 'icon-new-project';
            this.btn_newProject.setTooltip("New Project");
            this.btn_newProject.on('click',_this.newProject,this);
            //
            //btn_openProject
            //
            this.btn_openProject = new Ext.SplitButton();
            this.btn_openProject.setText("OP");
            this.btn_openProject.setTooltip("Open Project");
            this.btn_openProject.on('click',_this.openProject,this);
            //
            //btng_projectManager
            //
            this.btng_projectManager = new Ext.ButtonGroup();
            this.btng_projectManager.add(this.btn_newProject);
            this.btng_projectManager.add(this.btn_openProject);
            
            this.gui.toolBar.insertItem(this.btng_projectManager,0);
		}
    }
});

