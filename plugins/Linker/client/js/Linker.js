//http://fonts.googleapis.com/css?family=Droid+Sans+Mono
Kcl.Class("Linker",
{
	require: [		
		//Joint
		std.router.lib('0')+"joint/www/build/joint-all-min.js",
		std.router.lib('0')+"joint/www/build/joint.dia.min.js",
		std.router.lib('0')+"joint/src/joint.dia.devs.js",
		std.router.lib('0')+"joint/www/build/joint.arrows.min.js",
		std.router.lib('0')+"joint/src/joint.dia.serializer.js",
		std.router.lib('0')+"joint/www/build/joint.dia.fsa.min.js",
		std.router.lib('0')+"joint/src/joint.dia.uml.js",
		//THIS
		std.router.module('Linker')+"css/main.css",
		std.router.module('Linker')+"js/common/Link.js",
		std.router.module('Linker')+"js/common/Linker.Model.js",
		std.router.module('Linker')+"js/views/Linker.TargetWindow.js",
		std.router.module('Linker')+"js/views/Linker.Designer.js",
		std.router.module('Linker')+"js/controllers/Linker.Designer.class.js",
	],
	extend: Kcl.Plugin,
	property:{
        connection: new Ext.data.Connection(),
        openedFiles : new Array()
	},
    behavior:{
        construct : function(){
            // This is the parent's definition call
            //this.parent.construct.apply(this, [this]);
            //this.openResources = [];
            
            /*this.connection.request({
				url:std.FrontController.getRequest("initialize", "Linker"),
				method:'POST',
				success: _this.initialize.createDelegate(this)
			});*/			
        },
        buildGUI : function(params){
			var _this = Linker.prototype;
			this.gui = params.gui;
			///
			///btn_save
			///
			this.btn_save = new Ext.Button();
			this.btn_save.setText("Save Diagram");
			this.btn_save.on('click',_this.btn_save_onclick,this);
			
			
			this.gui.toolBar.insertItem(this.btn_save,this.gui.toolBar.obj.items.length-2);	
        }
	},
	btn_save_onclick : function(){
		/*if(this.gui.center.items.length > 0) {
			var file = this.gui.center.getActiveTab().id;
			var designer = this.openedFiles[file];
			var classes_collection = [];
			for(var c in designer.classes)
				if(c != 'remove') classes_collection.push(designer.classes[c].save());
			var data = Ext.util.JSON.encode({
				name:designer.fileName,
				project:'BHike',
				type:'Application',
				version:'1.0',
				content:{ classes: classes_collection, links: designer.links}
			});
			this.saveFile(file,data);
		}*/
		this.openFile('data/linker.xml');
	},
	saveFile : function(file,data){
		this.connection.request({
			url:'../dev/project/testedproj/index.php/Linker/saveDiagram',
			method:'POST',
			params:{data: data},
			scope:this,
			success: function(response,option){
				alert('Allen gut!!!');
			}
		});
	},
	openFile : function(file){
		var _this = Linker.prototype;	
		if(!this.hasKey(this.openedFiles,file))
			this.connection.request({
				url:std.frontController.getRequest('openFile',"Linker"),//'../dev/project/testedproj/index.php/Linker/loadFile?file='+file,
				params:{file:file},
				method:'GET',
				scope:this,
				success: _this.renderContent
			});
	},
	renderContent : function(response,option){
		var response  = Ext.util.JSON.decode(response.responseText);
		if(response.success){
			var linker = response.data.Linker;		
			/*for(i in linker.Content.Class)	
				if(i != 'remove')
					linker_designer.classes.push({
						name:linker.Content.Class[i]['@attributes'].Name, 
						methods:linker.Content.Class[i].Method,
						file:linker.Content.Class[i]['@attributes'].File,
						gui:linker.Content.Class[i].GUI
					});*/
			var ld = this.gui.center.findById(linker.Data.FileName);
			if(ld == null){
				this.openedFiles[linker.Data.FileName] = new Linker_Designer({
					gui:this.gui,
					id:linker.Data.FileName,
					name:linker.Data.Name,
					content:linker.Content
				});		
				this.openedFiles[linker.Data.FileName].renderDiagram();
			}
			else
				this.gui.center.activate(ld);
		} else {
			Ext.Msg.alert("Linker message",response.msg);
		}	
	},
	hasKey : function(array,key) {
		for(var i in array)
			if(i != 'remove' && i == key) return true;
		return false;
	}
});
