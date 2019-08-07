<?php

/**
 *
 * @framework: Merma
 * @package: Tools
 * @subpackage: Develop
 * @version: 0.1 

 * @description: Dev_Module es una libreria para el trabajo con ...
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 10/10/2010
 * @update-Date: 12/10/2010
 * @license: GPL v2
 *
 */
class Dev_Module extends Dev_Container {

    public $activate;
    public $projPath;

    public function __construct($data, $tpl="defaultPlugin/", $projPath="../../", $optionalDir=array(
        "css",
        "img",
        "common",
        "config",
        "include",
        "controllers",
        "views"
    ), $tplPath="templates/plugins/", $path="plugins/") {
        parent::__construct($data, $tplPath.'plugins/'.$tpl, $projPath . $path . $data["name"] . "/", $optionalDir);

        $this->dir = array("client/js", "server");
        $this->files = array(
            "client.tpl" => "client/js/" . $data["name"] . ".js",
            "server.tpl" => "server/" . $data["name"] . ".php"
        );

        $this->activate = true;
        $this->projPath = $projPath;
    }

    public function build() {
        parent::build();
        if ($this->activate)
            $this->doActivate();
    }

    public function doActivate() {
        
    }

}

?>
