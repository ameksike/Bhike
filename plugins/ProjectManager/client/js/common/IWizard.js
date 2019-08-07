/*
 * $package: BHike
 * 
 * $description: IWizard is a Ksike's JavaScript class definition that....
 * $authors: no-body
 * $created: Thu, 21 Jun 12 05:48:23 +0200
 * $license: GPL v3
 **/

Kcl.Class('IWizard',
{
	property:{
		collection:[]
	},
    behavior:{
        construct: function(params){
            var _this = IWizard.prototype;
            _this.projectData = params.projectData == null ? std.mod.ProjectManager.projectWindow.templateSelectionPanel.tree.getSelectionModel().getSelectedNode() : {};
            _this.project = std.mod.ProjectManager.projectWindow.project;
            _this.app = params.app != null ? {} : {}; 
            
            this.wizard = std.mod.ProjectManager.projectWindow.wizard;
			this.initialData = std.mod.ProjectManager.projectWindow.templateSelectionPanel;
        }  
    },
    getWizardData:function(){
		std.mod.ProjectManager.getWizardData(this.wizardData);
	},
	addItem:function(item){
		if(this.collection.indexOf(item) == -1)
			this.collection.push(item);
		else
			return false;
	}
});
