Kcl.Class('Main.GUIWrapper', 
{
	extend:Main.GUIWrapper,
    property:{
        obj:null,
        project:null
    },
    behavior:{
		construct:function(){
			Ext.QuickTips.init();
			this.splashscreen = new SplashScreen();
			this.splashscreen.show();
        },
		obj_onafterrender: function(){
            
		},     
        addItem:function(item,reg){
			if(reg==null)
				reg = 'center';
			if(this[reg]!=null)	
				this[reg].add(item).show();
		},
		center_onafterrender : function(){		
			
		},
		center_onSHIFTnTABpressed : function(){
			var activeTab = this.center.getActiveTab();
			var index = this.center.items.indexOf(activeTab);
			if(index < this.center.items.getCount() - 1)
				this.center.setActiveTab(this.center.items.itemAt(++index));
			else
				this.center.setActiveTab(this.center.items.itemAt(0));
		},
      	center_onCTRLnSpressed : function(){
			this.toolBar.btn_save.fireEvent('click');
		},
      	center_onCTRLnOpressed : function(){
			this.toolBar.btn_openFile.fireEvent('click');
		},
		appendItem : function(obj,panel){
			var south = null, center = null, candidate = null;
			for(var i = 0; i < panel.items.length;i++){
				if(panel.get(i).region == 'center')
					center = panel.get(i);		
				if(panel.get(i).region == 'south')
					south = panel.get(i);
			}
			
			if(center == null){
				panel.add({region:'center',items:obj});
				return;
			}
			else if(center.items.length <= 0 ) {
				center.add(obj);
				return;
			}
			else {
				if(south == null){
					panel.add({region:'south',items:obj});
					return;
				}
				else if(south.items.length <= 0){
					south.add(obj);
					return;
				}
				else {
					var nc = new Ext.Panel(center.cloneConfig({region:'center',split:true,height:center.getHeight()/2}));
					nc.add(panel.get(center.id));
					var ns = new Ext.Panel(center.cloneConfig({region:'south',split:true,height:center.getHeight()/2}));
					ns.add(south.get(0));
					south.removeAll();
					south.add(nc);
					south.add(ns);
					//panel.add(nc);			
					//panel.add(ns);
				}
			}//candidate.add(obj);
		},
		east_beforeadd : function(_this,cmp,index){
			/*if(_this.items.items.length == 0)		
				this.openedPanels.push(cmp);*/
		},
		east_add : function(_this,cmp,index){
			this.show();
			this.doLayout();
			this.expand();
		},
		east_onbeforecollapse : function(p){
			if(p.items.items.length == 0)
				p.hide();
		} 
    }
});
