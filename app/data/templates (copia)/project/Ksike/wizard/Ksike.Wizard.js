/*
 * $package: BHike
 * 
 * $description: Ksike is a Ksike's JavaScript class definition that....
 * $authors: no-body
 * $created: Sun, 07 Oct 12 17:58:11 -0400
 * $license: GPL v3
 **/

Kcl.Class('Ksike.Wizard',
{	
	extend:IWizard,
    behavior:{
        construct: function(params){ 
            
            var _this = Ksike.Wizard.prototype;           
            this.parent.construct(params);		
            
            this.projectVariablesManager = new ProjectVariablesManager(this);
            //this.projectConfigurationPanel = new ProjectConfigurationPanel(this);
            this.dependenciesManagerPanel = new DependenciesManagerPanel(this);           
            this.projectConstantsPanel = new ProjectConstantsPanel(this);
        },
        buildGUI:function(params){
			this.collection = new Array();
			var _this = Ksike.Wizard.prototype;
			this.dependenciesManagerPanel.buildGUI();
			this.projectVariablesManager.buildGUI();
			this.projectConstantsPanel.buildGUI();
			//this.projectConfigurationPanel.buildGUI();
			
			this.tabPanel = new Ext.TabPanel();            
            this.tabPanel.setHeight(400);
            this.tabPanel.frame = true;
            this.tabPanel.border = false;
            this.tabPanel.activeTab = 0;
            this.tabPanel.add(this.projectConstantsPanel.obj);           
            this.tabPanel.add(this.dependenciesManagerPanel.obj);
			
			this.collection.push(this.tabPanel);            
            this.collection.push(this.projectVariablesManager.obj);
            
            return this;
		}		   
    }
});
