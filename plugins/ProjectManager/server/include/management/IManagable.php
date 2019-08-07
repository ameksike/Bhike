<?php
	/*
	 * @name: IManagable
	 * @type: Interface
	 * @version: 1.0
	 * @authors: Yadir Hernandez Batista
	 * @description: This interface defines all manager' methods.
	 * */
	interface IManagable
	{		
		public function getProjectIcon($project);
		public function getItems($location,$branch);
		public function getProjectDescription($project);
		public function getMetadata($project);
		public function removeItems($location,$files,$deletedFiles);
		public function buildComponent($template,$parameters);
	}
?>
