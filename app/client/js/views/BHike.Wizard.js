/*
 * @application: BHike
 * @version: 0.1
 * @package: alpha
 * 
 * @description: BHike.Wizard is a class that implements...
 * @authors: Nosinc
 * @created: 09-oct-2011 10:26:31
 * @license: GPL v3
 **/

Kcl.Class('BHike.Wizard', 
{
    property:{
        obj:null
    },
    behavior:{
        buildGUI:function(params){
            var _this = BHike.Wizard.prototype;
            ///
            ///btn_back
            ///
            this.btn_previous = new Ext.Button();
            this.btn_previous.setText("Previous");
            this.btn_previous.on('click',_this.prevCard,this);//_this.wizard.prevCard();
            ///
            ///btn_next
            ///
            this.btn_next = new Ext.Button();
            this.btn_next.setText("Next");
            this.btn_next.on('click',_this.nextCard,this);//_this.wizard.prevCard();
            ///
            ///obj
            ///
            this.obj = new Ext.Panel();
            this.obj.layout = 'card';
            this.obj.border = false;
            this.obj.activeItem = 0;
            this.obj.autoHeight = true;
            this.obj.autoWidth = true;
            this.obj.on('afterrender',_this.on_beforerender_obj,this);
            this.obj.on('added',_this.checkButtonsState,this);
            this.obj.on('removed',_this.checkButtonsState,this)
            
        }	
    }
});


/*
 * @application: BHike
 * @version: 0.1
 * @package: alpha
 * 
 * @description: CardPanel is a class that implements...
 * @authors: Nosinc
 * @created: 09-oct-2011 10:26:31
 * @license: GPL v3
 **/

Kcl.Class( 'CardItem', 
{
    property:{
        obj:null
    },
    behavior:{
        construct: function(params){
            var _this = CardPanel.prototype;
        },
        buildGUI:function(){
            var _this = CardPanel.prototype;
        }	
    },
    cardReady:function(){ }
});
