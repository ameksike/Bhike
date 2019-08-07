Kcl.Class('CustomDesignInput',
    {
        property:{
            obj:null
        },
        behavior:{
            construct:function(params){
			
                this.buildGUI( params );
			
                std.FrontController.send({
                    action: 'getTplInfo',
                    controller: 'ProjectManager',
                    params:{
                        'projectTplCategory': params.projectCategory,
                        'projectTplName': params.projectTpl,
                        'appTplName'	 : params.applicationTpl
                    }
                });
            },
            buildGUI:function(params){
                var _this = CustomDesignInput.prototype;
			
                _this.obj = new Ext.Panel({
                    title:'Project Variables',
                    layout:'form'
                });
            },
            addCustomsInputs:function( params ){
                var _this = CustomDesignInput.prototype;
			
                for( var field in params ){
                    f = {
                        'id'          : field,
                        'xtype'	      : params[field].type,
                        'fieldLabel'  : params[field].label,
                        'value'	      : params[field].value	
                    }
                    _this.obj.add( f );
                }  
            },
            getInputData:function(){
                var _this = CustomDesignInput.prototype;		
                var customParams =  {};
		
                for( var f = 0 ; f < _this.obj.items.items.length ; f++ )
                {
                    customParams[_this.obj.items.items[f].id] =  _this.obj.getComponent(f).getValue() ;
                } 
			
                return customParams;
            }
        }    
    });
