/**
 * @Namespace:
 * @Class: DevStruct
 * @Description: 
 * @Authors: Nosinc
 * @Making Date: 22/12/2010
 * @Update Date: 22/12/2010
 *
 * @package: BHike
 * @subpackage: client
 * @version: 0.1 alpha
 *
 */

Kcl.Class('ProjectManager.Object', 
{	
	property:{},
    behavior:{
        set : function(a,v) {
			this[a] = v;
		},
		get : function(a) {
			if(typeof(a) == "string")	return this[a];
		},
		toJson:function() {
			var json = {};
			for(var i in this)
				if( i != "remove" && i != "_inf_" && i != "parent" && typeof(this[i]) != "function" )
					if(this[i] instanceof ProjectManager.Object)
						json[i] = this[i].toJson();
					else
						json[i] = this[i];
			return json;
		}
    }
});

