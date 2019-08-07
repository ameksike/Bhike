<?php
	
	class BHBuild_Executer
	{
		public static function executeTask($task,$params) {
			$task = self::instanciate($task,$params);
			if($task instanceof BHBuild_ITask) 	return $task->execute();
			return false;
		}
		
		public function __call($method,$args) {			
			return call_user_func_array(array($this,"executeTask"),array($method,$args[0]));
		}
		
		public static function __callStatic($method,$args) {			
			return call_user_func_array(array(__CLASS__,"executeTask"),array($method,$args[0]));
		}
				
		private static function instanciate($task,$params) {
			$taskname = "BHBuild_Task_".$task;			
			$task = isset($taskname) && class_exists($taskname) ? new $taskname() : null;
			if($task instanceof BHBuild_ITask) {
				foreach($params as $k=>$v) { 
					$method = "set".ucfirst($k); 
					if(method_exists($task,$method))
						$task->$method($v);
					else print_r("Method: $method not exists in $taskname.\n");
				}
				return $task;
			}
			return false;
		}
	}
?>
