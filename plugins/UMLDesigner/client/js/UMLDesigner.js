//http://fonts.googleapis.com/css?family=Droid+Sans+Mono
Kcl.Class( "UMLDesigner",
{
	require : [
		//main
		"plugins/UMLDesigner/client/css/main.css",
		//joint
		"lib/joint/www/build/joint-all-min.js",
		"lib/joint/www/build/joint.dia.min.js",
		"lib/joint/www/build/joint.dia.fsa.min.js",
		"lib/joint/src/joint.dia.uml.js",
		
		"plugins/UMLDesigner/client/js/views/Designer.js",
		"plugins/UMLDesigner/client/js/controllers/Designer.class.js"
	],
	extend: Kcl.Plugin,
	property:{
        connection: new Ext.data.Connection()
	},
    behavior:{
        construct : function(){
            var _this = UMLDesigner.prototype;
			
            // This is the parent's definition call
            _this.parent.construct.apply(this, []);
            
            this.openResources = [];
            
            this.connection.request({
				url:std.frontController.getRequest("initialize", "UMLDesigner"),
				method:'POST',
				success: _this.initialize.createDelegate(this)
			});
        },
        buildGUI : function(params){
            var _this = UMLDesigner.prototype;
            this.gui = params.gui;		
            
            ///this.gui.toolBar.btn_newFile.on('click',_this.mitem_newFile_onclick,this);
            
            var se = new Designer();
            this.gui.addItem(se.obj);
        },
        initialize:function(response,opt){
				
		},
		restoreSession:function(content){
			//this.bindContent(content);			
		},
        notified:function(content){
			//this.openFile(content);
		},
		openFile:function(content){
			if(!content){
                var openFile = new OpenFileDialog({
                    initialDirectory: this.projectsFolder,
                    title:'Open File',
                    callback:function(path){
                        /*std.frontController.send({
                            action: 'getMetadata',
                            controller: 'ProjectManager',
                            params:{
                                'path': path
                            }
                        });*/
                    }
                });
                openFile.show();				
            }
            else{
				std.frontController.send({
					action: 'openFile',
					controller: "UMLDesigner",
					params: {
						path:content.path,
						item:content.item
					}
				});
			}
		},
		closeFile:function(file){
			if(this.openResources[file].modified){
				var obj = {};
				obj.title = "Save Changes?";
				obj.msg = 'You are closing a file that has unsaved changes.</br> Would you like to save your changes?';
				obj.buttons = Ext.Msg.YESNOCANCEL;
				obj.icon = Ext.MessageBox.QUESTION;
				obj.scope = this;
				obj.fn = function(btn){
					switch(btn){
						    case 'yes':
							return this.saveFile(file);
							case 'no':
							this.openResources[file] = null;
							return true;
							case 'cancel':
							return false;
					   }
				}
				return Ext.Msg.show(obj);
			}
		},
		saveFile:function(file){
			var data = this.openResources[file].editor.getSession().getValue();
			std.frontController.send({
				action: 'saveFile',
				controller: "UMLDesigner",
				method:'POST',
				params: {
					file: file//,
					//data: Ext.util.JSON.encode(data)
				}
			});
			//return std.mod.Main.saveFile(file,this.openResources[file].editor.getSession().getValue());
		},
        serverResponse : function(response){
			switch(response._action){
				case 'openFile':
					if(response.success)
					{
						var ext = null;
						var fileName = null;
						if(response.file.match('/'))
						{
							ext = response.file.split("/");
							fileName = ext[ext.length -1];
							ext = fileName.split('.');						
						}
						else{
							ext = response.file.split('.');
							fileName = response.file;
						}
						ext = ext[ext.length -1];
							
						var editor = new Editor({
							id: response.path + response.file,
							title: fileName,
							value: response.content,
							mode : ext							
						});									
					}
					else
						Ext.Msg.alert("Error",response.msg);
					break;
				case'saveFile':
					if(response.success)
						this.openResources[response.file] = null;
					else
						Ext.Msg.alert("Error",response.msg);
					break;
			}
		}
    },
    mitem_newFile_onclick:function(){
		var se = new Editor({
			id:'newEditor',
			value:'Something to show',
			mode:'php',
			title:'New File'
		});
        /*se.buildGUI();
        se.obj.setTitle("New File");        
            
        this.gui.addItem(se.obj);*/
	},
    mitem_openFile_onclick:function(){
		this.openFile();
	},
	close:function(file){
		this.openResources[file].obj.close();
	}
});
