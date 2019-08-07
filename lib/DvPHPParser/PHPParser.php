<?php
/**
 *
 * @framework: Ksike
 * @package: Lib
 * @subpackage: Template
 * @version: 0.1 

 * @description: Esta driver esta diseñado para parsear codigo PHP usando el PHP-Parser Project
 * @authors: Yadir Hernandez Batista
 * @making-Date: 11/14/2011
 * @update-Date: 11/14/2011
 * @license: GPL v3
 *
 */ 
require 'PHPParser/Autoloader.php';
ini_set('xdebug.max_nesting_level', 2000);
class PHPParser extends PHPParser_Autoloader
{
	public function __construct($params){		
		self::register();
	}
	public function parseString($string){
		try {
			$parser = new PHPParser_Parser(new PHPParser_Lexer);
			$stmts = $parser->parse($string);
		} catch (Exception $e) {
			throw new Exception('Parse Error:'.$e->getMessage());
		}
		
		return $stmts;
	}
	
	public function getFileData($file){
		$fileContent = null;
		if(file_exists($file)){
			$fileContent = file_get_contents($file);
			return $this->parseString($fileContent);
		}
			
	}
	
	public function getClassData($classFile){
		
		$class_data = array();
		$stmts = $this->getFileData($classFile);		
		foreach($stmts as $i=>$v)
			if($stmts[$i]->getType() == 'Stmt_Class' ){
				$class_data['name'] = $stmts[$i]->name;
				$methods = $stmts[$i]->getMethods();
				foreach($methods as $mk=>$mv)
					if($methods[$mk]->getType() == 'Stmt_ClassMethod' )
						$class_data['methods'][] = array('name'=>$methods[$mk]->name);
			}
		return $class_data;
	}
	
	
}
