<?php
	abstract class Item {
		protected $name;
		protected $icon;
		protected $path;
		protected $description;
		protected $authors;
		protected $version;
		
		public function __construct($name,$path,$icon,$description="",array $authors=array(),$version='1.0'){
			$this->name = $name;
			$this->icon = $icon;
			$this->path = $path;
			$this->description = $description;
			$this->authors = $authors;
			$this->version = $version;			
		}
	}
