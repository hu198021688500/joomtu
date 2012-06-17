/* ************************************************************************

#asset(qx/icon/Tango/22/actions/go-previous.png)
#asset(qx/icon/Tango/22/actions/go-next.png)
#asset(qx/icon/Tango/22/actions/view-refresh.png)
#asset(qx/icon/Tango/22/actions/process-stop.png)
#asset(qx/icon/Tango/22/actions/system-log-out.png)
#asset(qx/icon/Tango/22/actions/help-about.png)
#asset(qx/icon/Tango/22/actions/media-seek-forward.png)

 ************************************************************************ */

/**
 * The main tool bar widget
 */
qx.Class.define("joomtu.view.desktop.ToolBar", {

	extend : qx.ui.toolbar.ToolBar,

	/*
	 * ****************************************************************************
	 * CONSTRUCTOR
	 * ****************************************************************************
	 */

	/**
	 * @param controller {joomtu.Application} The main application class
	 */
	construct : function(controller) {
		this.base(arguments);

		this.__menuItemStore = {};

		// back/forward buttons
		this.__previousBtn = new qx.ui.toolbar.Button(this.tr("Previous"), "icon/22/actions/go-previous.png");
		this.__previousBtn.setCommand(controller.getCommand("previous"));
		this.add(this.__previousBtn);

		this.__nextBtn = new qx.ui.toolbar.Button(this.tr("Next"), "icon/22/actions/go-next.png");
		this.__nextBtn.setCommand(controller.getCommand("next"));
		this.__nextBtn.setEnabled(false);
		this.add(this.__nextBtn);

		// Add a separator
		this.addSeparator();

		// Reload button
		var reloadBtn = new qx.ui.toolbar.Button(this.tr("Reload"), "icon/22/actions/view-refresh.png");
		var reloadCmd = controller.getCommand("reload");
		reloadBtn.setCommand(reloadCmd);
		reloadBtn.setToolTipText(this.tr("Reload the feeds. (%1)",
		reloadCmd.toString()));
		this.add(reloadBtn);

		// Add a separator
		this.addSeparator();

		// Preferences button
		this.__stopBtn = new qx.ui.toolbar.Button(this.tr("Stop"), "icon/22/actions/process-stop.png");
		this.__stopBtn.setToolTipText(this.tr("Open preferences window."));
		this.add(this.__stopBtn);

		// Add a spacer
		this.addSpacer();

		this.__loginUserBtn = new qx.ui.toolbar.Button(this.tr("admin"), "icon/22/actions/system-log-out.png");
		this.__loginUserBtn.setCommand(controller.getCommand("loginUser"));
		this.__loginUserBtn.setToolTipText("Click to logout");
		this.add(this.__loginUserBtn);

		// About button
		var aboutBtn = new qx.ui.toolbar.Button(this.tr("Help"), "icon/22/actions/help-about.png");
		var aboutCmd = controller.getCommand("about");
		aboutBtn.setCommand(aboutCmd);
		aboutBtn.setToolTipText("(" + aboutCmd.toString() + ")");
		this.add(aboutBtn);

		// enable overflow handling
		this.setOverflowHandling(true);

		// add a button for overflow handling
		var chevron = new qx.ui.toolbar.MenuButton(null, "icon/22/actions/media-seek-forward.png");
		chevron.setAppearance("toolbar-button"); // hide the down arrow icon
		this.add(chevron);
		this.setOverflowIndicator(chevron);

		// add the overflow menu
		this.__overflowMenu = new qx.ui.menu.Menu();
		chevron.setMenu(this.__overflowMenu);

		// add the listener
		this.addListener("hideItem", this._onHideItem, this);
		this.addListener("showItem", this._onShowItem, this);
	},

	members : {
		// private members
		__removeBtn : null,
		__overflowMenu : null,
		__menuItemStore : null,
		__addBtn : null,
		__prefBtn : null,
		
		__loginUserBtn : null,

		/**
		 * Return the button which removed the feeds. This is needed to enable /
		 * disable the button from the main application.
		 * 
		 * @return {qx.ui.toolbar.Button}
		 */
		getRemoveButton : function() {
			return this.__removeBtn;
		},

		/**
		 * Handler for the overflow handling which will be called on hide.
		 * 
		 * @param e {qx.event.type.Data} The event.
		 */
		_onHideItem : function(e) {
			var item = e.getData();
			var menuItem = this._getMenuItem(item);
			menuItem.setVisibility("visible");
		},

		/**
		 * Handler for the overflow handling which will be called on show.
		 * 
		 * @param e {qx.event.type.Data} The event.
		 */
		_onShowItem : function(e) {
			var item = e.getData();
			var menuItem = this._getMenuItem(item);
			menuItem.setVisibility("excluded");
		},

		/**
		 * Helper for the overflow handling. It is responsible for returning a
		 * corresponding menu item for the given toolbar item.
		 * 
		 * @param toolbarItem {qx.ui.core.Widget} The toolbar item to look for.
		 * @return {qx.ui.core.Widget} The coresponding menu item.
		 */
		_getMenuItem : function(toolbarItem) {
			var cachedItem = this.__menuItemStore[toolbarItem.toHashCode()];

			if (!cachedItem) {
				if (toolbarItem instanceof qx.ui.toolbar.Button) {
					cachedItem = new qx.ui.menu.Button(toolbarItem.getLabel()
							.translate(), toolbarItem.getIcon(), toolbarItem
							.getCommand());

					toolbarItem.bind("enabled", cachedItem, "enabled");
				} else {
					cachedItem = new qx.ui.menu.Separator();
				}

				this.__overflowMenu.addAt(cachedItem, 0);
				this.__menuItemStore[toolbarItem.toHashCode()] = cachedItem;
			}
			return cachedItem;
		},

		/**
		 * Signals the toolbar which part currently loading.
		 * 
		 * @param part {String} The name of the part currently loading.
		 * @param loading {Boolean} ture, if the part is currently loading.
		 */
		signalLoading : function(part, loading) {
			// get the right button
			if (part == "loginuser") {
				var button = this.__loginUserBtn;
			} else if (part == "settings") {
				var button = this.__prefBtn;
			} else {
				// do nothing on the rest of the parts if given
				return;
			}

			// set / reset icon of the button
			if (loading) {
				button.setUserData("originalIcon", button.getIcon());
				button.setIcon("joomtu/images/loading22.gif");
			} else {
				var icon = button.getUserData("originalIcon");
				button.setIcon(icon);
			}
		}
	},

	/*
	 * ****************************************************************************
	 * DESTRUCTOR
	 * ****************************************************************************
	 */
	destruct : function() {
		this._disposeObjects("__removeBtn", "__overflowMenu");
	}
});