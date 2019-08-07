Kcl.Class( 'PropertiesViewer.class', 
{
	extend:PropertiesViewer,
    property:{
        //components fields
        obj:null,
        project:null
    },
    behavior:{
        construct: function(project){
			var _this = PropertiesViewer.class.prototype;
			//this.parent.construct(project);			
        },
        obj_onbeforerender:function(){
			this.west.add({xtype:'button',text:'Project'});
			var appViewer = new AppPropertiesViewer();
			this.center.add(appViewer.obj);
		},
		show:function(){
			/*if(std.mod.Main.gui.center.findById() == null)
			{
				this.obj.setTitle(this.project.data.Name);
				std.mod.Main.gui.center.addItem(this.obj);
				//this.obj.show();				
			}*
			this.obj.setTitle(this.project.data.Name);
			
			std.mod.Main.gui.center.addItem(this.obj);
			std.mod.Main.gui.center.setActiveTab(this.obj.id);*/
		}
    }
});
