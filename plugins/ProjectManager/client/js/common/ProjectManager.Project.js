/**
 * @Namespace:
 * @Class:Project
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

Kcl.Class('ProjectManager.Project', 
{	
	extend:ProjectManager.Item,
    behavior:{
        construct: function(params){
            this.parent.construct.apply(this,arguments);
        }
    },
    loadInfo:function(path){},
    getTemplates:function(params){}
});

