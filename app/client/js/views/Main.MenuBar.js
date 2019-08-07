/**
 *
 * Description: MainMenuBar es libria principal para la administracion de las interfaces
 * Authors: ing Antonio Membrides Espinosa
 * Making Date: 22/12/2010
 * Update Date: 22/12/2010
 *
 * @package: app
 * @subpackage: js
 * @version:
 *
 */
 
Kcl.Class("Main.MenuBar",{
    property:{
        obj:null
    },
    behavior:{
        construct:function(){
            this.buildGUI();
        },
        buildGUI:function(){
			
            this.obj = new Ext.Toolbar({
                id:'mainToolBar',
                items: ['-',{
                    text:'<u>F</u>ile',
                    id: "mfile",
                    menu:[{
                        text:'<u>N</u>ew',
                        id: "mnew",
                        menu:[{
							iconCls:'icon-new-file',
							text:'File'
						}]
                    },{
                        text:'<u>O</u>pen',
                        id: "mopen",
                        menu:[{
							iconCls:'icon-open-file',
							text:'File'
						}]
                    },'-',{
                        text:'<u>A</u>dd',
                        id: "madd",
                        //disabled:true,
                        menu:[]
                    },'-',{
                        text:'<u>C</u>lose',
                        id: "mclose",
                        menu:[]
                    },{
                        text:'<u>Cl</u>ose All',
                        id: "mcloseall",
                        menu:[]
                    },'-',{
                        text:'<u>S</u>ave',
                        iconCls:'icon-save',
                        id: "msave",
                        disabled:true,
                        menu:[]
                    },{
                        text:'<u>S</u>ave All',
                        iconCls:'icon-save-all',
                        id: "msaveall",
                        disabled:true,
                        menu:[]			
                    },'-',{
                        text:'<u>R</u>ecent Project',
                        disabled:true
                    },'-',{
                        text:'Exit',
                        iconCls:'icon-exit',
                        handler:function(){
							if (confirm("Close Window?")) {
								//window.opener = window;
								self.close();								
							}
						}
                    }]
                },{
                    text:'<u>E</u>dit',
                    id: "medit",
                    menu:[{
						text:'Undo',
						disabled:true,
						iconCls:'icon-undo'
					},{
						text:'Redo',
						disabled:true,
						iconCls:'icon-redo'
					},'-',{
						text:'Copy',
						disabled:true,
						iconCls:'icon-edition-copy'
					},{
						text:'Cut',
						disabled:true,
						iconCls:'icon-edition-cut'
					},{
						text:'Paste',
						disabled:true,
						iconCls:'icon-edition-paste'
					}]          
                },{
                    text:'<u>V</u>iew',
                    id:'mview',
                    menu:[{
                        id:'tooltip_btn_dbexplorer',
                        text:'DB Explorer',
                        iconAlign:'right',
                        checked:false
                    },{
                        id:'tooltip_btn_sqlassistant',
                        text:'SQL Assistant',
                        iconAlign:'right',
                        checked:false
                    },{
                        text:'<u>T</u>oolbars',
                        id:'mview-toolbars',
                        menu:[]
                    }]
                },{
                    text:'<u>T</u>ools',
                    id: "mtools",
                    menu:[]          
                }]
            });
        },
        addItem:function(menuObj, id)
        {
            if(id){
                var com = Ext.getCmp(id);
                if(com) com.menu.add(menuObj);
            }
            else {
                var pos =  this.obj.items.length-2;
                this.obj.insert(pos,menuObj);
                this.obj.doLayout();
            }
        },
        appendItem:function(menuObj, id)
        {
            if(id){
                var com = Ext.getCmp(id);
                if(com) com.menu.add(menuObj);
            }
            else {
                var pos =  this.obj.items.length;
                this.obj.insert(pos,menuObj);
                this.obj.doLayout();
            }
        }
    }
});
