/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
Kcl.Class( 'Main.FloattingPanel', 
{
	property:{
		pinned: false
	},
    behavior:{
        construct: function(params){
			var _this = Main.FloattingPanel.prototype;
            ///
            ///tools
            ///          
            this.tools = [];
            this.tools.push({id:'pin',handler:_this.onpin,scope:this});
            this.tools.push({id:'close', handler: function(){
				this.obj.hide();
			},scope:this});
            ///
            ///obj
            ///
            this.obj = new Ext.Panel({tools:this.tools,
				
				listeners:{
					'beforeexpand' : {fn:_this.obj_onbeforeexpand,scope:this},
					//'beforehide':{fn:_this.obj_onbeforehide,scope:this},				
					'hide' : {fn:_this.obj_hide,scope:this},
					'show' : {fn:_this.obj_onshow,scope:this}
				},
				//renderTo: Ext.getBody()
			});
            this.obj.setTitle("Floating Panel");
            this.obj.region = 'center';
            this.obj.split = true;
            this.obj.splitable = true;
            this.obj.autoScroll = true;
            this.obj.autoResizable = true;
            /*draggable:{
				//      Config option of Ext.Panel.DD class.
				//      It's a floating Panel, so do not show a placeholder proxy in the original position.
						insertProxy: false,

				//      Called for each mousemove event while dragging the DD object.
						onDrag : _this.obj_ondrag,//.createDelegate(this),

				//      Called on the mouseup event.
						endDrag : _this.obj_enddrag,
				},*/
                        
            this.buildGUI(params);
        },
        buildGUI:function(){ }
    },
    obj_hide:function(cmp,anim){
		var items = cmp.ownerCt.items.items;
		//console.log(items);
		for(var i in items){
			if(i != "remove"){
				if(items[i] instanceof Ext.Panel){
					if(items[i].isVisible())
						return true;
				}
			}
		}
		cmp.ownerCt.collapse();
		//cmp.ownerCt.hide();
	},	
    obj_ondrag:function(e){
//          Record the x,y position of the drag proxy so that we can
//          position the Panel at end of drag.
		var pel = this.proxy.getEl();
		this.x = pel.getLeft(true);
		this.y = pel.getTop(true);

//          Keep the Shadow aligned if there is one.
		var s = this.panel.getEl().shadow;
		if (s) {
			s.realign(this.x, this.y, pel.getWidth(), pel.getHeight());
		}
	},
	obj_enddrag: function(e){
		//var window = new Ext.Window({title:this.obj.title});
		this.panel.layout = '';
		this.panel.setPosition(this.x,this.y);
		//window.show();
	},
    obj_onshow:function(){
		this.obj.ownerCt.expand();
    },
    obj_onbeforeexapand:function(){
        this.parent.expand();
    },
    onpin:function(e,te,panel,tc){
		if(te.dom.classList[1] == "x-tool-pin"){
			//te.addClass("x-tool-unpin");
			panel.hide();			
			//console.log(std.mod.Main.gui.east.items);
		}
		else{
			//te.addClass("x-tool-pin");
		}
    }
});




