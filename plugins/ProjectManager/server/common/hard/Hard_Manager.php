<?php

/**
 *
 * @framework: Merma
 * @package: Tools
 * @subpackage: Develop
 * @version: 0.1 

 * @description: HardManager es una libreria para el trabajo con ...
 * @authors: ing. Antonio Membrides Espinosa
 * @making-Date: 10/10/2010
 * @update-Date: 12/10/2010
 * @license: GPL v2
 *
 */
class Hard_Manager {

    public static function makeDir($path, $files) {
        if (!file_exists($path))
            mkdir($path, 0777, true);
        switch (gettype($files)) {
            case "array" :
                foreach ($files as $i)
                    if (!file_exists($path . $i))
                        mkdir($path . $i, 0777, true);
                break;
            default:
                if (!file_exists($path . $files))
                    mkdir($path . $files, 0777, true);
                break;
        }
    }

    public static function createFileFromTpl($fileTpl, $fileOut, $values) {
        $GLOBALS = $values;
        if (file_exists($fileTpl)) {
            $tpl = file_get_contents($fileTpl);
            ob_start();
            $tpl = self::formatTplPHP($tpl, true);
            
			eval('?><?php echo "' . $tpl . '";?><?php ');
				
            $data = self::formatTplPHP(ob_get_contents());
            file_put_contents($fileOut, $data);

            ob_end_clean();
        }else
            die("Error: La plantilla << {$fileTpl} >> No existe");
    }

    public static function formatTplPHP($data, $in=false) {
        if ($in) {
            $data = str_replace('{$', '#', $data); //... php problem by var
            $data = str_replace('$', '@', $data);  //... php problem by var
            $data = str_replace('#', '{$', $data); //... php problem by var
        }else
            $data = str_replace("@", "$", $data);  //... php problem by var
        return $data;
    }

}

?>
