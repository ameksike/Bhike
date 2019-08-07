<?php

/**
 *
 * @framework: Merma
 * @package: Tools
 * @subpackage: Develop
 * @version: 0.1 

 * @description: Container es una libreria para el trabajo con ...
 * @authors: ing. Antonio Membrides Espinosa, Yadir Hernandez Batista
 * @making-Date: 10/10/2010
 * @update-Date: 29/02/2012
 * @license: GPL v2
 *
 */
use Ksike\ksl\base\helpers\Assist as kcl;

class Dev_Container implements Dev_Manager {

    public $extJS;
    public $extPHP;
    public $extTPL;
    public $data;
    public $optionalDir;
    protected $dir;
    protected $files;
    protected $proj;
    protected $tpl;
    protected $tplPath;
    protected $path;

    public function __construct($data, $tpl, $path, $optionalDir=null) {
        $this->extJS = "js";
        $this->extPHP = "php";
        $this->extTPL = "bhtemplate";
        $this->data = $data;
        $this->path = $path;
        $this->tpl = $tpl;
        $this->dir = array();
        $this->files = array();
        $this->optionalDir = $optionalDir;
    }

    public function build() {
        /* $this->buildObligatoryDir();
          $this->buildOptionalDir($this->optionalDir);
          $this->buildObligatoryFiles();
          $this->copyDependency(); */
		//print_r($this->path);die;
        $content = Tpl_Admin::getTemplate($this->tpl);
        $this->createItem($content['TemplateContent']['Container'],$this->path);
    }

    private function createItem($content,$container='../') {
        if (isset($content['Folder'])) {
            if (isset($content['Folder']['@attributes'])) {
                Hard_Manager::makeDir($container, $content['Folder']['@attributes']['Name']);
                $this->createItem($content['Folder'],$container.$content['Folder']['@attributes']['Name'].'/');
            }
            else
                foreach ($content['Folder'] as $f) {
                    Hard_Manager::makeDir($container, $f['@attributes']['Name']);
                    $this->createItem($f,$container.$f['@attributes']['Name'].'/');
                }
        }
        try{
            if (isset($content['Item'])) {
                if (isset($content['Item']['@attributes'])) {
                    Hard_Manager::createFileFromTpl($this->tpl . '/' . $content['Item']['@attributes']['TargetFileName'], $container . $content['Item']['Value'], $this->data);
                }
                else
                    foreach ($content['Item'] as $i)
                        Hard_Manager::createFileFromTpl($this->tpl . '/' . $i['@attributes']['TargetFileName'], $container. $i['Value'], $this->data);
            }        
        }
        catch(Exception $e){
            throw new Exception($e->getMessage().". Error during project's creation, maybe coused by template info.", $e->getCode(), $e->getPrevious());
        }
        
    }

    protected function buildObligatoryFiles() {
        foreach ($this->files as $tpl => $file)
            Hard_Manager::createFileFromTpl($this->tpl . '/' . $tpl, $this->path . $file, $this->data);
    }

    protected function buildObligatoryDir() {
        Hard_Manager::makeDir($this->path, $this->dir);
    }

    protected function buildOptionalDir($optionalDir) {
        if ($optionalDir)
            foreach ($optionalDir as $i)
                $this->makeOptionalDir($i, $this->path);
    }

    protected function makeOptionalDir($dir) {
        switch ($dir) {
            case 'plugins' : Hard_Manager::makeDir($this->path, "plugins/");
                break;
            case 'lib' : Hard_Manager::makeDir($this->path, "lib/");
                break;
            case 'tools' : Hard_Manager::makeDir($this->path, "tools/");
                break;
            case 'log' : Hard_Manager::makeDir($this->path, "log/");
                break;
            case 'include' : Hard_Manager::makeDir($this->path, "server/include");
                break;
            case 'cfg' : Hard_Manager::makeDir($this->path, "cfg/");
                break;
            case 'img' : Hard_Manager::makeDir($this->path, "client/img");
                break;
            case 'css' : Hard_Manager::makeDir($this->path, "client/css");
                break;
            case 'controllers' : Hard_Manager::makeDir($this->path, "client/js/controllers");
                break;
            case 'views' : Hard_Manager::makeDir($this->path, "client/js/views");
                break;
            case 'common' : Hard_Manager::makeDir($this->path, array("client/js/common", "server/common"));
                break;
        }
    }

    protected function copyDependency() {
        $list = $this->getConf("dependency");
        if ($list)
            foreach ($list as $Key => $i) {
                Hard_Manager::makeDir($this->path, $i);
                copy($this->tpl . "dependency/" . $Key, $this->path . $i . $Key);
            }
    }

    protected function getConf($id) {
        $driv = kcl::package("config");
        if (!$this->conf)
            $this->conf = $driv->loadFrom($this->tpl . "cfg/config.");
        return $this->conf[$id];
    }

}

?>

///////////////////////////////////////////////////
<?php

/**
 *
 * @framework: Merma
 * @package: Tools
 * @subpackage: Develop
 * @version: 0.1 

 * @description: Project es una libreria para el trabajo con ...
 * @authors: ing Antonio Membrides Epinosa, Yadir Hernández Batista
 * @making-Date: 10/12/2011
 * @update-Date: 10/12/2011
 * @license: GPL v2
 *
 */
class Dev_Project extends Dev_Container {

    private $app;
    private $plugins;

    public function __construct(
    //list of parameters
    $data, $path="../../", $tpl="Ksike/", $optionalDir=array(
        "lib",
        "tools",
        "core",
        "core/cfg",
        "plugins"
    ), $apptpl="../app/KApplication/", $optionalDirApp=array(
        "css",
        "img",
        "log",
        "common",
        "cfg",
        "include"
    ), $tplPath="templates/project/"
    ) {
        //print_r(json_encode($optionalDir));//die;
        parent::__construct($data, $tplPath . 'project/' . $tpl, $path . $data["name"] . "/", $optionalDir);

        $this->dir = array(
            "app",
            "core",
            "core/cfg",
            //bhike project statements
            ".bhproject"
        );

        $this->files = array(
            "index.php" => "index.php",
            "core/cfg/init.js" => "core/cfg/init.js",
            "core/cfg/config.php" => "core/cfg/config.php",
            //bhike project data 
            //"inf/save.php.tpl" => ".bhproject/".$data['name'].".php",
            //$data['type'] . ".xml" => ".bhproject/" . $data['name'] . ".xml"
        );
        $this->app = new Dev_Application($data, $apptpl, $this->path, $optionalDirApp, $tplPath);
    }

    public function build() {
        parent::build();
        $this->app->build();
        if (count($this->plugins) > 0)
            foreach ($this->plugins as $i)
                $i->build();
    }

    public function addPugin($data, $tpl="defaultPlugin/", $optionalDir=null, $tplPath="templates/plugins/") {
        $this->plugins[] = new Dev_Module($data, $tpl, $this->path, $optionalDir, $tplPath);
    }
    

}

?>
