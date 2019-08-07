<?php

/**
 *
 * @framework: Merma
 * @package: Tools
 * @subpackage: Template
 * @version: 0.1 

 * @description: TplAdmin es una libreria para el trabajo con ...
 * @authors: Yadir Hernández Batista
 * @making-Date: 10/12/2011
 * @update-Date: 12/12/2011
 * @license: GPL v2
 *
 */
use Ksike\base\helpers\Assist as kassist;
class Template {

    public static $path = "templates/";
    private static $ignore = array('.', '..', '.svn');

    public static function getTemplates($type="") {
        $tpl = array();
        $path = self::$path;
	$result = kassist::scanDir($path, $this, "categories");
        return $result;		
    }
    
      
    public static function makeTemplate() {
        
    }
    
    public static function getDependencies($cat,$type,$tpl){
        if(self::isBHikeTpl($cat,$type,$tpl)){            
            $res = self::getAll($cat, $type, $tpl);
            $info = $res['data']['dep'];
            return !$res?false:$info;
        }
        return false;
    }

    public static function getChildren($cat,$type,$tpl) {
        if(self::isBHikeTpl($cat,$type,$tpl)){            
            $res = self::getAll($cat, $type, $tpl);
            $info = $res['data']['child'];
            return !$res?false:$info;
        }
        return false;
    }
    
    public static function getReferences($cat,$type,$tpl) {
        if(self::isBHikeTpl($cat,$type,$tpl)){            
            $res = self::getAll($cat, $type, $tpl);
            $info = $res['data']['ref'];
            return !$res?false:$info;
        }
        return false;
    }
    
    public static function getInfo($cat,$type,$tpl) {
        $path = self::$path.$cat.'/'.$type.'/'.$tpl.'/inf/';
        $res = self::getAll($cat, $type, $tpl);        
        $info = $res['info'];        
        $info['image'] = $res['image']!='false'? "plugins/ProjectManager/server/templates/$cat/$type/$tpl/inf/icon.png": "plugins/ProjectManager/server/templates/$cat/$type/$tpl/inf/icon.png";        
	return !$res? false: ($info['name']==$tpl&&$info['type']==$type&&$info['category']==$cat)?$info:false;
    }
    
    public static function getAsociations($cat,$type,$tpl) {
        if(self::isBHikeTpl($cat,$type,$tpl)){            
            $res = self::getAll($cat, $type, $tpl);
            $info = $res['data']['asociations'];
            return !$res?false:$info;
        }
        return false;
    }
    
    public static function getAll($cat,$type,$tpl){
        $path = self::$path.$cat.'/'.$type.'/'.$tpl.'/inf/';
        return kassist::loader()->fileconf($path, "info", "none");
    }   
    
    public static function isBHikeTpl($cat,$type,$tpl){
        $res = self::getInfo($cat, $type, $tpl);
        return !$res?false:true;
    }
    
    public function onCloseDir($lst, $path) {
	return $lst;
    }
}

?>
