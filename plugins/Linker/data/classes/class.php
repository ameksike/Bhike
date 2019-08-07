<?php

use Ksike\filter\control\Plugin;
use Ksike\base\helpers\Assist as kassist;
use Ksike\base\bundles\Package;

class ProjectManager extends Plugin {
    /*
     * build a project fisically
     */

    private $route_to_tpl;
    private $route_to_workspace;
    private $items;
    private $config;

    public function __construct() {
        $this->config = kassist::loader()->fileconf( kassist::router("this")."cfg/" , "config", "none");
        $this->route_to_tpl = kassist::router("proj") . kassist::package("config")->Main['template']['path'];
        
        $this->items = array();
        kassist::loader("supply", new ProjLoader);
    }
    
    public function initialize() {
		$path = kassist::router("this")."cfg/";
		$config = kassist::loader()->fileconf($path, "config", "none");
		$workspacePath = realpath(kassist::router("proj").$config['workspace']);	
		
		$recent = $this->loadRecentProjectsData();
			
        return array('workspace' => $workspacePath."/",'recent_projects'=>$recent);
    }
    
    public function loadRecentProjectsData(){
		$path = kassist::router("this")."cfg/";
		$config = kassist::loader()->fileconf($path, "config", "none");
		///RECENT PROJECTS
		$recentConf = kassist::loader()->fileconf($path,$config['project']['recent']['data'],'none');
		$recent = array();
		foreach($recentConf['project']['recent']['src'] as $k=>$v){
			$recent[] = array('name'=>$k,'path'=>$recentConf['project']['recent']['src'][$k]['path'],'icon'=>$recentConf['project']['recent']['src'][$k]['icon']);
		}
		return $recent;
	}
	
	private function updateRecentProjectsData($currentProject){
		$path = kassist::router("this")."cfg/";
		$config = kassist::loader()->fileconf($path, "config", "none");
		///RECENT PROJECTS
		$recentConf = kassist::loader()->fileconf($path,$config['project']['recent']['data'],'none');
		$recent = array();
		
		
	}

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
    
    public function buildComponent($params){		
		try{
			$params->date = date(DATE_RFC822);
			$tplPath = $this->route_to_tpl;
			$component = new Dev_Item(
				$this->objToArray($params),
				$params->path,
				$params->tpl,
				$tplPath
			);
			$component->build();
		}
		catch(Exception $e){
			print_r($e->getMessage());
		}
	}
  
  	public function ReBuildThis($params){		
		try{
			$params->date = date(DATE_RFC822);
			$tplPath = $this->route_to_tpl;
			$component = new Dev_Item(
				$this->objToArray($params),
				$params->path,
				$params->tpl,
				$tplPath
			);
			$component->build();
		}
		catch(Exception $e){
			print_r($e->getMessage());
		}
	}
    
    public function updateMetadata($params){
		$date = date(DATE_RFC822);
        //print_r($params); die;
        //$date = date(DATE_ATOM, mktime(date("h"), date("min"), date("s"),date("m")-1,date("d"),date("Y")));
        $params->serial = md5($params->name . '-' . $date);
        $params->creation_date = $date;
        $params->version = "1.0";
        
        $fpath = $params->path."/$params->name/";
		$fileTpl = realpath(kassist::router("this").$this->config['metadata']['path']);
        $ext = $this->config['metadata']['folder']['ext'];
        Hard_Manager::makeDir($fpath, $ext);
        Hard_Manager::createFileFromTpl($this->route_to_tpl ."project/$params->type".'/project.xml',$fpath.$ext."/project.xml",$this->objToArray($params));
        
    }
    
    public function openProject($params){
		return $this->getMetadata($params);		
	}

    public function getMetadata($params) {
		$result = array();
		$ext = $this->config['metadata']['folder']['ext'];
		try{
			$data = kassist::loader()->fileconf($params->path . $ext."/", "project", "none");
			if( $data==null || !isset($data['BHProject']))
				return array('success'=>false,'msg'=>"Error while loading project metadata.");
			
			$result['project']['data'] = $data['BHProject']['ProjectData'];
			$result['project']['data']['Path'] = $params->path;
			$result['project']['data']['type'] = $data['BHProject']['@attributes']['Type'];
			$result['project']['data']['version'] = $data['BHProject']['@attributes']['Version'];
			$result['project']['session'] = $data['BHProject']['SessionData'];
		}catch(Exception $e){
			throw new Exception();
		}
        
        return array('success'=>true,"data" => $result);
    }
	
    public function getPhisicalContent($params) {
		try{
			$res = kassist::scanDir($params->path.$params->branch, $this, 'content');
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
			$result = kassist::scanDir($this->route_to_tpl . "/$type/", $this);   
			
			foreach ($result["dir"] as $component) {
				Tpl_Admin::$path = $this->route_to_tpl;
				$cmp = Tpl_Admin::getData($type, $component);
				if(!isset($cmp['Hidden']) || ( isset($cmp['Hidden']) && $cmp['Hidden'] != 'true') ) {
					$cmp['Icon'] != null ? $cmp['Icon'] = kassist::router("this")->relative . kassist::package("config")->Main['template']['path'] . "$type/$component/" . $cmp['Icon'] : $cmp['Icon'] = kassist::router("web") . "plugins/ProjectManager/client/img/defaults/template/icons/$type.png";
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
        $result = kassist::scanDir($this->route_to_tpl . '/project/', $this, 'category');

        $lst = array();
        foreach ($result['dir'] as $i) {
            Tpl_Admin::$path = $this->route_to_tpl;
            $data = Tpl_Admin::getData('project', $i);
            $wzextension = Tpl_Admin::getWizardExtension('project', $i);
            $wzdata = Tpl_Admin::getWizardData('project', $i);
            if ($data != false) {
                $array = array();
                if (($data['Hidden'] === null) || ($data['Hidden'] == 'false')) {
                    $array['name'] = $data['Name'];
                    $array['description'] = $data['Description'];
                    $data['Icon'] != null ? $array['icon'] = kassist::router("this")->relative . kassist::package("config")->Main['template']['path'] . "project/$i/" . $data['Icon'] : $array['icon'] = kassist::router("web") . "plugins/ProjectManager/client/img/defaults/icons/icon.png";
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
								$fclassName[] = kassist::router("this")->relative . kassist::package("config")->Main['template']['path'] . "project/$i/"  . $fcname;								
							$wzextension['Item'] = $fclassName;
						}
						else
							$wzextension['Item'] = kassist::router("this")->relative . kassist::package("config")->Main['template']['path'] . "project/$i/"  . $wzextension['Item'];
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
        $projecttype = $params->projecttype; //kassist::request("projecttype", "REQUEST");
        $result = kassist::scanDir($this->route_to_tpl . "/app/", $this);
        $lst = array();
        foreach ($result["dir"] as $application) {
            Tpl_Admin::$path = $this->route_to_tpl;
            $res = Tpl_Admin::getData('app', $application);

            if ($res != null && $this->isOfType($res['ProjectType'], $projecttype)) {
                $app = array();
                if (($res['Hidden'] === null) || ($res['Hidden'] == 'false')) {
                    $app['name'] = $res['Name'];
                    $app['description'] = $res['Description'];
                    $res['Icon'] != null ? $app['icon'] = kassist::router("this")->relative . kassist::package("config")->Main['template']['path'] . "app/$application/" . $res['Icon'] : $app['icon'] = kassist::router("web") . "plugins/ProjectManager/client/img/defaults/icons/app.png";
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
        
        $result = kassist::scanDir($this->route_to_tpl . '/project/', $this);
             
        foreach ($result['dir'] as $p)
            if ($p == $params->projecttype) {
                Tpl_Admin::$path = $this->route_to_tpl;
                $projectContent = Tpl_Admin::getContent('project', $p);
                
                $app = '';
                
                $result = kassist::scanDir($this->route_to_tpl . '/application/', $this);                
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

    /* This section is for helpers
     */

    private function objToArray($obj) {
        $lst = array();
        foreach ($obj as $key => $i)
            $lst[$key] = $i;
        return $lst;
    }

    public function onFindDir($item, $path, $type, $params='') {
        //if($type == "dir") kassist::scanDir($path.$item."/", $this, "rere");
    }

    public function onCloseDir($lst, $path) {
        return $lst;
    }

}

?>
