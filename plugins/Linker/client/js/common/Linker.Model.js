Kcl.Class('Linker.Model',{
	behavior:{
		construct:function(params){
			///CONSTRUCTOR
			this.label = null;
			this.iPorts = [];
			this.oPorts = [];
			this.targetFile = null;
			this.rect = null;
			this.initialize(params);
			this.obj = null;
		},
		initialize : function(content){
			try{
				this.label = content['@attributes'].Name;
				this.targetFile = content['@attributes'].TargetFile;
				this.iPorts = content['iPorts'] == null ? [] : typeof(content['iPorts']) == 'string' ? [].concat(this.iPorts,content['iPorts']) : content['iPorts'];
				this.oPorts = content['oPorts'] == null ? [] : typeof(content['oPorts']) == 'string' ? [].concat(this.oPorts,content['oPorts']) : content['oPorts'];
				this.rect = content['GUI'] != null && content['GUI']['rect'] != null ? content['GUI']['rect']:{x:0,y:0,width:0,height:0};
				this.shadow = true;
				this.attrs = { fill: "90-#000-green:1-#fff" };
				this.labelAttrs = { 'font-weight': 'bold', fill: 'black', 'font-size': '12px' };
			} catch(e){
				console.log("There's some fields without value. Cause: " + e);
			}
		},
		save : function(){
			var json = {};
			this.rect.x = this.getPosition().x;
			this.rect.y = this.getPosition().y;
			for(var i in this)
				if(typeof(this[i]) !== 'function' && i != 'obj')
					json[i] = this[i];
			return json;
		},
		getPosition : function(){
			return {x:this.obj.wrapper.attrs.x,y:this.obj.wrapper.attrs.y};
		},
		setRect : function(rect){
			this.rect = rect;
		},
		setObject : function(object){
			this.obj = object;
		},
		toString : function(){
			return {
				label:this.label,
				iports:this.iports,
				oports:this.oports
			};
		},
		extract : function(cosa){
			return cosa;
		}
	}
});
