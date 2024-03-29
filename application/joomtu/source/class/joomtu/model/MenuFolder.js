/**
 * Data model for a menu folder.
 */
qx.Class.define("joomtu.model.MenuFolder", {

	extend : qx.core.Object,

	/**
	 * @param title
	 *            {String} The name of the folder.
	 */
	construct : function(title) {
		this.base(arguments);

		this.setTitle(title);
		this.setMenus(new qx.data.Array());
	},

	properties : {
		/** Title / Name of the item */
		title : {
			check : "String",
			event : "changeTitle",
			init : "Folder"
		},

		/** The feed category */
		category : {
			check : "String",
			init : "",
			event : "dataModified"
		},

		/**
		 * Array of feeds. This could contain another feed folder or a
		 * feed.
		 */
		menus : {
			check : "qx.data.Array",
			event : "changeMenus"
		},

		/** Array of articles. This is needed for the data binding. */
		articles : {
			check : "qx.data.Array",
			event : "changeArticles",
			init : new qx.data.Array()
		},

		/** The loading state of the folder. Needed for data binding. */
		state : {
			check : ["new", "loading", "loaded", "error"],
			init : "null",
			event : "stateModified",
			apply : "_applyState"
		}
	}
});
