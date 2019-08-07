Kcl.Class('ProjectManager.CreateNewProjectWindow',
{
	extend: ProjectManager.CreateNewProjectWindow,
	pattern: 'Singleton',
	behavior:{
		construct:function(manager) {
			this.manager = manager;
			this.newProject = new ProjectManager.Project();
			///
            ///wizard
            ///
            this.wizard = new BHike.Wizard();
            ///
			///templateSelectionPanel
			///
			this.templateSelectionPanel = new ProjectManager.TemplateSelectionPanel({manager:this,item:this.newProject,type:'project'});
			this.buildGUI();
		},
		on_componentBuilt : function(resp,opts) {
			console.log(resp);
		},
		btn_finish_onclick : function(btn,e) {			
			std.mod.ProjectManager.buildComponent({item:this.newProject.toJson(),on_success:this.on_componentBuilt,scope:this});			
		},
		btn_previous_onclick : function (btn,e){},
		btn_next_onclick : function (btn,e){},
		btn_cancel_onclick : function(btn,e) { this.obj.close(); },
		templateSelectionPanel_form_onclientvalidation : function(form,valid) { this.btn_finish.setDisabled(!valid); },
		show : function() { this.obj.show(); }
	}
});
