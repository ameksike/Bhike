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

Kcl.Class('ProjectManager.Item', 
{	
	extend: ProjectManager.Object,
	property:{},
    behavior:{
		construct : function(params) {
			this.template = new ProjectManager.Template();
			this.customParameters = new Array();
			this.name = params && typeof(params.name) == "string" ? params.name : "";
			this.manager = params && typeof(params.manager) == "string" ? params.manager : "Default";
			this.safename = params && typeof(params.safename) == "string" ? params.safename : "";
			this.location = params && typeof(params.location) == "string" ? params.location : "";
		}
    }
});

