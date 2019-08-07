<?php

/**
 *
 * @framework: Ksike
 * @package: Tools
 * @subpackage: Develop
 * @version: 0.1 

 * @description: Application es una libreria para el trabajo con ...
 * @authors: ing. Antonio Membrides Espinosa, Yadir Hernandez Batista
 * @making-Date: 10/10/2010
 * @update-Date: 29/02/2012
 * @license: GPL v2
 *
 */
//include_once "DevStruct.php";
class Dev_Application extends Dev_Container {

    public function __construct(
    $data, $tpl="KApplication", $projPath="../../", $optionalDir=array(
        "css",
        "img",
        "log",
        "common",
        "config",
        "include",
        "controllers",
        "views"
    ), $tplPath="templates/app/", $path="app/"
    ) {
        parent::__construct($data, $tplPath . 'app/' . $tpl, $projPath . $path, $optionalDir);

        $this->data["name"] = "Main";
        $this->dir = array(
            "cfg",
            "client/css",
            "client/images",
            "client/js",
            "server"
        );
        $this->files = array(
            "cfg/config.xml" => "cfg/config.xml",
            "client/css/main.css" => "client/css/main.css",
            "client/js/Main.js" => "client/js/Main.js",
            "server/Main.php" => "server/Main.php"/* ,
                  //"saveApp.php.tpl" => "../saveApp.php" */
        );
    }

}

?>
