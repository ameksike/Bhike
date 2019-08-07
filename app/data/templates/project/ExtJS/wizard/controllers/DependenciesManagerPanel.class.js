Kcl.Class('DependenciesManagerPanel',{
	extend:DependenciesManagerPanel,
	on_rowselect_gridSelectionModel : function(sm){
		var _that = DependenciesManagerPanel.prototype;
		var value = sm.getSelected();
		
		var detailEl = this.detailsPanel.body;
		if(value){
			detailEl.hide();
			this.template.overwrite(detailEl, value.data);
			detailEl.slideIn('l', {
				stopFx:true,
				duration:.1
			});        
		   
		}else{        
			detailEl.update();
		}
	},
	on_load_store : function(store,r,opt){
		var _that = DependenciesManagerPanel.prototype;
		var data = [];
		for(var i = 0; i < r.length;i++){
			var record = r[i];
			var rindex = _that.existsRowInData(record,data);
			var row = [
				record.data.state,
				record.data.icon,
				record.data.name,
				record.data.url,
				record.data.category,
				record.data.description,
				record.data.version
			];
			if(rindex==-1)
				data[data.length] = row;
			else
				data[rindex] = row;
			
				
		}
		this.backup_store.loadData(data);
		var sm = this.gridPanel.getSelectionModel();
		sm.selectRow(0);
	//var collection = this.backup_store.collect('name');
	//store.removeAt(0);
	//store.removeAt(0);    
	},
	existsRowInData : function(row,data){
		for (var i = 0; i<data.length;i++)
			if(data[i][2] == row.data.name)return i;
		return -1;
	},
	getAllVersionsByName : function(name){
		var _that = DependenciesManagerPanel.prototype;
		var st = this.store;
		st.filter('name',name);
		var collection = st.collect('version');
		st.clearFilter();
		return collection;
	},
	on_afterrender_obj : function(){
		var _that = DependenciesManagerPanel.prototype;
		/*_that.store.load({
			
		});*/
	},
	on_beforequery_cmb_editor : function(qe){
		var _that = DependenciesManagerPanel.prototype;
		var ver = _that.getAllVersionsByName(_that.gridPanel.getSelectionModel().getSelected().data.name);
		var vers=[];
		for (var i = 0; i < ver.length;i++) 
			vers[i] = [ver[i]];
		qe.combo.getStore().loadData(vers);
	},
	on_afteredit_gridPanel : function(e){
		var _that = DependenciesManagerPanel.prototype;
		/*var st = this.store;
		var sel = this.gridSelectionModel.getSelected();
		var posRBS = this.backup_store.indexOf(sel);
		st.filter('name',sel.data.name);
		var org = st.find('version',sel.data.version);
		st.clearFilter();
		org = st.getAt(org);
		this.backup_store.removeAt(posRBS);
		this.backup_store.add(org);
		e.record.reject();    */
		//var rows = _that.getAllRowsByName(obj.record.data.name);  
	},
	on_beforerender_cmb_editor : function(e){
		var _that = DependenciesManagerPanel.prototype;
		//var rows = _that.getAllRowsByName(obj.record.data.name);
	   
	},
	setData : function(data){
		var _that = DependenciesManagerPanel.prototype;
		//if(data)
		_that.data = data;
	}
});
