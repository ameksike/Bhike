/*
 * @package: {$GLOBALS['project']}
 * 
 * @description: {$GLOBALS['name']} is a Ksike's JavaScript class definition that....
 * @authors: no-body
 * @created: {$GLOBALS['date']}
 * @license: GPL v3
 **/

Kcl.Class('{$GLOBALS['name']}',
{
    extend:{$GLOBALS['name']},
    behavior:{
        construct: function(params){
            var _this = {$GLOBALS['name']}.prototype;
            this.buildGUI();
        }
    }
});
