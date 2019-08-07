Kcl.Class('CodeEditor.Editor', 
{
	extend:CodeEditor.Editor,
	property:{
		connection: new Ext.data.Connection()
	},
    behavior:{
        construct: function(params){
			params!=null && params.title != null ? this.title = params.title : this.title = 'New File';			
			params!=null && params.mode != null ? this.mode = params.mode : this.mode = 'javascript'; //std.CodeEditor.mode
			params!=null && params.theme != null ? this.theme = params.theme : this.theme = 'eclipse';//std.CodeEditor.theme
			params!=null && params.value != null ? this.defaultValue = params.value : this.defaultValue = 'Empty document';//std.CodeEditor.defaultValue
			
			if(params != null && params.id != null)
			{
				if(std.mod.CodeEditor.openResources[params.id] == null)
				{	
					this.id = params.id;				
					this.buildGUI(params);
					std.mod.Main.gui.addItem(this.obj);
					
					std.mod.CodeEditor.openResources[params.id] = this;
					this.setMode(this.mode);
				}
				else
					std.mod.Main.gui.center.activate(std.mod.CodeEditor.openResources[params.id].obj);
			}
			
			this.modified = false;
        },
		initializeEditor:function(){
          	var _this = CodeEditor.Editor.prototype;
			var renderer = this.textArea.el.dom;
			renderer.defaultValue = this.defaultValue;
			this.editor = new CodeMirror.fromTextArea(renderer);			
			this.editor.setOption('theme',this.theme);
			this.editor.setOption('gutter',true);
			this.editor.setOption('lineNumbers',true);
			this.editor.setOption('fixedGutter',true);
			this.editor.setOption('matchBrackets',true);
          	this.editor.setOption('lineWrapping',false);
			this.editor.setOption('undoDepth',100);
			///readOnly
			//this.editor.setOption('readOnly',true);
			this.editor.setOption('extraKeys',{
				"Ctrl-Space": this.autocomplete,
				"Ctrl-F": _this.onfind.createDelegate(this),
				"Ctrl-R": function(){alert("Replaced")}
			});
			
			this.editor.setOption('onChange',this.editor_onchange.createDelegate(this));
				
			this.editor.focus();
			
		},
		editor_onchange:function(editor,changes){
			this.modified = true;
			this.obj.setTitle(this.title + '*');
			std.mod.Main.gui.toolBar.btn_save.enable();
			std.mod.Main.gui.toolBar.btn_undo.enable();
			std.mod.Main.gui.toolBar.btn_redo.enable();
		},
		textArea_onresize:function(){
			if(this.editor !== null)
				this.editor.refresh();
		},
		btn_comment_onclick:function(){
			var selection = this.editor.getLine();
		},
		btn_uncomment_onclick:function(){
			//this.setTheme('elegant');
		},
		obj_onactivate:function(){
			std.mod.Main.gui.toolBar.btn_save.setDisabled(!this.modified);
			std.mod.Main.gui.toolBar.btn_undo.setDisabled(!this.modified);
			std.mod.Main.gui.toolBar.btn_redo.setDisabled(!this.modified);
			std.mod.Main.gui.toolBar.btn_save.addListener('click',this.save,this);
			std.mod.Main.gui.toolBar.btn_undo.addListener('click',this.editor.undo);
			std.mod.Main.gui.toolBar.btn_redo.addListener('click',this.editor.redo);
			std.mod.CodeEditor.activeDocument = this;
		},
		obj_ondeactivate:function(){
			std.mod.Main.gui.toolBar.btn_save.removeListener('click',this.save,this);
		},
		obj_onclose:function(){
			std.mod.CodeEditor.openResources[this.id] = null;
		},
		setValue:function(val){
			if(val)
				this.editor.setValue(val);
		},
		setMode:function(mode){
			if(mode == 'js')
				mode = 'javascript';
			if(mode == 'html')
				mode = 'htmlmixed';
			this.editor.setOption('mode',mode);
		},
		setTheme:function(theme){
			if(theme)
			this.editor.setOption('theme',theme);
		},
		save:function(a,b,c){
			var data = this.editor.getValue();
			this.connection.request({
				url:std.frontController.getRequest("saveFile", "CodeEditor",{file: this.id/*,data: data */}),
				method:'POST',
				callback:this.onsaved.createDelegate(this),
				params:{'test':data}//'<?php\n\techo "algo";\n?>'}
			});
		},
		onsaved:function(config,success,response){
			var resp = Ext.util.JSON.decode(response.responseText);
			if(resp.success){
				this.modified = false;			
				this.obj.setTitle(this.title);
				std.mod.Main.gui.toolBar.btn_save.setDisabled(true);
			}
			else
				Ext.Msg.alert("Error",resp.msg);
			
		},
		autocomplete:function(cm){
			CodeMirror.simpleHint(cm, CodeMirror.javascriptHint);
		},
      	onfind : function(){
			std.mod.CodeEditor.findPane.find(this.editor.getSelection());			
      	}
    }
});
