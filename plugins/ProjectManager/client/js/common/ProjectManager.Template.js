Kcl.Class('ProjectManager.Template', 
{
	extend: ProjectManager.Object,
	behavior:{
        construct: function(params) {            
            this.location = params && typeof(params.location) == "string" ? params.location : undefined;
            this.type = params && typeof(params.type) == "string" ? params.type : "Project";            
            this.version = params && typeof(params.version) != null ? params.version : "1.0";
            this.name = params && typeof(params.name) == "string" ? params.name : undefined;
            this.id = params && typeof(params.id) == "string" ? params.id : undefined;
            this.category = params && typeof(params.category) == "string" ? params.category : "Installed";
        }
    },
    loadInfo:function(path){},
    getTemplates:function(params){}
});
