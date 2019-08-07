Kcl.Class( 'ComponentSelector', 
{
    property:{
        project:null,
        manager:null
    },
    behavior:{
        construct: function(manager){},
        buildGUI:function(){
            var _this = ComponentSelector.prototype;          
			
            this.templateSelectionPanel.buildGUI();
            //this.projectConfigurationPanel.buildGUI();
            //this.projectVariablesManager.buildGUI();      
            //this.dependenciesManagerPanel.buildGUI();
            //this.projectConstantsPanel.buildGUI();
            
///////////////////////////////******************************************//////////////////
            this.tabPanel = new Ext.TabPanel();            
            this.tabPanel.setHeight(400);
            this.tabPanel.frame = true;
            this.tabPanel.border = false;
            this.tabPanel.activeTab = 0;             
            //this.tabPanel.add(this.dependenciesManagerPanel.obj);
            //this.tabPanel.add(this.projectConfigurationPanel.obj);
            //this.tabPanel.add(this.projectConstantsPanel.obj);
			//
            //wizard
            //
            this.wizard = new BWizard();
            this.wizard.buildGUI();
            this.wizard.add(this.templateSelectionPanel.obj);           
            //
            //btn_back
            //            
            this.wizard.btn_back.on('click',_this.on_click_btn_back,this);//_this.wizard.prevCard();
            //
            //btn_next
            //            
            this.wizard.btn_next.on('click',_this.on_click_btn_next,this);//_this.wizard.prevCard();
            //
            //btn_finish
            //
            this.btn_finish = new Ext.Button();
            this.btn_finish.setText("Finish");
            this.btn_finish.on('click',_this.on_click_btn_finish,this);//_this.wizard.prevCard();
            //
            //btn_cancel
            //
            this.btn_cancel = new Ext.Button();
            this.btn_cancel.setText("Cancel");
            this.btn_cancel.on('click',_this.on_click_btn_cancel,this);//_this.wizard.prevCard();
            //
            //obj
            //
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
            this.obj.setTitle("New Project");
            this.obj.setWidth(650);
            this.obj.resizable = false;
            this.obj.modal = true;
            this.obj.constrain = true;
            this.obj.iconCls = 'icon-new-project';
            this.obj.add(this.wizard.obj);
            this.obj.addButton(this.wizard.btn_back);
            this.obj.addButton(this.wizard.btn_next);
            this.obj.addButton(this.btn_finish);
            this.obj.addButton(this.btn_cancel);
            this.obj.on('resize',function(){this.doLayout(true,true);});
        }	
    }	
});
