/**
 *
 * Description: MainGUIDevelop es la libreria principal para la administracion de las interfaces
 * Authors: ing Antonio Membrides Espinosa, ...
 * Making Date: 22/12/2010
 * Update Date: 22/12/2010
 *
 * @package: app
 * @subpackage: js
 * @version:
 *
 */

Kcl.Class('Main.GUIWrapper',
{
	property:{
		openedPanels:[]
	},
    behavior:{        
        buildGUI:function(){
			var _this = Main.GUIWrapper.prototype;
            Ext.BLANK_IMAGE_URL = "../../lib/ext/images/default/s.gif";
            Ext.QuickTips.init();
            ///
            ///map
            ///
            this.map = new Ext.KeyMap(document);
            this.map.addBinding({
				key: Ext.EventObject.R,
				ctrl:true,
				fn: _this.center_onSHIFTnTABpressed,
				scope:this,
              	stopEvent:true
			});
          	this.map.addBinding({
              	key: Ext.EventObject.S,
              	ctrl:true,
              	fn: _this.center_onCTRLnSpressed,
              	scope:this
          	});
          	this.map.addBinding({
              	key: Ext.EventObject.O,
              	ctrl:true,
              	fn: _this.center_onCTRLnOpressed,
              	scope:this
          	});
            ///
            ///toolBar
            ///
            this.toolBar = new Main.ToolBar();
            ///
            ///menuBar
            ///
            this.menuBar = new Main.MenuBar();            
			///
			///center
			///
            this.center = new Ext.TabPanel();
            this.center.setWidth(150);
            this.center.region = 'center';
            this.center.enableTabScroll = true;
            this.center.activeTab = 0;
            this.center.split = false;
            this.center.on('afterrender',_this.center_onafterrender,this);
            ///
            ///titleBar
            ///
            this.titleBar = new Ext.BoxComponent();
            this.titleBar.el = 'header-div';
            this.titleBar.setWidth('100%');
            ///
            ///toolBarsRegion
            ///
            this.toolBarsRegion = new Ext.Panel();
            this.toolBarsRegion.border = false;
            this.toolBarsRegion.setWidth('100%');
            this.toolBarsRegion.add(this.menuBar.obj);
            this.toolBarsRegion.add(this.toolBar.obj);           
			///
			///north
			///           
            this.north = new Ext.Panel();
            this.north.region = 'north';
            this.north.border = false;
            this.north.layout = 'vbox';
            this.north.setHeight(90);
            this.north.add(this.titleBar);
            this.north.add(this.toolBarsRegion);
			///
			///east
			///
            this.east = new Ext.Panel({//consider tabpanel 
				collapseMode:'mini',
				defaults:{border:false,split:true},
				split:true,
				layout:'fit'
            });
            this.east.region = 'east';
            this.east.setWidth(260);
            //this.east.autoScroll = true;
            this.east.hidden = true;
            this.east.collapsed = true;
            this.east.split = true;            
            /*this.east.add({id:'1',region:'center',items:[{id:'1_1'}]});
            this.east.add({id:'2',region:'center'});*/
            //this.east.add({region:'center'});
            this.east.on('beforeadd', _this.east_beforeadd,this);
            this.east.on('add',_this.east_add);
            this.east.on('beforecollapse',_this.east_onbeforecollapse,this);
			///
			///south
			///
            this.south = new Ext.Panel({
				collapseMode:'mini',
				split:true,
                addItem:function(obj){
					this.openedPanels.push(obj);	
                    this.add(obj);
                    this.show();
                    this.doLayout();
                    //this.expand();
                }
            });
            this.south.region = 'south';
            this.south.setHeight(200);
            this.south.layout = 'fit';
            this.south.hidden = true;
            this.south.collapsed = true;            
            this.south.split = true;
			///
			///west
			///
            this.west = new Ext.Panel({
				collapseMode:'mini',
				defaults:{border:false,layout:'fit',split:true},
				split:true
            });
            this.west.region = 'west';
            this.west.setWidth(200);
            //this.east.autoScroll = true;
            //this.east.layout = 'border';
            this.west.hidden = true;
            this.west.collapsed = true;
            this.west.split = true;            
            /*this.east.add({id:'1',region:'center',items:[{id:'1_1'}]});
            this.east.add({id:'2',region:'center'});*/
            //this.east.add({region:'center'});
            this.west.addItem = function(obj){
				//_this.appendItem(obj,this);					
				//candidate.add(obj);
				this.openedPanels.push(obj);
				this.add(obj);					
				this.show();
                this.doLayout();
                this.expand();
            }         
            ///
            ///statusBar
            ///
            this.statusBar = new Ext.Toolbar({items:[{text:'Status'}]});
            ///
            ///mainPanel
            ///
			this.mainPanel = new Ext.Panel({ defaults:{ },bbar:this.statusBar});
			this.mainPanel.region = 'center';
			this.mainPanel.layout = 'border';
			this.mainPanel.add(this.center);
			this.mainPanel.add(this.north);
			this.mainPanel.add(this.east);
			this.mainPanel.add(this.south);
			this.mainPanel.add(this.west);
			///
			///obj
			///						
            this.obj = new Ext.Viewport({                
                defaults:{frame:false,border:false,margins:'0px'},
                layout:'border',
                items: this.mainPanel
            });
            //this.obj.on('beforerender',_this.obj_onafterrender,this);
            ///
            ///startPage
            ///
            this.startPage = new StartPage();
            if(std.mod.Main.settings.startpage.showOnStartup){				
				this.addItem(this.startPage.obj);
			}			            
			this.toolBar.insertItem(this.startPage.btn_startpage,this.toolBar.obj.items.length);
			this.splashscreen.obj.hide();
        }
    } 
});
