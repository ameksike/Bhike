/*
 * @application: BHike
 * @version: 0.1
 * @package: alpha
 * 
 * @description: ProjectVariablesManager is a class that implements...
 * @authors: Nosinc
 * @created: 10-oct-2011 5:44:53
 * @license: GPL v3
 **/

Kcl.Class( 'ProjectVariablesManager', 
{
    extend:CardItem,
    property:{
        obj:null,
        wizard:null
    },
    behavior:{
        construct: function(params){
            var _this = ProjectVariablesManager.prototype;
            this.projectData = params.projectData;
            this.project = params.project;
        },
        buildGUI:function(wizard){
            var _this = ProjectVariablesManager.prototype;
            //
            //cardManager
            //
            //this.cardManager = new CardManager();
            //this.cardManager.buildGUI();
            //this.cardManager.obj.border = false;
            //this.cardManager.obj.activeItem = 0;
            
            this.wizard = wizard;            
            //
            //txt_author
            //
            this.txt_author = new Ext.form.TextField();
            this.txt_author.setValue(this.project.attributes.name);
            this.txt_author.fieldLabel = 'Author';
            //
            //txt_company
            //
            this.txt_company = new Ext.form.TextField();
            this.txt_company.setValue('Nosinc');
            this.txt_company.fieldLabel = 'Company';
            
            //
            //fset_ownerInfo
            //
            this.fset_ownerInfo = new Ext.form.FieldSet();
            this.fset_ownerInfo.setTitle("Owner Specifics");
            this.fset_ownerInfo.add(this.txt_author);
            this.fset_ownerInfo.add(this.txt_company);
            //
            //obj
            //
            this.obj = new Ext.Panel();
            this.obj.frame = true;
            this.obj.margins = '2px 2px 2px 2px';
            this.obj.padding = '10px 20px 10px 20px';
            this.obj.autoScroll = true;
            this.obj.setHeight(400);
            this.obj.border = false;
            this.obj.add(this.fset_ownerInfo);            
        }	
    },
    cardReady:function(){
        //this.wizard.add(this.op);
    }
});
