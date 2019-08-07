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
	extend: BHike.Wizard,
    property:{
        collection:null,
        ends:null,
        starts:null
    },
    behavior:{
        construct: function(params){
            var _this = BHike.Wizard.prototype;
            this.collection = [];
            /////////////////////////////////////////////////////////////
            this.starts = !params || !params.starts ? null: params.starts;
            this.ends   = !params || !params.ends   ? null: params.ends
            
            this.buildGUI(params);
        },
		add:function(elem){
			this.obj.add(elem); 
			var key = 'card-'+(this.obj.items.length-1);
			this.collection[this.collection.length] = [key,elem];
			this.obj.fireEvent('added');             
		},
		remove:function(elem){
			for(var i = this.collection.length - 1; i>0 ;i--)
				if(this.collection[i][1] == elem)
				{
					this.obj.remove(this.collection[i][1]);
					this.erase(i);				
				}
			this.obj.fireEvent('removed');
		},
		erase: function(index){
			var aux = [];
			for(var i = 0; i < this.collection.length;i++)
				if(i != index)
					aux.push(['card-'+aux.length,this.collection[i][1]]); 
			this.collection = aux;	
		},
		getActiveItem:function(){
			var lay = this.obj.getLayout().activeItem.id;
			return Ext.getCmp(lay);
		},
		getActiveCard:function(){
			var acItm = this.obj.getLayout().activeItem;
			for(var i in this.collection){
				if(this.collection[i][1].id == acItm.id)
					return this.collection[i][0];
			}
			return false;
		},
		setActiveItem:function(item){
			this.obj.getLayout().setActiveItem(item);
		},
		cardNav: function(incr){
			var l = this.obj.getLayout();
			var i = this.getActiveCard().split('card-')[1];
			//alert(i);
			var next = parseInt(i,10) + incr;
			this.btn_previous.setDisabled(next<=0);
			this.btn_next.setDisabled(next==this.obj.items.length -1);
			
			if(next==this.obj.items.length){
				//this.ends();
			}
			else{
				var item = this.collection[next>0?next:0][1];
				this.setActiveItem(item);			
				//item.cardReady();
			}
			if((parseInt(i,10) + incr)== 0 && this.starts!=null){
				this.starts();
			}
		},
		nextCard:function(btn,e){
			this.cardNav(1);
		},
		prevCard:function(btn,e){
			this.cardNav(-1);
		},
		checkButtonsState: function(){
			this.btn_previous.setVisible(!this.obj.items || !(this.obj.items.length <= 1));            
			this.btn_next.setVisible(!this.obj.items || !(this.obj.items.length <= 1));
		},
		on_beforerender_obj:function(){
			var _this = BHike.Wizard.prototype;
			this.btn_previous.setDisabled(true);
			this.checkButtonsState();
		},
		firstCardVisible:function(){
			return this.getActiveCard() == 'card-0';
		},
		lastCardVisible:function(){
			var _this = BHike.Wizard.prototype;
			var val = this.getActiveCard();
			return val == 'card-'+(this.obj.items.length-1);
		},
		setIterable:function(v){
			this.btn_previous.setVisible(v || v != undefined || v != null);
			this.btn_next.setVisible(v || v != undefined || v != null);
		},
		indexOf:function(obj){
			if(obj)
			for (i = 0; i < this.collection.length; i++)
				if(this.collection[i][1].id == obj.id)
					return i;
			return false;		
		},
		isContained:function(obj){		
			return isNaN(this.indexOf(obj));
		}
    }
});
