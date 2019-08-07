/*
 * @application: BHike
 * @version: 0.1
 * @package: ProjectManager/client/js/views/
 * 
 * @description: ProjectConfigurationPanel is a class that implements...
 * @authors: Nosinc
 * @created: 09-oct-2011 5:33:55
 * @license: GPL v3
 **/

Kcl.Class( 'ProjectConfigurationPanel', 
{
    extend:CardItem,
    property:{
        project:null,
        obj:null,
        cardReady:null
    },
    behavior:{
        construct: function(params){
            var _this = ProjectConfigurationPanel.prototype;
            this.project = params.project;
            this.treeLoader = new Ext.tree.TreeLoader();
        },
        buildGUI:function(){
            var _this = ProjectConfigurationPanel.prototype;            
            //
            //btn_expandAll
            //
            this.btn_expandAll = new Ext.Button();
            this.btn_expandAll.iconCls = 'icon-expand-all';
            this.btn_expandAll.setTooltip("Expand All");
            this.btn_expandAll.on('click',_this.on_click_btn_expandAll,this);
            //
            //btn_collapseAll
            //
            this.btn_collapseAll = new Ext.Button();
            this.btn_collapseAll.iconCls = 'icon-collapse-all';
            this.btn_collapseAll.setTooltip("Collapse All");
            this.btn_collapseAll.on('click',_this.on_click_btn_collapseAll,this);
            //
            //btn_checkAll
            //
            this.btn_checkAll = new Ext.Button();
            this.btn_checkAll.iconCls = 'icon-check-all-src';
            this.btn_checkAll.setTooltip("Check All Optional Dirs");
            this.btn_checkAll.on('click',_this.on_click_btn_checkAll,this);
            //
            //btn_unCheckAll
            //
            this.btn_unCheckAll = new Ext.Button();
            this.btn_unCheckAll.iconCls = 'icon-uncheck-all-src';
            this.btn_unCheckAll.setTooltip("Uncheck All Optional Dirs");
            this.btn_unCheckAll.on('click',_this.on_click_btn_unCheckAll,this);
            //
            //toolBar1
            //
            this.toolBar1 = new Ext.Toolbar();
            this.toolBar1.add(this.btn_expandAll);
            this.toolBar1.add(this.btn_collapseAll);
            this.toolBar1.add('-');
            this.toolBar1.add(this.btn_checkAll);
            this.toolBar1.add(this.btn_unCheckAll);
            //this.toolBar1.add("->");
            //
            //defaultSelectionModel
            //
            this.defaultSelectionModel = new Ext.tree.DefaultSelectionModel();
            this.defaultSelectionModel.on('beforeselect',_this.on_beforeselect_defaultSelectionModel,this);
            //
            //
            //rootNode
            //
            this.rootNode = new Ext.tree.TreeNode({
                typeOfNode:'folder',
                expanded:true,
                projecttype:'default'
            });
            //
            //tree
            //
            this.tree = new Ext.tree.TreePanel({
                margins:'2 2 2 2',
                tbar:this.toolBar1
            });
            this.tree.region = 'center';
            this.tree.selModel = this.defaultSelectionModel;
            this.tree.singleExpand = true;
            this.tree.setRootNode(this.rootNode);
            this.tree.useArrow = true;
            this.tree.autoScroll = true;
            this.tree.on('checkchange',_this.on_beforeclick_tree,this);
            //
            //treeSorter
            //
            this.treeSorter = new Ext.tree.TreeSorter(this.tree,{
                dir:'asc',
                folderSort:true,
                property:'name'
            });
            //
            //template
            //
            this.template = new Ext.XTemplate(
                '<div class="config-details">',
                '<tpl for="."><div class="config-details-info">',
                '<b>Required:</b>',
                '<span>{type}</span>',
                '<b>Description:</b>',
                '<span>{description}</span></div>',
                '</tpl>',
                '</div>'
                );
            this.template.compile();
            //
            //detailPanel
            //
            this.detailsPanel = new Ext.Panel({
                title:"Details",                
                margins:'2 2 2 0',
                height:300
            });
            this.detailsPanel.region = 'east';
            this.detailsPanel.tpl = this.template;
            this.detailsPanel.setWidth(250);                      
            //
            //obj
            //
            this.obj = new Ext.Panel();
            this.obj.setTitle('Source');
            this.obj.iconCls = 'icon-src';
            this.obj.layout = 'border';
            this.obj.add(this.tree);
            this.obj.add(this.detailsPanel);
            this.obj.on('activate',_this.on_activate_obj,this);
        }	
    }
});
