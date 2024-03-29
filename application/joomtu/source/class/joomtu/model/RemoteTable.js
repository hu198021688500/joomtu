qx.Class.define("joomtu.model.RemoteTable", {

	extend : qx.ui.table.model.Remote,

	construct : function() {
		this.base(arguments);
		this.setColumns(["Id", "Text"], ["id", "text"]);
	},

	members : {
		__PHPSupported : null,
		__checkingForPHP : false,

		// overloaded - called whenever the table requests the row count
		_loadRowCount : function() {
			this.__checkPHP();
			if (this.__checkingForPHP) {
				return;
			}
			if (this.__PHPSupported) {
				this.__loadPHPRowCount();
			} else {
				this.__setRowCount();
			}
		},

		_loadRowData : function(firstRow, lastRow) {
			this.__checkPHP();
			if (this.__checkingForPHP) {
				return;
			}
			if (this.__PHPSupported) {
				this.__loadPHPRowData(firstRow, lastRow);
			} else {
				// this.__rowDataLoadded(firstRow, lastRow);
			}
		},

		// Server communication
		__checkPHP : function() {
			if (this.__checkingForPHP || this.__PHPSupported !== null) {
				return;
			}
			this.__checkingForPHP = true;
			this.__call("method=checkphp", function(data) {
				this.__checkingForPHP = false;
				this.__PHPSupported = (data == "WTF PHP");
				this._loadRowCount();
			});
		},

		__loadPHPRowCount : function() {
			var param = "method=getRowCount";
			this.__call(param, function(data) {
				this._onRowCountLoaded(parseInt(data));
			});
		},

		__loadPHPRowData : function(firstRow, lastRow) {
			var param = "method=getRowData&start=" + firstRow + "&end=" + lastRow;
			this.__call(param, function(data) {
				this._onRowDataLoaded(qx.lang.Json.parse(data));
			});
		},

		__call : function(param, callback) {
			var req = new qx.io.request.Xhr();
			req.setUrl("http://127.0.0.1/qooxdoo/application/demobrowser/build/resource/demobrowser/backend/remote_table.php?"
				+ param);
			req.addListener("success", function() {
				callback.call(this, req.getResponseText());
			}, this);
			req.send();
		},

		// Fake the server localy
		__setRowCount : function() {
			var self = this;
			window.setTimeout(function() {
				self._onRowCountLoaded(1000000);
			}, 0);
		},

		__rowDataLoadded : function(firstRow, lastRow) {
			var self = this;
			window.setTimeout(function() {
				var data = [];
				for (var i = firstRow; i <= lastRow; i++) {
					data.push({
						id : i,
						text : 'Hello ' + i + ' Generated on:' + (new Date())
					});
				}
				self._onRowDataLoaded(data);
			}, 0);
		}
	}
});