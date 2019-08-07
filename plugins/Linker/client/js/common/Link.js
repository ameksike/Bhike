Kcl.Class('Link',{
	behavior:{
		construct: function(params){
			this.trigger_class = params!= null && params.trigger_class != null ? params.trigger_class : null;
			this.trigger_action = params!= null && params.trigger_action != null ? params.trigger_action : null;
			this.target_class = params!= null && params.target_class != null ? params.target_class : null;
			this.target_action = params!= null && params.target_action != null ? params.target_action : null;
			this.mode = null;
			this.active = null;
			
			this.initialize(params);
		},
		initialize : function(params){
			this.mode = params!= null && params.mode != null ? params.mode : params['@attributes'].Mode;
			this.active = params!= null && params.active != null ? params.active : params['@attributes'].Active;
		}
	}
});
