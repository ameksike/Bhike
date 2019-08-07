<?php

use Ksike\filter\control\Plugin;
use Ksike\base\helpers\Assist as kassist;

class OpenFileDialog extends Plugin {

    public static $path = "";
    private static $ignore = array('.', '..', '.svn');
    
    private $content;
    
    public function treeHandler($params) {
        $type = $_REQUEST['typeOfNode'];

        switch ($type) {
            case'root':
                return self::getBaseTree();
                break;
            default:
                return self::getDirectories();
                break;
        }
    }

    private function getBaseTree() {
        $_PHP_OS = PHP_OS;
        $server = $_SERVER;
        $url = $_SERVER['HTTP_REFERER'];
        $user = $_SERVER['HTTP_USER_AGENT'];
        $inf = pathinfo($url);
        //die(print_r($server));		

        $tree = array();
        switch ($_PHP_OS) {
            case 'Linux':
                $icon = self::getIcon(true); 
                $tree[] = array('text' => 'File System', 'path' => '/','icon'=>$icon);
                /* $tree[] = array('text'=>'Library',
                  'children'=>array(
                  array(
                  'text'=>'Documents',
                  'path'=>'/home/nessus/Documentos'
                  ),
                  array(
                  'text'=>'Images',
                  'path'=>'/home/nessus/Im&aacute;genes'
                  )
                  )
                  ); */
                $tree[] = array('text' => 'Computer', 'path' => '/media/','icon'=>$icon);
                $tree[] = array('text' => 'AppServ', 'path' => '/var/www/', 'expanded' => true,'icon'=>$icon);
                //$tree[] = array('text'=>'Network','children'=>self::getDirectories($path."home/nessus/Desktop"));
                break;
        }


        return $tree;
    }

    public function getDirectories($params=0) {
        $path = kassist::request("path", "REQUEST");
        $this->content = array();
        kassist::scanDir($path, $this, 'dir-content');
        
        $array = array();
        foreach($this->content['dir'] as $key){
            $key['text']=$key['name'];
            $array[]= $key;
        }    
        return $array;
    }

    public function getDirContent() {
        $path    = kassist::request("path", "REQUEST");
        $fileExt = kassist::request("extension", "REQUEST");
        $onlyFolder = kassist::request("onlyFolder", "REQUEST");
        $this->content = array();
        kassist::scanDir($path, $this, 'dir-content');
        
        $array = array();
        if(isset($this->content['dir']))foreach($this->content['dir'] as $key)
                $array['info'][]= $key;
        
        if($onlyFolder == 'false')
            foreach($this->content['file'] as $key){
                $exten = explode('.', $key['name']);
                $exten = $exten[count($exten) - 1];
                if($fileExt == '*'|| $exten == $fileExt)
                    $array['info'][]= $key;    
            }        
        if (empty($array['info']))
            $array['info']['message'] = "This Folder is empty";
        
        return $array;
    }

    private function getIcon($type, $ext="") {
        $path = "plugins/OpenFileDialog/";
        switch ($type) {
            case true:
                return $path."client/img/defaults/FileIcons/folder.png";
            case false:
                switch (strtolower($ext)) {
                    case 'php':
                        return $path. "client/img/defaults/FileIcons/php.png";
                    case 'htm':
                    case 'html':
                    case 'xml':
                        return $path. "client/img/defaults/FileIcons/xml.png";
                    case 'mp3':
                    case 'wma':
                        return $path. "client/img/defaults/FileIcons/mp3.png";
                    case 'ini':
                        return $path. "client/img/defaults/FileIcons/ini.png";
                    case 'py':
                        return $path. "client/img/defaults/FileIcons/py.png";    
                    default:
                        return $path. "client/img/defaults/FileIcons/file.png";
                }
        }
    }
    
    public function onFindDir($item, $path, $type, $params='') {
        if($params=='dir-content'){
            if($type == "dir") {
                $target = false;
                $icon = self::getIcon(true);
                $result = kassist::scanDir($path.$item."/", $this, "rere");
               if(isset($result['dir'])) foreach($result['dir'] as $r)
                    if($r == ".bhproject"){
                        $target = true;
                        $icon = "plugins/OpenFileDialog/client/img/defaults/FileIcons/bhproj.png";
                        break;
                    }

                $this->content['dir'][] = array(
                    'name'=>$item,
                    'path'=>$path.$item."/",
                    'fileType'=>'Folder',
                    'target'=>$target,
                    'icon'=>$icon,
                    'empty'=> empty ($result)
                );
            }
            else
            {
                $exten = explode('.', $item);
                $exten = $exten[count($exten) - 1];
                $icon = self::getIcon(false,$exten);
                $target = false;
                $this->content['file'][] = array(
                    'name'=>$item,
                    'path'=>$path.$item,
                    'fileType'=>'File',
                    'target'=>$target,
                    'icon'=>$icon
                );
            }
        }
       // $this->content['dir'][] = $dir;
        //$this->content['file'][] = $file;
    }

    public function onCloseDir($lst, $path) {
        return $lst;
    }

}

?>
