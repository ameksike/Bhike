/*
 * @application: BHike
 * @version: 0.1
 * @package: alpha
 * 
 * @description: ProjectConstantsPanel is a class that implements...
 * @authors: Nosinc
 * @created: 14-oct-2011 2:39:33
 * @license: GPL v3
 **/

Kcl.Class( 'ProjectConstantsPanel', 
{
    property:{
        obj:null
    },
    behavior:{
        construct: function(params){
            var _this = ProjectConstantsPanel.prototype;
            this.lookup = {};
            _this.store = new Ext.data.GroupingStore({
                reader: new Ext.data.ArrayReader({}, ['name','value','category','description']),
                sortInfo:{field: 'name', direction: "ASC"},
                groupField:'category'                
            });
            //this.store.on('load',_this.on_load_store.createDelegate(this));
        },
        buildGUI:function(){
            var _this = ProjectConstantsPanel.prototype;
            //
            //txt_kclExt
            //
            this.txt_kclExt = new Ext.form.TextField();
            this.txt_kclExt.fieldLabel = "KCL_EXT";
            //
            //txt_kclNext
            //
            this.txt_kclNext = new Ext.form.TextField();
            this.txt_kclNext.fieldLabel = "KCL_NEXT";            
            //
            //txt_kclMain
            //
            this.txt_kclMain = new Ext.form.TextField();
            this.txt_kclMain.fieldLabel = "KCL_MAIN";            
            //
            //fieldSet1
            //
            this.fieldSet1 = new Ext.form.FieldSet();
            this.fieldSet1.title = "Designation";
            this.fieldSet1.add(this.txt_kclExt);
            this.fieldSet1.add(this.txt_kclNext);
            this.fieldSet1.add(this.txt_kclMain);
            //
            //txt_kclProj
            //
            this.txt_kclProj = new Ext.form.TextField();
            this.txt_kclProj.fieldLabel = "KCL_PROJ";
            //
            //txt_kclWeb
            //
            this.txt_kclWeb = new Ext.form.TextField();
            this.txt_kclWeb.fieldLabel = "KCL_WEB";
            //
            //fieldSet2
            //
            this.fieldSet2 = new Ext.form.FieldSet();
            this.fieldSet2.title = "Publishing";
            this.fieldSet2.add(this.txt_kclProj);
            this.fieldSet2.add(this.txt_kclWeb);
            //
            //txt_kclConfig
            //
            this.txt_kclConfig = new Ext.form.TextField();
            this.txt_kclConfig.fieldLabel = "KCL_CONFIG";
            //
            //txt_kclSrc
            //
            this.txt_kclSrc = new Ext.form.TextField();
            this.txt_kclSrc.fieldLabel = "KCL_SRC";
            //
            //txt_kclLog
            //
            this.txt_kclLog = new Ext.form.TextField();
            this.txt_kclLog.fieldLabel = "KCL_LOG";            
            //
            //txt_kclIncluder
            //
            this.txt_kclIncluder = new Ext.form.TextField();
            this.txt_kclIncluder.fieldLabel = "KCL_INCLUDER";
            //
            //txt_kclError
            //
            this.txt_kclError = new Ext.form.TextField();
            this.txt_kclError.fieldLabel = "KCL_ERROR";
            //
            //fieldSet3
            //
            this.fieldSet3 = new Ext.form.FieldSet();
            this.fieldSet3.title = "Directories";
            this.fieldSet3.add(this.txt_kclConfig);
            this.fieldSet3.add(this.txt_kclSrc);
            this.fieldSet3.add(this.txt_kclLog);
            this.fieldSet3.add(this.txt_kclIncluder);
            this.fieldSet3.add(this.txt_kclError);            
            //
            //template
            //
            this.template = new Ext.XTemplate(
                '<div class="config-details">',
                '<tpl for="."><div class="config-details-info">',
                '<b>Version:</b>',
                '<span>{version}</span>',
                '<b>Description:</b>',
                '<span>{description}</span></div>',
                '</tpl>',
                '</div>'
            );
            this.template.compile();
            //
            //detailsPanel
            //
            this.detailsPanel = new Ext.Panel({
                title:'Details',
                margins:'2 2 2 0'
            });
            this.detailsPanel.tpl = this.template;
            this.detailsPanel.region = 'east';
            this.detailsPanel.setWidth(250);
            //
            //formPanel
            //
            this.formPanel = new Ext.Panel({
                margins:'2 2 2 2',
                padding:'0 20 0 0'
            });
            this.formPanel.region = 'center';
            this.formPanel.layout = 'form';
            this.formPanel.autoScroll = true;
            this.formPanel.frame = true;
            this.formPanel.broder = false;
            this.formPanel.add(this.fieldSet1);
            this.formPanel.add(this.fieldSet2);
            this.formPanel.add(this.fieldSet3);
            //
            //obj
            //
            this.obj = new Ext.Panel({
                title:'Constants'
            });
            this.obj.layout = 'border';
            this.obj.add(this.formPanel);
            this.obj.add(this.detailsPanel);
            //this.obj.on('resize',_this.on_resize_obj);
        }	
    }	
});