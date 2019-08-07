Kcl.Class('ProjectManager.CreateNewProjectWindow',{	
	behavior:{
		buildGUI:function(params){
			var _this = ProjectManager.CreateNewProjectWindow.prototype;
			///
            ///wizard
            ///
            this.wizard.add(this.templateSelectionPanel.obj);
            ///
            ///templateSelectionPanel.form
            ///
            this.templateSelectionPanel.form.on('clientvalidation',_this.templateSelectionPanel_form_onclientvalidation,this);
            ///
            ///btn_previous
            ///
            this.wizard.btn_previous.on('click',_this.btn_previous_onclick,this);
            ///
            ///btn_next
            ///            
            this.wizard.btn_next.on('click',_this.btn_next_onclick,this);
            ///
            ///btn_finish
            ///
            this.btn_finish = new Ext.Button();
            this.btn_finish.formBind = true;
            this.btn_finish.setText("Finish");
            this.btn_finish.on('click',_this.btn_finish_onclick,this);
            ///btn_cancel
            ///
            this.btn_cancel = new Ext.Button();
            this.btn_cancel.setText("Cancel");
            this.btn_cancel.on('click',_this.btn_cancel_onclick,this);
			///
            ///obj
            ///
            this.obj = new Ext.Window();
            this.obj.setTitle("New Project");
            this.obj.setWidth(650);
            this.obj.resizable = false;
            this.obj.modal = true;
            this.obj.constrain = true;
            this.obj.iconCls = 'icon-new-project';
            //this.obj.on('resize',function(){this.doLayout(true,true);});
            this.obj.add(this.wizard.obj);
            this.obj.addButton(this.wizard.btn_previous);
            this.obj.addButton(this.wizard.btn_next);
            this.obj.addButton(this.btn_finish);
            this.obj.addButton(this.btn_cancel);
		}
	}
});
