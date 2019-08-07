ProjectConfigurationPanel.prototype.on_click_btn_expandAll = function(btn){
    this.tree.expandAll();
    btn.disable();
    this.btn_collapseAll.enable();
}

ProjectConfigurationPanel.prototype.on_click_btn_collapseAll = function(btn){
    this.tree.collapseAll();
    btn.disable();
    this.btn_expandAll.enable();
}

ProjectConfigurationPanel.prototype.on_click_btn_checkAll = function(){
    var _that = ProjectConfigurationPanel.prototype;
    var nodes = [];

    this.getNodes(this.tree.root,nodes);

    for(var i in nodes){
        if(i < nodes.length && !nodes[i].checked)
            nodes[i].ui.toggleCheck(true);
    }
    this.tree.doLayout();
}

ProjectConfigurationPanel.prototype.on_click_btn_unCheckAll = function(){
    var _that = ProjectConfigurationPanel.prototype;
    var nodes = [];
                    
    //this.getNodes(this.tree.root,nodes);
                    
    this.getNodes(this.tree.root,nodes);
    for(var i in nodes){
        if(i < nodes.length && !nodes[i].checked)
            nodes[i].ui.toggleCheck(false);
    }
    this.tree.doLayout();
}

ProjectConfigurationPanel.prototype.getOptionalDirs = function(){
    var _that = ProjectConfigurationPanel.prototype;
    var array= [];
    var node = this.tree.root;
    this.getNodes(node,array);
    var dirs = [];
    for (var i = 0; i < array.length; i++) {
        dirs[i] = array[i].attributes.branch;
    }
    return dirs;		
}

ProjectConfigurationPanel.prototype.getNodes = function(node,array){
    var _that = ProjectConfigurationPanel.prototype;
    if(node!=null){
        if(!node.isLeaf())
            node.expand();

        if(node.childNodes.length!=0 && node.isExpanded())			
            for(var i in node.childNodes){
                if(i < node.childNodes.length)
                    this.getNodes(node.childNodes[i],array);
            }
        if(node.attributes.required==false)
            array[array.length] = node;   
    }
    return array;		
}

ProjectConfigurationPanel.prototype.on_beforeselect_defaultSelectionModel = function(sm,newNode, oldNode){
    var _that = ProjectConfigurationPanel.prototype;
    this.showConfigNodeDetail(newNode);
}

ProjectConfigurationPanel.prototype.showConfigNodeDetail = function(node){
    var _that = ProjectConfigurationPanel.prototype;
    var selNode = node;
    var detailEl = this.detailsPanel.body;
    if(selNode){
        var data = { 
            type        : selNode.attributes.required ? '<b style="color:red;">Obligatory</b>':'<b style="color:green;">Optional</b>',
            description : selNode.attributes.description
        };
        detailEl.hide();
        this.template.overwrite(detailEl,data);
        detailEl.slideIn('l', {
            stopFx:true,
            duration:.1
        });
    }else{
    //detailEl.update('');
    }
}

ProjectConfigurationPanel.prototype.setData = function(data,cp){
    var _that = ProjectConfigurationPanel.prototype;
    if(this.tree.root.attributes.tplApp != data.template.name){		
        var newNode = new Ext.tree.AsyncTreeNode({
            text       : data.appName,
            icon       : data.template.icon,
            requesting : 'folder',
            tplCat     : data.template.category,
            tplProj    : data.template.proj,
            app        : data.template.name,
            branch     : '/',
            expanded   : true,
            required   : true,
            description: 'This folder is the root folder of the project. It is the container of all resources that you will be using during the development of the project.'
        });
        
        this.tree.setRootNode(newNode);
        this.tree.getSelectionModel().select(this.tree.root);
        this.dependenciesManagerPanel.setData(data);
    }
    if(this.tree.root.text != data.appName)
        this.tree.root.setText(data.appName);
}

ProjectConfigurationPanel.prototype.on_activate_obj = function(loader,node,obj) {
	if(this.tree.root.attributes.type != this.project.attributes.type || this.tree.root.firstChild.attributes.type != this.project.app.attributes.type){
		var params = {
			callback:ProjectConfigurationPanel.prototype.loadContent.createDelegate(this),
			data:{
				projecttype:this.project.attributes.type,
				application:this.project.app.attributes.type
			}
		};
		std.mod.ProjectManager.getProjectItems(params);
	}
}

ProjectConfigurationPanel.prototype.loadContent = function(loader,success,response){
    response = Ext.util.JSON.decode(response.responseText);
    var result = ProjectConfigurationPanel.prototype.buildTree(response);
    this.tree.root.removeAll(true);
    this.tree.root.setText(this.project.attributes.name);
    this.tree.root.setIcon(this.project.icon);
    this.tree.root.attributes.description = this.project.description;
    this.tree.root.attributes.type = this.project.attributes.type;
    for(var i = 0; i<result.length;i++){
		if(result[i].attributes.name == 'app'){
			result[i].setIcon(this.project.app.icon);			
		}
		this.tree.root.appendChild(result[i]);		
	}
}

ProjectConfigurationPanel.prototype.buildTree = function (arr){
	var array = Array();
	for(var obj in arr){
		var node = new Ext.tree.TreeNode();
		if(arr[obj].name == 'app')
			node.attributes.type = arr[obj].type;
		node.text = node.attributes.name = arr[obj].name;
		node.attributes.description = arr[obj].description;
		if(arr[obj].content != null){
			node.attributes.leaf = false;
			var result = ProjectConfigurationPanel.prototype.buildTree(arr[obj].content)
			if(result.length > 0)
				for(var i = 0; i<result.length;i++)
					node.appendChild(result[i]);
			else
				node.appendChild({text:'[Empty folder]',leaf:true,cls:'x-tree-noicon'});
		}
		else
			node.leaf = true;
		array[obj] = node;	
	}
	return array;
}

ProjectConfigurationPanel.prototype.on_beforeclick_tree = function(node,e) {
    if(node.attributes.required)
        node.ui.toggleCheck(true);
}
