/*
 * $package: BHike
 * 
 * $description: Ksike is a Ksike's JavaScript class definition that....
 * $authors: no-body
 * $created: Sun, 07 Oct 12 17:58:11 -0400
 * $license: GPL v3
 **/

Kcl.Class('Symfony.Wizard',
{	
	extend:IWizard,
    behavior:{
        construct: function(params){			
            var _this = Symfony.Wizard.prototype;
        },
        buildGUI:function(params){
			this.collection = new Array();
			var _this = Symfony.Wizard.prototype;
			//
            //txt_author
            //
            this.txt_author = new Ext.form.TextField();
            this.txt_author.setValue('Mr. Nosinc');
            this.txt_author.fieldLabel = 'Author';			
			//
            //txt_company
            //
            this.txt_company = new Ext.form.TextField();
            this.txt_company.setValue('Nosinc');
            this.txt_company.fieldLabel = 'Company';
            
            //
            //fset_ownerInfo
            //
            this.fset_ownerInfo = new Ext.form.FieldSet();
            this.fset_ownerInfo.setTitle("Symfony Project's Owner Specifics");
            this.fset_ownerInfo.add(this.txt_author);
            this.fset_ownerInfo.add(this.txt_company);
            //
            //obj
            //
            this.obj = new Ext.Panel();
            this.obj.frame = true;
            this.obj.padding = '10px 20px 10px 20px';
            this.obj.autoScroll = true;
            this.obj.setHeight(400);
            this.obj.border = false;
            this.obj.add(this.fset_ownerInfo); ;
			
			this.collection.push(this.obj);
            
            return this;
		}		   
    }
});
