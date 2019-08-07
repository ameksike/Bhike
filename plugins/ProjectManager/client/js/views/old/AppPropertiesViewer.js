Kcl.Class( 'AppPropertiesViewer', 
{
    property:{
        //components fields
        obj:null,
        project:null
    },
    behavior:{
        construct: function(project){
			var _this = AppPropertiesViewer.prototype;
			this.buildGUI();			
        },
        buildGUI:function(params){
			//
			//north
			//
			this.north = new Ext.Panel({title:'Joder'});
			this.north.region = 'north';
			this.north.setHeight(50);
			//
			//center
			//
			this.center = new Ext.Panel();
			this.center.region = 'center';
			//
			//obj
			//
			this.obj = new Ext.Panel();
			this.obj.layout = 'border';
			this.obj.add(this.center);
			this.obj.add(this.north);
		}
    }
});
