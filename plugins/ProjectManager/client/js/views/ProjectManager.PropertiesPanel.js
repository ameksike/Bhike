/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
Kcl.Class( 'ProjectManager.PropertiesPanel', 
{
    extend: Main.FloattingPanel,
    behavior:{
		construct:function(){
			this.parent.construct.apply(this, [this]);
		},
        buildGUI:function(){
			var _this = ProjectManager.PropertiesPanel.prototype;
			///
			///arrayStore
			///
			this.arrayStore = new Ext.data.ArrayStore({
				fields: [
				   {name: 'name', type: 'string'},
				   {name: 'value'},
				   {name: 'description', type: 'string'}				   
				]});
			this.arrayStore.autoDestroy = true;
            ///
            ///toolBar
            ///
            this.toolBar = new Ext.Toolbar();            
            ///
            ///gridView
            ///
            this.gridView = new Ext.grid.GridView();
            this.gridView.autoFill = true;
            this.gridView.emptyText = '<div style="padding:10px; text-align:center; font-weight:bold;">No properties available</div>';
            ///
            ///grid
            ///
            this.grid = new Ext.grid.PropertyGrid();
            this.grid.setHeight(110);
            //this.grid.store = this.arrayStore;
            this.grid.clicksToEdit = 2;
            this.grid.region = 'center';
            this.grid.view = this.gridView;
            //
            //comboBox1
            //
            this.comboBox1 = new Ext.form.ComboBox();
            this.comboBox1.region = "north";
            //
            //panel1
            //
            this.panel1 = new Ext.Panel();
            this.panel1.setHeight(60);
            this.panel1.frame = true;
            this.panel1.region = "south";
            //
            //tbItem1
            //
            this.tbItem1 = new Ext.Button();
            this.tbItem1.setText("P");
            ///
            ///tbItem1
            ///
            this.toolBar.add(this.tbItem1);
            ///
            ///obj
            ///
            this.obj = new Ext.Panel({
				title:"Properties",
				iconCls : 'icon-view-properties',			
				defaults:{border:false},
				tbar:this.toolBar,
				collapseMode:'mini',			
				tools:[{
					id:'close',
					handler:_this.toolclose_onclick,
					scope:this
				}]
			});
			this.obj.hidden = true;
			this.obj.layout = "border";
            this.obj.region = 'south';//this.obj.cloneConfig({region:'south',tbar:this.toolBar}));
            this.obj.setHeight(250);
            this.obj.border = false;
            this.obj.add(this.comboBox1);
            this.obj.add(this.grid);
            this.obj.add(this.panel1);            
        }
    }
});


