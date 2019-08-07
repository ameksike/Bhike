Kcl.Class("StartPage",
{
	extend: StartPage,
	behavior:{
		construct:function(params){
			//this.parent.construct.apply(this, [this]);
			this.buildGUI();
		},
		store_onload : function(st,r,opt){
			if(st.getCount()!=0) {                   
				st.each(function(r){
					
					var selModel = new Ext.grid.RowSelectionModel();
					selModel.singleSelect = true;
					
					selModel.on('rowselect',this.selModel_onrowselect,this);
					selModel.on('rowdeselect',this.selModel_onrowdeselect,this);            
					//
					//gridPanel
					//
					var gridPanel = new Ext.grid.GridPanel({
						title:r.data.title
					});
					gridPanel.store = this.gridStore;
					gridPanel.colModel = this.gridColumnModel;
					gridPanel.autoExpandColumn = 'name';
					gridPanel.autoScroll = true;
					gridPanel.border = false;
					gridPanel.setHeight('100%');
					gridPanel.enableKeyEvents = true,
					gridPanel.hideHeaders = true;
					gridPanel.padding= '10 -10 10 10';
					gridPanel.selModel = selModel;            
					gridPanel.contentKey = r.id;
					gridPanel.on('activate',this.gridPanel_onactivate,this);
					
					this.centerRegion.add(gridPanel);
					
				},this);
				this.centerRegion.setActiveTab(0);
			}
		},
		gridPanel_onactivate : function(gp){                            
			gp.getStore().loadData(this.store.getById(gp.contentKey).data.content);
			gp.getSelectionModel().selectFirstRow();
		},
		btn_startpage_onclick : function(){			
			this.obj.show();		
			std.mod.Main.gui.center.add(this.obj);
			std.mod.Main.gui.center.activate(std.mod.Main.gui.center.getItem(this.obj.id));
			
		},
		obj_beforerender : function(){this.store.load();},
		obj_onbeforeclose : function(cmp){
			cmp.hide();
			return false;//std.mod.Main.gui.center.remove(this.obj,true);
		},
		gridStore_onload : function(){                            
			this.centerRegion.getActiveTab().getSelectionModel().selectFirstRow();
		},
		selModel_onrowselect : function(row,rIndex,record){
			var active = this.centerRegion.getActiveTab();
			/*var id = this.centerRegion.getActiveTab().contentKey + record.data.topic.split(' ');
			var div = document.getElementById('div_'+id);
			div.firstChild.setAttribute('class','thumbs-clicked');
			var links = document.getElementById('links_'+id);
			links.className = "div-visible";*/
		},
		selModel_onrowdeselect : function(row,rIndex,record){    
			/*var id = this.centerRegion.getActiveTab().contentKey + record.data.topic.split(' ');    
			var div = document.getElementById('div_'+id);
			div.firstChild.setAttribute('class','thumbs');
			var links = document.getElementById('links_'+id);
			links.className = "div-hidden";*/
		},
		iconColumn_renderer : function(val,x,store){
			var id = this.centerRegion.getActiveTab().contentKey + store.data.topic.split(' ');
			var topic = store.data.topic;
			var description = store.data.description;
			
			var div = document.createElement('div');
			div.id = id;
			div.className = "start-page-thumbs";
			var img = document.createElement('img');
			img.className = "thumbs";
			img.src = val;
			var span = document.createElement('span');
			var stext = document.createTextNode(topic);
			span.appendChild(stext);
			var ddiv = document.createElement('div');
			ddiv.className = "div-hidden";
			var p = document.createElement('p');
			var ptext = document.createTextNode(description);
			p.appendChild(ptext);
			ddiv.appendChild(p);
			for(var i in store.data.links){
				
			}
			div.appendChild(img);
			div.appendChild(span);
			div.appendChild(ddiv)
			//return div;
			
			return '<img class="thumbs" src="'+val+'"/>';
			
		}
	}
});
