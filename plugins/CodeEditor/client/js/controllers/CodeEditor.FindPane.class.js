/*
 * $package: BHike
 * 
 * $description: CodeEditor.FindPane is a Ksike's JavaScript class definition that....
 * $authors: no-body
 * $created: Fri, 09 Nov 12 21:08:57 -0500
 * $license: GPL v3
 **/

Kcl.Class('CodeEditor.FindPane',
{
    extend:CodeEditor.FindPane,
    behavior:{
        construct: function(params){
            var _this = CodeEditor.FindPane.prototype;            
        },
        show : function(){
			this.obj.show();
			this.cmb_searchKey.focus(true,true);
		},
		cmb_searchKey_onkeypress : function(cmp, e){			
			if(e.getKey() == 13)			
			{
				e.stopEvent();
				///ActiveDocument
				var activeDocument = std.mod.CodeEditor.getActiveDocument();
				if(activeDocument){
					var find = activeDocument.editor.execCommand('find');
					//(this.cmb_searchKey.getValue());
				}
			}
		},
		btn_close_onclick : function(){
			this.obj.hide();
		},
		find : function(key){		
			if(!this.obj.isVisible())
				this.obj.show();
			else
				this.obj.focus();
			if(key){
				var record = new Ext.data.Record({value:this.cmb_searchKey.getStore().getCount(),content:key})
				this.cmb_searchKey.getStore().add(record);
				this.cmb_searchKey.setValue(record.data.content);
			}
			else if(this.cmb_searchKey.getStore().getCount() > 0){
				this.cmb_searchKey.select(0,false);
			}
		}
    }
});
