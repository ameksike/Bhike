//http://fonts.googleapis.com/css?family=Droid+Sans+Mono
Kcl.Class( "CodeEditor",
{
	require : [
		"plugins/CodeEditor/client/lib/codemirror/lib/codemirror.css",
		"plugins/CodeEditor/client/lib/codemirror/lib/codemirror.js",
		//search
		"plugins/CodeEditor/client/lib/codemirror/lib/util/search.js",
		"plugins/CodeEditor/client/lib/codemirror/lib/util/searchcursor.js",
		//hints
		"plugins/CodeEditor/client/lib/codemirror/lib/util/simple-hint.css",   
		"plugins/CodeEditor/client/lib/codemirror/lib/util/simple-hint.js",
		"plugins/CodeEditor/client/lib/codemirror/lib/util/javascript-hint.js",
		//theme
		"plugins/CodeEditor/client/lib/codemirror/theme/eclipse.css",
		"plugins/CodeEditor/client/lib/codemirror/theme/elegant.css",
		//mode    
		"plugins/CodeEditor/client/lib/codemirror/mode/javascript/javascript.js",
		"plugins/CodeEditor/client/lib/codemirror/mode/css/css.js",
		"plugins/CodeEditor/client/lib/codemirror/mode/clike/clike.js",
		"plugins/CodeEditor/client/lib/codemirror/mode/htmlembedded/htmlembedded.js",
		"plugins/CodeEditor/client/lib/codemirror/mode/htmlmixed/htmlmixed.js",
		"plugins/CodeEditor/client/lib/codemirror/mode/php/php.js",
		"plugins/CodeEditor/client/lib/codemirror/mode/xml/xml.js",
		
		//EDITOR
		"plugins/CodeEditor/client/css/main.css",
		"plugins/CodeEditor/client/js/views/CodeEditor.FindPane.js",
		"plugins/CodeEditor/client/js/controllers/CodeEditor.FindPane.class.js",
		"plugins/CodeEditor/client/js/views/CodeEditor.Editor.js",
		"plugins/CodeEditor/client/js/controllers/CodeEditor.Editor.class.js"
	],
	extend: Kcl.Plugin,
	property:{
        connection: new Ext.data.Connection()
	},
    behavior:{
        construct : function(){
            var _this = CodeEditor.prototype;
            _this.parent.construct.apply(this, []);
            std.mod.Main.supply(this,"code");
            
            this.openResources = [];
            
            this.connection.request({
				url:std.frontController.getRequest("initialize", "CodeEditor"),
				method:'POST',
				success: _this.initialize.createDelegate(this)
			});
						
          	this.findPane = new CodeEditor.FindPane();
        },
        buildGUI : function(params){
            var _this = CodeEditor.prototype;
            this.gui = params.gui;		
            this.findPane.buildGUI();			
			this.gui.map.addBinding({
				key: Ext.EventObject.F,
				ctrl:true,
				fn: _this.CRTLnFonpressed,
				scope:this,
              	stopEvent:true
			});
            ///this.gui.toolBar.btn_newFile.on('click',_this.mitem_newFile_onclick,this);
            
            /*var se = new Editor();
            this.gui.addItem(se.obj);            
            se.setValue("Joder");*/
        },
        initialize:function(response,opt){
			var data = Ext.util.JSON.decode(response.responseText);
			this.theme = data.theme;
			this.mode = data.mode;			
		},
		restoreSession:function(content){
			//this.bindContent(content);			
		},
        artifact_ondblclick : function(artifact){
			if(artifact.type == "File")
				this.openFile(artifact);
		},
		openFile:function(artifact){
			if(!artifact){
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
					controller: "CodeEditor",
					params: {
						path:artifact.projectPath,
						item:artifact.item
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
				controller: "CodeEditor",
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
							
						var editor = new CodeEditor.Editor({
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
		var se = new CodeEditor.Editor({
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
	},
	CRTLnFonpressed: function(){
		this.onfind();
	},
    onfind : function(){
		this.findPane.show();			
    },
	getActiveDocument : function(){
		return this.activeDocument ? this.activeDocument : false;
	}
});
