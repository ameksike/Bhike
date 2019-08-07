/**
 *
 * Description: MainToolBar es libria principal para la administracion de las interfaces
 * Authors: ing Antonio Membrides Espinosa
 * Making Date: 22/12/2010
 * Update Date: 22/12/2010
 *
 * @package: app
 * @subpackage: js
 * @version:
 *
 */
Kcl.Class("Main.ToolBar",{
    property:{
        obj:null
    },
    behavior:{
        construct:function(){
            this.buildGUI();
        },
        buildGUI:function(){
			///
			///btn_new
			///
			this.btn_newFile = new Ext.Button();
			this.btn_newFile.iconCls = 'icon-new-file';
			this.btn_newFile.setTooltip("New");		
			///
			///btn_open
			///
			this.btn_openFile = new Ext.SplitButton();
			this.btn_openFile.iconCls = 'icon-open-file';
			this.btn_openFile.setTooltip("Open");
			this.btn_openFile.menu = new Ext.menu.Menu();
			///
			///btn_save
			///
			this.btn_save = new Ext.Button();
			this.btn_save.disabled = true;
			this.btn_save.iconCls = 'icon-save';
			this.btn_save.setTooltip("Save Selected");
			///
			///btn_saveAll
			///
			this.btn_saveAll = new Ext.Button();
			this.btn_saveAll.disabled = true;
			this.btn_saveAll.iconCls = 'icon-save-all';
			this.btn_saveAll.setTooltip("Save All");
			///
			///btn_cut
			///
			this.btn_cut = new Ext.Button();
			this.btn_cut.disabled = true;
			this.btn_cut.iconCls = 'icon-edition-cut';
			this.btn_cut.setTooltip("Cut");
			///
			///btn_copy
			///
			this.btn_copy = new Ext.Button();
			this.btn_copy.disabled = true;
			this.btn_copy.iconCls = 'icon-edition-copy';
			this.btn_copy.setTooltip("Copy");
			///
			///btn_paste
			///
			this.btn_paste = new Ext.Button();
			this.btn_paste.disabled = true;
			this.btn_paste.iconCls = 'icon-edition-paste';
			this.btn_paste.setTooltip("Paste");
			///
			///btn_undo
			///
			this.btn_undo = new Ext.Button();
			this.btn_undo.disabled = true;
			this.btn_undo.iconCls = 'icon-undo';
			this.btn_undo.setTooltip("Undo");
			///
			///btn_redo
			///
			this.btn_redo = new Ext.Button();
			this.btn_redo.disabled = true;
			this.btn_redo.iconCls = 'icon-redo';
			this.btn_redo.setTooltip("Redo");
			///
			///obj
			///
            this.obj = new Ext.Toolbar();
            this.obj.add(this.btn_newFile);  
            this.obj.add(this.btn_openFile);          
            this.obj.add(this.btn_save);
            this.obj.add(this.btn_saveAll);
            this.obj.add('-');
            this.obj.add(this.btn_cut);
			this.obj.add(this.btn_copy);
			this.obj.add(this.btn_paste);
            this.obj.add('-');
            this.obj.add(this.btn_undo);
			this.obj.add(this.btn_redo);
			this.obj.add('-');
			this.obj.add('->');
        },
        addItem:function(toolObj,id){
            if(id && this[id]!= null){
                var com = Ext.getCmp(this[id].id);
                if(com) com.add(toolObj);
            }
            else {
                this.obj.add(toolObj);
                this.obj.doLayout();
            }
            this.obj.doLayout();
        },
        insertItem:function(obj,index){
            this.obj.insert(index,obj);
            this.obj.doLayout();
        }
    }
});
