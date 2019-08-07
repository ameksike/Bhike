Kcl.Class( 'ComponentSelector', 
{
	extend:ComponentSelector,
    property:{
        project:null,
        manager:null
    },
    behavior:{
		construct:function(manager){
			this.manager = manager;
            this.project = new Project();
            
            this.templateSelectionPanel = new TemplateSelectionPanel(this);
            //this.projectConfigurationPanel = new ProjectConfigurationPanel(this);
            //this.projectVariablesManager = new ProjectVariablesManager(this);
            //this.dependenciesManagerPanel = new DependenciesManagerPanel(this);           
            //this.projectConstantsPanel = new ProjectConstantsPanel(this);
		},
		on_click_btn_finish : function(){
			this.manager.makeProject(this.project);
			//_that.buildProy(data);		
			this.obj.close();
		},
		on_click_btn_back : function(){
			//this.wizard.prevCard();  
			//this.btn_next.setDisabled(_that.wizard.lastCardVisible());
			//this.btn_back.setDisabled(_that.wizard.firstCardVisible());
		},
		on_click_btn_next : function(){
			//this.wizard.nextCard();
			//this.btn_next.setDisabled(.wizard.lastCardVisible());
			//this.btn_back.setDisabled(_that.wizard.firstCardVisible());   
		},
		on_click_btn_cancel : function(){
			this.obj.close();   
		},
		on_cardReady_projectConfigurationPanel : function(){
			/*var data = this.templateSelectionPanel.getTarget();
			this.projectConfigurationPanel.setData(data);*/
		},
		on_starts_wizard : function(){
			this.btn_back.setDisabled(true);
		},
		show :function(){
			this.obj.show();			
		}
	}
});
