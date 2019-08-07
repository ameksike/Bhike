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
        },
        buildGUI:function(wizard){
            var _this = ProjectVariablesManager.prototype;
            //
            //cardManager
            //
            this.cardManager = new CardManager();
            this.cardManager.buildGUI();
            this.cardManager.obj.border = false;
            this.cardManager.obj.activeItem = 0;
            
            this.wizard = wizard;            
            
            //
            //obj
            //
            this.obj = new Ext.Panel({
                title:"Project Variables"
            });
            this.obj.autoScroll = true;
            this.obj.setHeight(400);
            this.obj.border = false;
        }	
    },
    cardReady:function(){
        //this.wizard.add(this.op);
    }
});
