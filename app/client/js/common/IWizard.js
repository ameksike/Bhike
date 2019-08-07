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
        parentWizard:null
    },
    behavior:{
        construct: function(params){
            var _this = IWizard.prototype;
            this.parentWizard = std.mod.ProjectManager.projectWindow.wizard;
        }
    }
});
