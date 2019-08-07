/*
 * $package: BHike
 * 
 * $description: Ksike is a Ksike's JavaScript class definition that....
 * $authors: no-body
 * $created: Sun, 07 Oct 12 17:58:11 -0400
 * $license: GPL v3
 **/

Kcl.Class('ExtJS.Wizard',
{	
	extend:IWizard,
    behavior:{
        construct: function(params){			
            var _this = ExtJS.Wizard.prototype;
        },
        buildGUI:function(params){
			this.collection = new Array();
			var _this = ExtJS.Wizard.prototype;			
			
			this.tabPanel = new Ext.TabPanel();            
            this.tabPanel.setHeight(400);
            this.tabPanel.frame = true;
            this.tabPanel.border = false;
            this.tabPanel.activeTab = 0;
            this.tabPanel.add({title:'Hello'});           
            this.tabPanel.add({title:'Config'});
			
			this.collection.push(this.tabPanel);
            
            return this;
		}		   
    }
});
