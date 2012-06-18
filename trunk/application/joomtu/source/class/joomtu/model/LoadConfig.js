qx.Class.define("joomtu.model.LoadConfig", {

			extend : qx.core.Object,

			construct : function() {
				this.base(arguments);

				this._initializeModel();
			},

			properties : {
				uiConfig : {
					check : "Object",
					event : "changeUiConfig",
					apply : "_applyUiConfig"
				},

				menuConfig : {
					check : "Object",
					event : "changeMenuConfig",
					apply : "_applyMenuConfig"
				}
			},

			statics : {
				uiConfig : {
					user_list : {
						totalMethod : "getRowCount",
						dataMethod : "getRowData",
						columns : {
							columnNameArr : ["Id", "Text"],
							columnIdArr : ["id", "text"]
						}
					}
				}
			},

			members : {
				_initializeModel : function() {
					var uiConfig = this.getUiConfig();
					uiConfig.user_list = {};
					uiConfig.user_list.totalMethod = "getRowCount";
					uiConfig.user_list.dataMethod = "getRowData";
					uiConfig.user_list.columns = {};
					uiConfig.user_list.columns.columnNameArr = ["Id", "Text"];
					uiConfig.user_list.columns.columnIdArr = ["id", "text"];
					this.setUiConfig(uiConfig);
				},

				_applyUiConfig : function(value, old) {

				},

				_applyMenuConfig : function(value, old) {

				}
			}
		});
