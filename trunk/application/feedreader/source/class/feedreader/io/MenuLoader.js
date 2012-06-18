/**
 * The loader loads the feed data by using JSONP over a proxy
 */
qx.Class.define("joomtu.io.MenuLoader", {
	
	extend : qx.core.Object,
	type : "singleton",

	/*
	 * ****************************************************************************
	 * MEMBERS
	 * ****************************************************************************
	 */

	members : {
		/**
		 * Load all menus from the menu list
		 * 
		 * @param feedFolder
		 *            {joomtu.model.MenuFolder} load all menu from
		 *            this menu folder
		 */
		loadAll : function(menuFolder) {
			// static menus
			var staticMenus = menuFolder.getMenus().getItem(0).getMenus();
			for (var i = 0; i < staticMenus.length; i++) {
				this.load(staticMenus.getItem(i));
			}
			// user menus
			var userMenus = menuFolder.getMenus().getItem(1).getMenus();
			for (i = 0; i < userMenus.length; i++) {
				this.load(userMenus.getItem(i));
			}
		},

		/**
		 * Load the given menu.
		 * 
		 * @param menu
		 *            {joomtu.model.Feed} the menu to load
		 */
		load : function(menu) {
			menu.setState("loading");
			var query = "select * from menu where url='" + menu.getUrl() + "'";
			var store = new qx.data.store.Yql(query, {
				manipulateData : function(data) {
					try {
						data = data.query.results.item || data.query.results.entry;
						// normalize titles
						for (var i = 0; i < data.length; i++) {
							if (!qx.lang.Type.isString(data[i].title)) {
								data[i].title = data[i].title.content;
							}
						};
						// locale storage support
						if (qx.core.Environment.get("html.storage.local")) {
							var key = "qx-menus-" + menu.getUrl();
							qx.bom.storage.Local.getInstance().setItem(key, data);
						}
						return data;
					} catch (e) {
						return "failed";
					}
				},
				configureRequest : function(req) {
					req.setTimeout(10000);
				}
			}, qx.core.Environment.get("io.ssl"));

			store.addListener("loaded", this.__createOnLoaded(menu), this);
			store.addListener("changeState", qx.lang.Function.bind(this.__onChangeState, this, menu), this);
		},

		/**
		 * State change handler for the yql store.
		 * 
		 * @param menu
		 *            {joomtu.model.menu} The menu which was loaded.
		 * @param e
		 *            {qx.event.type.Data} The change event.
		 */
		__onChangeState : function(menu, e) {
			if (e.getData() == "aborted" || e.getData() == "timeout" || e.getData() == "failed") {
				var state = "error";
				// locale storage support
				if (qx.core.Environment.get("html.storage.local")) {
					var key = "qx-menus-" + menu.getUrl();
					var oldData = qx.bom.storage.Local.getInstance().getItem(key);
					if (oldData) {
						var articles = qx.data.marshal.Json.createModel(oldData);
						menu.setArticles(articles);
						state = "cached";
					}
				}
				menu.setState(state);
			}
		},

		/**
		 * Create a calback to save the response
		 * 
		 * @param menu
		 *            {joomtu.model.Menu} menu, which got loaded
		 * @return {Function} callback handler
		 */
		__createOnLoaded : function(menu) {
			return function(e) {
				var model = e.getData();
				// check for wrong urls
				if (model == "failed") {
					menu.setState("loaded");
					return;
				}
				menu.setArticles(model);
				menu.setState("loaded");
			};
		}
	}
});