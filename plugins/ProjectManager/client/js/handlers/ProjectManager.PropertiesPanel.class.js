Kcl.Class( 'ProjectManager.PropertiesPanel', 
{
    extend: ProjectManager.PropertiesPanel,
    behavior:{
		construct:function(){
			this.parent.construct.apply(this, [this]);
		},
		toolclose_onclick :function(e,te,pnl,tc){
			this.hide();
		},
		hide : function(){
			this.obj.clossed = true;
			this.obj.hide();
			this.obj.ownerCt.doLayout();
		},
		show : function(forceView){
			if(!this.obj.clossed || forceView){
				if(this.obj.collapsed)
					this.obj.expand();
				this.obj.show();
				this.obj.ownerCt.doLayout();
			}
		},
		showProperties : function(data,forceView){
			if(!this.obj.isVisible())
				this.show(forceView);
			this.grid.setSource({
				"(name)": data.name,
				"Created": new Date(Date.parse('10/15/2006')),
				"Available": false,
				"Version": .01,
				"Artifact": data.artifact
			});
			//console.log(data);
		}
	}
});
