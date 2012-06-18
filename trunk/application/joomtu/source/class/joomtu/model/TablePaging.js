qx.Class.define('joomtu.model.TablePaging', {

	extend : qx.ui.table.model.Remote,

	construct : function(config) {
		this.base(arguments);

		this.__config = config;
		this.setColumns(this.__config.columns);
	},

	members : {
		__config : null,

		_loadRowCount : function() {
			var param = "method=" + this.__config.totalMethod;
			this.__call(param, function(data) {
						this._onRowCountLoaded(parseInt(data));
					});
		},

		_loadRowData : function(firstRow, lastRow) {
			var param = "method=" + this.__config.dataMethod + "&start="
					+ firstRow + "&end=" + lastRow;
			this.__call(param, function(data) {
						this._onRowDataLoaded(qx.lang.Json.parse(data));
					});
		},

		__call : function(param, callback) {
			var req = new qx.io.request.Xhr();
			var baseUrl = "http://127.0.0.1/qooxdoo/application/demobrowser/build/resource/demobrowser/backend/remote_table.php?";
			req.setUrl(baseUrl + param);
			req.addListener("success", function() {
						callback.call(this, req.getResponseText())
					}, this);
			req.send();
		}
	}
});