Kcl.Class( "Help",
    {
        extend: Kcl.Plugin,
        behavior:{
            buildGUI : function(params){
                var _this = Help.prototype;
                _this.gui = params.gui
                _this.gui.menuBar.appendItem({
                    text:'<u>H</u>elp',
                    menu:[{
                        text:'Tip of the Day',
                        iconCls:'icon-tipofday'
                    },{
                        text:"What's New?",
                        iconCls:'icon-menuhelp'
                    },{
                        text:'Contents',
                        iconCls:'icon-menuhelp'
                    },{
                        text:'Additional Help Files',
                        iconCls:'icon-menuhelp',
                        disabled:true,
                        menu:[]
                    },'-',{
                        text:'Ksike Framework References',
                        iconCls:'icon-menuhelp'
                    },'-',{
                        text:'BHike Home Page',
                        iconCls:'icon-menuhomepage'
                    },{
                        text:'BHike Direct',
                        iconCls:'icon-menudirect'
                    },'-',{
                        text:'Send Bug Reports to...',
                        iconCls:'icon-menuemail'
                    },'-',{
                        text:'About',
                        iconCls:'icon-menuabout'
                    }]
                });
            },
            serverResponse : function(objResponse){		}
        }
    });
