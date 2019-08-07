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
    behavior:{
        buildGUI:function(params){
			var _this = CodeEditor.FindPane.prototype;
			///
            ///sbtn_findOptions
            ///
            this.sbtn_findOptions = new Ext.SplitButton();
			this.sbtn_findOptions.enableToggle = true;
			this.sbtn_findOptions.toggleGroup = 'find-replace-options';
			this.sbtn_findOptions.iconCls = "algo";
            this.sbtn_findOptions.setText("Quick Find");
            this.sbtn_findOptions.setTooltip("Find Options");
            //this.sbtn_findOption.on('click',_this.btn_comment_onclick,this);
            ///
            ///sbtn_replaceOptions
            ///
            this.sbtn_replaceOptions = new Ext.SplitButton();
			this.sbtn_replaceOptions.enableToggle = true;
			this.sbtn_replaceOptions.toggleGroup = 'find-replace-options';
			this.sbtn_replaceOptions.iconCls = "algo";
            this.sbtn_replaceOptions.setText("Quick Replace");
            this.sbtn_replaceOptions.setTooltip("Replace Options");
            //this.sbtn_replaceOptions.on('click',_this.btn_uncomment_onclick,this);                                 
            ///
            ///toolBar
            ///
            this.toolBar = new Ext.Toolbar();            
            this.toolBar.add(this.sbtn_findOptions);
			this.toolBar.add('-');
            this.toolBar.add(this.sbtn_replaceOptions);
			///
			///cmb_searchKey
			///
			this.cmb_searchKey = new Ext.form.ComboBox();
			this.cmb_searchKey.mode = 'local';
			this.cmb_searchKey.typeAhead = true;
			this.cmb_searchKey.triggerAction = 'all';
			this.cmb_searchKey.lazyRender = true;
			this.cmb_searchKey.fieldLabel = "Find";
			this.cmb_searchKey.valueField = 'content';
			this.cmb_searchKey.displayField = 'content';
			this.cmb_searchKey.store  = new Ext.data.ArrayStore({fields: ['content'],data: []});
			this.cmb_searchKey.setWidth(168);
			this.cmb_searchKey.enableKeyEvents = true;
			this.cmb_searchKey.on('keypress',_this.cmb_searchKey_onkeypress,this);
			///
			///cmb_keyPlace
			///
			this.cmb_keyPlace = new Ext.form.ComboBox();
			this.cmb_keyPlace.fieldLabel = "Look in";
			this.cmb_keyPlace.setWidth(168);
			this.cmb_keyPlace.enableKeyEvents = true;
			//this.cmb_keyPlace.on('keypress',_this.txt_searchKey_onkeypress,this);
			///
			///check1
			///
			this.check1 = new Ext.form.Checkbox();
			this.check1.boxLabel = 'Use Regular Expressions.';
			///
			///check2
			///
			this.check2 = new Ext.form.Checkbox();
			this.check2.boxLabel = 'Distinguish lower/upper cases.';
			///
			///checkboxgroup
			///
			this.checkboxgroup = new Ext.form.CheckboxGroup();
			this.checkboxgroup.hideLabel = true;
			this.checkboxgroup.columns = 2;
			this.checkboxgroup.items = [this.check1,this.check2];
			///
			///form
			///
			this.form = new Ext.form.FormPanel();
			this.form.margins = '2px 0px 2px 0px';
			this.form.labelWidth = 50;
			this.form.frame = true;
			this.form.add(this.cmb_searchKey);			
			this.form.add(this.cmb_keyPlace);
			///
			///btn_close
			///
			this.btn_close = new Ext.Button();
			this.btn_close.setText("Close");
			this.btn_close.on('click',_this.btn_close_onclick,this);
			///
			///obj
			///
			this.obj = new Ext.Window({closeAction:'hide'/*,tbar:this.toolBar*/});
			this.obj.setTitle('Find and Replace');
			this.obj.border = false;
			this.obj.resizable = false;
            this.obj.constrain = true;			
			this.obj.setWidth(250);
			this.obj.resizable = false;
			this.obj.add(this.form);
			this.obj.addButton(this.btn_close);
			this.obj.addButton({text:'some2'});
		}
    }
});
