<?php
	use Ksike\ksl\filter\control\Plugin; 
	use Ksike\ksl\base\helpers\Assist;
	use Ksike\ksl\base\bundles\Package;
	
	class ProjectManager extends Plugin 
	{
		private $route_to_tpl;
		private $default_workspace;
		private $items;
		private $config;
		public static $algo = 1000;
		
		public function __construct() {
			$this->config = Assist::package("config")->load( Assist::router("this")."cfg/" , "config");
			$this->route_to_tpl = Assist::router("proj") . Assist::package("config")->Main['template']['path'];
			$this->default_workspace = realpath(Assist::router("proj").$this->config['workspace'])."/";
			$this->items = array();
			//$templateParameters = Assist::package("config")->load( Assist::router("module","Main")."data/templates/defaults/" , "parameters");
			//Assist::loader("supply", new ProjLoader);
		}
		
		public function initialize($params) {
			return array('workspace' => $this->default_workspace,'metadataFolderName'=>$this->config['metadata']['default']['foldername']);			
		}
		
		public function buildComponent($params) {
			try {
				$templateParameters = Assist::package("config")->load( Assist::router("module","Main")."data/templates/defaults/" , "parameters");
				$basics = array();
				$basics = array_merge_recursive((array)$params,(array)$params->customParameters);
				$parameters = array_merge($templateParameters,$basics);
				$manager = $params->manager;
				$manager = ManagerBridge::$manager();
				$result =  $manager->buildComponent($params->template,$parameters);
				if($result) {
					return array("success"=>true,"project"=>$params->location);
				}
			}
			catch(Exception $e) { return array("success"=>false,"msg"=>$e->getMessage());}
		}
		
		public function updateBuildingStatus($params) {
			$val = $params->value;
			self::$algo -= $val;			
		}
		
		///template management
		public function getTemplatesData($params) {
			$bhbuild = Assist::driver("BHBuild");
			$location = Assist::router("module","Main") . $this->config['templates']['location'];
			$filters = array();
			if(isset($params->filters)) $this->extractFilters($params->filters,$filters);
			$data = $bhbuild->resolveTemplatesData($params->category,$location,$params->type,$filters);
			return isset($data["success"]) && !$data["success"] ? array("success"=>$data["success"],"msg"=>$data['msg']) : array("success"=>true,"data"=>$data);
		}
		
		private function extractFilters (array $filterObj,array &$array) {			
			foreach($filterObj as $obj) foreach($obj as $k=>$v) $array[$k] = $v;
		}
		
		public function removeItems($params) {
			$deletedFiles = array();
			$manager = new ManagerBridge();
			$result = $manager->removeItems($params->location,$params->items,$deletedFiles);
			return !$result ? array("success"=>true,"files"=>$deletedFiles,"msg"=>"All files where removed successfuly!") : array("success"=>false,"msg"=>"Failed!");
		}
		
		public function openProject($params) {
			$manager = new ManagerBridge();
			$metadata = $manager->getMetadata($params->path);
			$this->registerRecentProject($metadata['data']['project']['data']['name'],$params->path);
			return $metadata;		
		}		
				
		public function getItems($data){
			try{
				$manager = new ManagerBridge();
				$content = $manager->getItems($data->projectLocation,$data->contentBranch);
				//$content['manager'] = $data->manager;
				$content['path'] = $data->projectLocation.$data->contentBranch;
				return array("success"=>true,"data"=>$content);
			}
			catch(Exception $e){
				return array("success"=>false,"msg"=>$e->getMessage());
			}
		}
		
		///<section name="RECENT PROJECTS">
		public function loadRecentProjects($params) {
			$rdata = $this->getRecentData();$recents = array();	$cant = 0;
			foreach($rdata['src'] as $k=>$p) {
				if(isset($rdata['count']) && ($cant++ == $rdata['count']) ) break;
				$manager = new ManagerBridge();
				$data = $manager->getMetadata($p);				
				if( $data["success"] ) {					
					$recents[$k] = array(
						'path'=>$p,
						'description'=>$manager->getProjectDescription($p),
						'icon'=>$manager->getProjectIcon($p)
					);
				}
				else $recents[$k] = array('path'=>$p,'status'=>$data["msg"]);
				
			}
			return array('success'=>true,'data'=>$recents);
		}
		
		private function getRecentData() {
			$route = Assist::router("this").$this->config['recent']['info']['location'];
			$filename = $this->config['recent']['info']['filename'];			
			if(is_file("$route$filename".KCL_EXT)) {
				$cfg = Assist::package("config")->load($route, $filename);
				$data = array('count'=>$cfg['project']['recent']['count']);
				foreach($cfg['project']['recent']['src'] as $k=>$v){ $data['src'][$k] = $v; }
				return $data;
			}
			return false;
		}
		
		public function removeRecentProject($params) {			
			$rdata = $this->getRecentData(); $data = array('count'=>$rdata['count']);
			foreach($rdata['src'] as $name=>$path)
				if($name != $params->name && $path != $params->path) 
					$data['src'][] = array('name'=>$name, 'path'=>$path);
			return array("success"=>($this->pushRecentData($data) !== FALSE),"msg"=>$params->name. " project removed from recents.");
		}
		
		public function registerRecentProject($projName='',$projPath='../../projects/') {
			$recentData = $this->getRecentData();
			$data = array('count'=>$recentData['count'],'src'=>array(array('name'=>$projName,'path'=>$projPath)));
			foreach($recentData['src'] as $name=>$path)
				if( $name != "" && $path != "" && "$path$name" != $projPath.$projName )
					$data['src'][] = array('name'=>$name,'path'=>$path);
			//MAKE DATA PERSIST Assist::package("config")->save($this->cache, $path, "publisher", "PHP/XML/BH*");
			return ($this->pushRecentData($data) !== FALSE);
		}
		
		private function pushRecentData ($data) {
			$route 		 = $this->config['recent']['info']['location'];
			$filename	 = $this->config['recent']['info']['filename'];
			$tplLocation = $this->config['recent']['template']['location'];
			$tplName 	 = $this->config['recent']['template']['filename'];
			$tplExt	 	 = $this->config['recent']['template']['extension'];
			$tpl = Assist::router()->this."$tplLocation$tplName.$tplExt";
			$path = Assist::router()->this."$route$filename".KCL_EXT;
			$twig = Assist::driver("Twig");
			$out = $twig->tplString2Doc(file_get_contents($tpl),$data);//tplFile2Doc($tpl,Assist::router()->this."cache/recent.php",$data);
			return file_put_contents($path,$out);
		}
		///</section>
				
		public function makeProject($params) {
			$params->core = '../../';      
			$path = $this->route_to_tpl;
			$myproj = new Dev_Project(
				$this->objToArray($params),
				$params->path,
				$params->type,
				$params->optionalDir,
				$params->app->type,
				$params->app->optionalDir,
				$path
			);

			//print_r(json_encode($params->proj->optionalDir));die;
			foreach ($params->plugins as $i) {
				$data = $this->objToArray($i->data);
				$myproj->addPugin($data, $i->tpl, $i->optionalDir, $path . $i->tplPath);
			}

			$myproj->build();
			
			$this->updateMetadata($params);
			
			return array(
				//"action"=>"makeProject",
				"success" => true,
				"path" => $params->path.$params->name."/"
			);
		}
			
		public function updateMetadata($params) {
			$date = date(DATE_RFC822);
			//print_r($params); die;
			//$date = date(DATE_ATOM, mktime(date("h"), date("min"), date("s"),date("m")-1,date("d"),date("Y")));
			$params->serial = md5($params->name . '-' . $date);
			$params->creation_date = $date;
			$params->version = "1.0";
			
			$fpath = $params->path."/$params->name/";
			$fileTpl = realpath(Assist::router("this").$this->config['metadata']['path']);
			$ext = $this->config['metadata']['folder']['ext'];
			Hard_Manager::makeDir($fpath, $ext);
			Hard_Manager::createFileFromTpl($this->route_to_tpl ."project/$params->type".'/project.xml',$fpath.$ext."/project.xml",$this->objToArray($params));
			
		}
		
		public function getPhisicalContent($params) {
			try{
				$res = Assist::package("dir")->scan($params->path.$params->branch, "-i",$this);
				$lst = array();
				if ($res != false) {
					$array = array();
					foreach ($res['dir'] as $d)
						if ($d != $this->config['metadata']['folder']['ext']) {
							$array['name'] = $d;
							$array['container'] = true;
							$lst[] = $array;
						}
					foreach ($res['file'] as $d) {
						$array['name'] = $d;
						$array['container'] = false;
						$lst[] = $array;
					}
					return array('success'=>true,'content' => $lst);
				}
				else
					return array('success'=>true,'content' => $lst);
			}
			catch(Exception $e){
				return array('success'=>false, 'msg'=>$e->getMessage());
			}
			
		}
				
		public function getProjectDependencies($params) {
			return array('info' => array('category' => 'Joder'));
		}
		
		public function getTemplates($params){
			$data = array();
			$type = strtolower($params->type);
			try{
				$result = Assist::package("dir")->scan($this->route_to_tpl."/$type/", "-i", $this);   
				
				foreach ($result["dir"] as $component) {
					Tpl_Admin::$path = $this->route_to_tpl;
					$cmp = Tpl_Admin::getData($type, $component);
					if(!isset($cmp['Hidden']) || ( isset($cmp['Hidden']) && $cmp['Hidden'] != 'true') ) {
						$cmp['Icon'] != null ? $cmp['Icon'] = Assist::router("this")->relative . Assist::package("config")->Main['template']['path'] . "$type/$component/" . $cmp['Icon'] : $cmp['Icon'] = Assist::router("web") . "plugins/ProjectManager/client/img/defaults/template/icons/$type.png";
						if($cmp['TemplateID'] == null)
							$cmp['TemplateID'] = $component;
						$data[] = $cmp;
					}
				}
			}
			catch(Exception $e)
			{
				return array('success'=>false,'msg'=>$e->getMessage());
			}
			return array('success'=>true,'data'=>$data);
		}
		
		public function getProjectTemplates($params) {
			$result = Assist::package("dir")->scan($this->route_to_tpl . '/project/', "-i",$this);
			$lst = array();
			foreach($result['dir'] as $d){
				Tpl_Admin::$path = $this->route_to_tpl;
				$data = Tpl_Admin::getData('project', $d);
				$wzextension = Tpl_Admin::getWizardExtension('project', $d);
				$wzdata = Tpl_Admin::getWizardData('project', $d);
				if ($data != false) {
					$array = array();
					if (($data['Hidden'] === null) || ($data['Hidden'] == 'false')) {
						$array['name'] = $data['Name'];
						$array['description'] = $data['Description'];
						$data['Icon'] != null ? $array['icon'] = Assist::router("this")->relative . Assist::package("config")->Main['template']['path'] . "project/$d/" . $data['Icon'] : $array['icon'] = Assist::router("web") . "plugins/ProjectManager/client/img/defaults/icons/icon.png";
						if ($data['PreviewImage'] != null)
							$array['previewimage'] = $data['PreviewImage'];
						if ($data['ProjectType'] != null)
							$array['projecttype'] = $data['ProjectType'];
						if ($data['ProjectSubType'] != null)
							$array['projectsubtype'] = $data['ProjectSubType'];
						if ($data['SortOrder'] != null)
							$array['sortorder'] = $data['SortOrder'];
						if ($data['EnableLocationBrowseButton'] != null)
							$array['enablelocationbrowsebutton'] = $data['EnableLocationBrowseButton'];
						if ($data['LocationField'] != null)
							$array['locationfield'] = $data['LocationField'];
						if ($data['RequiredFrameworkVersion'] != null)
							$array['requiredframeworkversion'] = $data['RequiredFrameworkVersion'];
						
						/// WizardExtension
						if($wzextension['Item'] != null){
							if(is_array($wzextension['Item'])){
								$fclassName = array();
								foreach($wzextension['Item'] as $fcname)
									$fclassName[] = Assist::router("this")->relative . Assist::package("config")->Main['template']['path'] . "project/$d/"  . $fcname;								
								$wzextension['Item'] = $fclassName;
							}
							else
								$wzextension['Item'] = Assist::router("this")->relative . Assist::package("config")->Main['template']['path'] . "project/$d/"  . $wzextension['Item'];
							$array['wizardextension'] = $wzextension;
						}
						
						///WizardData
						if($wzdata != null)
						$array['wizarddata'] = $wzdata;
						
						$lst[] = $array;
					}
				}		
			}
			return $lst;		
		}
		
		public function getAppTemplates($params) {
			$projecttype = $params->projecttype; //Assist::request("projecttype", "REQUEST");
			$result = Assist::package("dir")->scan($this->route_to_tpl . "/app/", "-i", $this);
			$lst = array();
			foreach ($result["dir"] as $application) {
				Tpl_Admin::$path = $this->route_to_tpl;
				$res = Tpl_Admin::getData('app', $application);

				if ($res != null && $this->isOfType($res['ProjectType'], $projecttype)) {
					$app = array();
					if (($res['Hidden'] === null) || ($res['Hidden'] == 'false')) {
						$app['name'] = $res['Name'];
						$app['description'] = $res['Description'];
						$res['Icon'] != null ? $app['icon'] = Assist::router("this")->relative . Assist::package("config")->Main['template']['path'] . "app/$application/" . $res['Icon'] : $app['icon'] = Assist::router("web") . "plugins/ProjectManager/client/img/defaults/icons/app.png";
						if ($res['PreviewImage'] != null)
							$app['previewimage'] = $res['PreviewImage'];
						if ($res['ProjectType'] != null)
							$app['projecttype'] = $res['ProjectType'];
						if ($res['ProjectSubType'] != null)
							$app['projectsubtype'] = $res['ProjectSubType'];
						if ($res['SortOrder'] != null)
							$app['sortorder'] = $res['SortOrder'];
						else
							$app['sortorder'] = 100;    
						if ($res['EnableLocationBrowseButton'] != null)
							$app['enablelocationbrowsebutton'] = $res['EnableLocationBrowseButton'];
						else
							$app['enablelocationbrowsebutton'] = "true";
						if ($res['LocationField'] != null)
							$app['locationfield'] = $res['LocationField'];
						else
							$app['locationfield'] = 'Enabled';
						if ($res['RequiredFrameworkVersion'] != null)
							$app['requiredframeworkversion'] = $res['RequiredFrameworkVersion'];

						$lst['info'][] = $app;
					}                
				}
			}
			return $lst;
		}
		
		public function getProjectItems($params) {
			$lst = array();
			
			$result = Assist::package("dir")->scan($this->route_to_tpl . '/project/', "-i", $this);
				 
			foreach ($result['dir'] as $p)
				if ($p == $params->projecttype) {
					Tpl_Admin::$path = $this->route_to_tpl;
					$projectContent = Tpl_Admin::getContent('project', $p);
					
					$app = '';
					
					$result = Assist::package("dir")->scan($this->route_to_tpl . '/application/', "-i", $this);                
					foreach ($result['dir'] as $a)
						if ($a == $params->application){
							$app['data'] = Tpl_Admin::getData('application', $a);
							$app['content'] = Tpl_Admin::getContent('application', $a);                        
						}
						
					$lst[] = array(
						'name'=>'app',
						'description'=>  $app['data']['Description'],
						'type'=>$app['data']['Name'],
						'content'=> $this->formatContent($app['content']['Container'])
					);
					$this->formatContent($projectContent['Container'],$lst);
				}
				
			return $lst;
		}
		
		private function formatContent($content,&$result=array()){
			if(isset ($content['Item'])){
				if(isset($content['Item']['@attributes']) || isset($content['Item']['@attributes'])){
					$result[] = array(
						'name'=> $content['Item']['Value'],
						'description'=>$content['Item']['@attributes']['Description']
					);
				}
				else
					foreach($content['Item'] as $i)
						$result[] = array(
							'name'=> $i['Value'],
							'description'=>$i['@attributes']['Description']
						);
			}
			
			if(isset ($content['Folder'])){
				if(isset($content['Folder']['@attributes']) || isset($content['Folder']['@attributes'])){
					$result[] = array(
						'name'=> $content['Folder']['@attributes']['Name'],
						'description'=>$content['Folder']['@attributes']['Description'],
						'content'=>  $this->formatContent($content['Folder'])
					);
				}
				else
					foreach($content['Folder'] as $f)
						$result[] = array(
							'name'=> $f['@attributes']['Name'],
							'description'=>$f['@attributes']['Description'],
							'content'=>  $this->formatContent($f)
						);
			}
			
			return $result;    
		}

		private function isOfType($ttypes, $types) {
			if ($ttypes == $types)
				return true;
			$types = explode('/', $types);
			$ttypes = explode('/', $ttypes);
			foreach ($types as $t)
				foreach ($ttypes as $tt)
					if ($tt == $t)
						return true;
			return false;
		}

		private function buildItemsTree($data, $l, $parent) {
			
		}

		private function findChildByName($name, $node) {
			foreach ($node as $k => $v) {
				if ($v['name'] == $name)
					return $v;
			}
			return false;
		}		
	}
?>
