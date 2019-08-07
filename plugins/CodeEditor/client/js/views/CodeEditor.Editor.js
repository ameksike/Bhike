/*
 * @application: BHike
 * @version: 0.1
 * @package: ${package=folder}
 * 
 * @description: ${name} is a class that implements...
 * @authors: Nosinc
 * @created: ${date} ${time}
 * @license: GPL v3
 **/

Kcl.Class( 'CodeEditor.Editor', 
{
    behavior:{
        construct: function(params){
            var _this = CodeEditor.Editor.prototype;
            this.editor = null;
        },
        buildGUI:function(params){
            var _this = CodeEditor.Editor.prototype;
            ///
            ///btn_comment
            ///
            this.btn_comment = new Ext.Button();
            this.btn_comment.setText("CO");
            this.btn_comment.setTooltip("Comment Selection");
            this.btn_comment.on('click',_this.btn_comment_onclick,this);
            ///
            ///btn_uncomment
            ///
            this.btn_uncomment = new Ext.Button();
            this.btn_uncomment.setText("UC");
            this.btn_uncomment.setTooltip("Uncomment Selection");
            this.btn_uncomment.on('click',_this.btn_uncomment_onclick,this);                                 
            ///
            ///toolBar
            ///
            this.toolBar = new Ext.Toolbar();            
            this.toolBar.add(this.btn_comment);
            this.toolBar.add(this.btn_uncomment);
            ///
            ///textArea
            ///
            this.textArea = new Ext.form.TextArea();
            this.textArea.autoCreate = 'textarea';            
			this.textArea.enableKeyEvents = true;
            this.textArea.on('render',_this.initializeEditor,this);			
			this.textArea.on('resize',_this.textArea_onresize,this);
            ///
			///obj
			///					
			this.obj = new Ext.Panel(/*{tbar:this.toolBar}*/);
			this.obj.setTitle(this.title);
			this.obj.region = 'center';
			this.obj.closable = true;
			this.obj.layout = 'fit';
			this.obj.autoScroll = true;
			this.obj.add(this.textArea);
			this.obj.on('activate',_this.obj_onactivate,this);
			this.obj.on('deactivate',_this.obj_ondeactivate,this);
			this.obj.on('close',_this.obj_onclose,this);
        }        
    }	
});
