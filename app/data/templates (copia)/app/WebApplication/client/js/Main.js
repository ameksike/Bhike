Kcl.Class( 'Kcl.Main',
{
	extend: Kcl.App,
	behavior: {
		construct : function(eve, loadType){
			var _this = Kcl.Main.prototype;
			_this.parent.construct.apply(_this, [_this]);

			std.FrontController.send({
				action: 'holaMundo',
				params: {
					'name':'Loco',
					'age': 23
				}
		
			});
		},
		serverResponse:function(objResponse){
			var _this = Kcl.Main.prototype;
			_this.parent.serverResponse(objResponse, _this);
			switch(objResponse.action)
			{
				case 'holaMundo':
					alert(objResponse.result + '{$GLOBALS['vars']->autor}');
				break;
			}
		},

		onLoadPlugins : function(params){
			alert('plugins loaded');
		}
	}
});

