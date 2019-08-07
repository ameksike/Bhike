Kcl.Class( 'PropertiesViewer', 
{
    property:{
        //components fields
        obj:null,
        projectSerial:null
    },
    behavior:{
        construct: function(params){
            var _this = PropertiesViewer.prototype;                   
			this.project = params;
						
			this.buildGUI();
        },
        buildGUI:function(params){
            var _this = PropertiesViewer.class.prototype;
            //
            //west
			//
			this.west = new Ext.Panel({
				margins:'2 0 2 4',
				defaults:{toggleGroup:'btns_'+this.project.data.Serial,height:30}
			});
			this.west.region = 'west';
			this.west.border = false;
			this.west.layout = {type:'vbox',align:'stretch'};
			this.west.setWidth(170);
			//
			//center
			//
			//this.center = new Ext.Panel({margins:'2 2 2 0'});
			this.center = new CardManager();
			this.center.border = false;
			this.center.frame = true;
			this.center.obj.region = 'center';
			//
			//panel
			//
			this.panel = new Ext.Panel();
			this.panel.layout = 'border';
			this.panel.border = true;
			this.panel.padding = '5';
			this.panel.add(this.center.obj);
			this.panel.add(this.west);
			//
			//obj
			//
			this.obj = new Ext.Panel();
			this.obj.setTitle("Properties Viewer");
			this.obj.closable = true;
			this.obj.padding = '10 5 5 10';
			this.obj.layout = 'fit';
			this.obj.add(this.panel);
            this.obj.on('beforerender',_this.obj_onbeforerender,this);
        }
    }
});
