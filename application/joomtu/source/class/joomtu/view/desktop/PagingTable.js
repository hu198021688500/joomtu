qx.Class.define("joomtu.view.desktop.PagingTable", {

	extend : qx.ui.table.Table,

	construct : function(tableModel, custom) {
		this.base(arguments, tableModel, custom);
	},
	
	properties : {
		maxButtonCount : {
			check : "Integer",
			init : 5
    	},
    	pageCount : {
			check : "Integer",
			init : 10
    	},
    	currentPage : {
			check : "Integer",
			init : 2
    	}
    },

	members : {
		_createChildControlImpl : function(id, hash) {
			var control;

			switch (id) {
				case "statusbar" :
					var currentPage = this.getCurrentPage();
					var pageCount = this.getPageCount();
					
					control = new qx.ui.toolbar.ToolBar();
					control.setValue = function(text) {
						this.getChildren()[0].setLabel(currentPage + "/" + pageCount);
					}
					
					var infoButton = new qx.ui.toolbar.Button(currentPage + "/" + pageCount);
					control.add(infoButton);
					
					if ((currentPage - this.getMaxButtonCount() / 2) > 1) {
						var firstButton = new qx.ui.toolbar.Button("First");
						control.add(firstButton);
					}
					
					var range = this.__getPageRange();
					for(var i = range.beginPage; i <= range.endPage; ++i) {
						var numButton = new qx.ui.toolbar.Button("" + i);
						if (currentPage == i) {
							numButton.setEnabled(false);
						}
						control.add(numButton);
					}
					
					if (currentPage < (pageCount - this.getMaxButtonCount() / 2)) {
						var lastButton = new qx.ui.toolbar.Button("Last");
						control.add(lastButton);
					}
					
					this._add(control);
					break;

				case "column-button" :
					control = this.getNewColumnMenu()();
					control.set({focusable : false});
					var menu = control.factory("menu", {table : this});
					menu.addListener("appear", this._initColumnMenu, this);
					break;
			}

			return control || this.base(arguments, id);
		},
		
		__getPageRange : function() {
			var range = {beginPage : 1, endPage : 1};
			var currentPage = this.getCurrentPage();
			var pageCount = this.getPageCount();
			
			range.beginPage = Math.max(1, currentPage - Math.floor(this.getMaxButtonCount() / 2));
			if((range.endPage = range.beginPage + this.getMaxButtonCount() - 1) >= pageCount) {
				range.endPage = pageCount - 1;
				range.beginPage = Math.max(1, range.endPage - this.getMaxButtonCount() + 1);
			}
			return range;
		}
	}
});