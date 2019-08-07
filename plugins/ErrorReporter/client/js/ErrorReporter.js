Kcl.Class( "ErrorReporter",
{
    extend: Kcl.Plugin,
    behavior:{
        construct : function(){
            var _this = ErrorReporter.prototype;
			
            // This is the parent's definition call
            _this.parent.construct.apply(this, []);	
        },
        buildGUI : function(params){
            var _this = ErrorReporter.prototype;
            this.reporter = new Reporter();
            this.gui = params.gui;
            this.gui.south.addItem({
                xtype:"tabpanel",
                activeTab:0,
                tabPosition:"bottom",
                frame:false,
                defaults:{
                    frame:false,
                    split:true
                },
                items:[this.reporter.obj]
            });
        },
        serverResponse : function(objResponse){		}
    }
});

ErrorReporter.require = [    
    "plugins/ErrorReporter/client/js/views/Reporter.js"
];
