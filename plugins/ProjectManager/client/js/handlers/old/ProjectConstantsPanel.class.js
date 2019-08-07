ProjectConstantsPanel.prototype.on_rowselect_gridSelectionModel = function(sm){
    var _that = ProjectConstantsPanel.prototype;
    var value = sm.getSelected();   
    var detailEl = this.detailsPanel.body;
    if(value){        
        detailEl.hide();
        this.template.overwrite(detailEl, value.data);
        detailEl.slideIn('l', {
            stopFx:true,
            duration:.1
        });        
       
    }else{        
        detailEl.update();
    }
}

ProjectConstantsPanel.prototype.on_resize_obj = function() {
    var _that = ProjectConstantsPanel.prototype;
    var data = [
    ['KCL_EXT','/castanka','Designation','This is the constant used for blah blah bla'],
    ['KCL_NEXT','/castanka','Designation','This is the constant used for blah blah bla'],
    ['KCL_MAIN','/castanka','Designation','This is the constant used for blah blah bla'],
    ['KCL_PROJ','project/','Publishing','This is the constant used for blah blah bla'],
    ['KCL_WEB','/castanka','Publishing','This is the constant used for blah blah bla'],
    ['KCL_CONFIG','/castanka','Directory','This is the constant used for blah blah bla'],
    ['KCL_SRC','/castanka','Directory','This is the constant used for blah blah bla'],
    ['KCL_LOG','/castanka','Directory','This is the constant used for blah blah bla'],
    ['KCL_INCLUDER','/castanka','Directory','This is the constant used for blah blah bla'],
    ['KCL_ERROR','/castanka','Directory','This is the constant used for blah blah bla']
    ];
    _that.store.loadData(data);
    
}

ProjectConstantsPanel.prototype.on_load_store = function() {
    var _that = ProjectConstantsPanel.prototype;
    _that.gridPanel.getSelectionModel().selectFirstRow();
}

