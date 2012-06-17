/*******************************************************************************
 * 
 * #asset(joomtu/*) #asset(qx/icon/Tango/22/apps/internet-feed-reader.png)
 * #asset(qx/icon/Tango/22/actions/process-stop.png)
 * #asset(qx/icon/Tango/22/apps/preferences-clock.png)
 * #asset(qx/icon/Tango/22/places/folder.png)
 * 
 ******************************************************************************/

/*******************************************************************************
 * 
 * #asset(joomtu/*) #asset(qx/icon/Tango/22/apps/internet-feed-reader.png)
 * 
 ******************************************************************************/

/**
 * This is the main application class of your custom application "joomtu"
 */
qx.Class.define("joomtu.Application", {
	extend : qx.application.Standalone,

	/*
	 * ****************************************************************************
	 * MEMBERS
	 * ****************************************************************************
	 */

	members : {
		// private memebers
		__commands : null,

		__header : null,
		__toolBarView : null,
		__horizontalSplitPane : null,
		__verticalSplitPane : null,
		__treeView : null,

		__menuFolder : null,
		__userMenuFolder : null,
		__staticMenuFolder : null,

		__loginUserWindow : null,
		__loginUserWindowLoaded : false,

		__mainArea : null,

		__config : null,

		/**
		 * This method contains the initial application code and gets called
		 * during startup of the application
		 */
		main : function() {
			// Call super class
			this.base(arguments);

			// Enable logging in debug variant
			if (qx.core.Environment.get("qx.debug")) {
				// support native logging capabilities, e.g. Firebug for Firefox
				qx.log.appender.Native;
				// support additional cross-browser console. Press F7 to toggle
				// visibility
				qx.log.appender.Console;
			}

			qx.io.PartLoader.getInstance().addListener("partLoaded",
					function(e) {
						this.debug("part loaded: " + e.getData().getName());
					}, this);

			this.__config = joomtu.model.LoadConfig;
			this.buildUpGui();

		},

		/**
		 * Main routine which builds the whole GUI.
		 */
		buildUpGui : function() {
			// Initialize commands
			this._initializeCommands();

			// Create application layout
			this._createLayout();

			// Initialize the model
			var model = new joomtu.model.MainModel();
			this.__menuFolder = model.getMenuFolder();
			this.__staticMenuFolder = model.getStaticMenuFolder();
			this.__userMenuFolder = model.getUserMenuFolder();

			// Initialize the bindings
			this._setUpBinding();

			// Set up the default view of the tree
			this.__treeView.getRoot().setOpen(true);
			this.__treeView.getRoot().getChildren()[0].setOpen(true);
			this.__treeView.setHideRoot(true);

			this.reload();
		},

		reload : function() {
			var loader = joomtu.io.MenuLoader.getInstance();
			loader.loadAll(this.__menuFolder);
			// remove the article which is currently on the screen
			// this.__articleView.setArticle(null);
		},

		/**
		 * Set up the bindings and controller.
		 */
		_setUpBinding : function() {
			// bind the tree
			// create the options used to store the converter for the icon
			var iconOptions = {
				converter : this._state2iconConverter
			};
			// create the controller which binds the menus to the tree
			this.__treeController = new qx.data.controller.Tree(
					this.__menuFolder, this.__treeView, "menus", "title");
			// set the options for the icon binding
			this.__treeController.setIconOptions(iconOptions);
			// set the property for the icon binding
			this.__treeController.setIconPath("state");

			// bind the list to the selection of the tree
			new qx.data.controller.List(this.__treeController.getSelection(),
					this.__mainArea.getInformation(), "title");
		},

		/**
		 * Creates the core layout.
		 */
		_createLayout : function() {
			// Create main layout
			var dockLayout = new qx.ui.layout.Dock();
			// dockLayout.setSeparatorY("separator-vertical");
			var dockLayoutComposite = new qx.ui.container.Composite(dockLayout);
			this.getRoot().add(dockLayoutComposite, {
						edge : 0
					});

			// Create header
			this.__header = new joomtu.view.desktop.Header();
			dockLayoutComposite.add(this.__header, {
						edge : "north"
					});

			// Create toolbar
			this.__toolBarView = new joomtu.view.desktop.ToolBar(this);
			dockLayoutComposite.add(this.__toolBarView, {
						edge : "north"
					});

			// Create horizontal splitpane for tree and list+article view
			this.__horizontalSplitPane = new qx.ui.splitpane.Pane();
			dockLayoutComposite.add(this.__horizontalSplitPane);

			// Create tree view
			this.__treeView = new qx.ui.tree.Tree();
			this.__treeView.setWidth(250);
			this.__treeView.setDecorator("main");
			this.__treeView.setPadding(0);
			this.__horizontalSplitPane.add(this.__treeView, 0);
			
			this.__mainArea = new joomtu.view.desktop.MainArea();
			this.__horizontalSplitPane.add(this.__mainArea, 1);
		},

		/*
		 * ---------------------------------------------------------------------------
		 * COMMANDS
		 * ---------------------------------------------------------------------------
		 */

		/**
		 * Initialize commands (shortcuts, ...)
		 */
		_initializeCommands : function() {
			var commands = {};
			commands.previous = new qx.ui.core.Command("Control+Shift+B");
			commands.previous.addListener("execute", function() {
						alert("back");
					}, this);
			commands.next = new qx.ui.core.Command("Control+Shift+F");
			commands.next.addListener("execute", function() {
						alert("forward");
					}, this);
			commands.reload = new qx.ui.core.Command("Control+R");
			commands.reload.addListener("execute", function() {

					}, this);
			commands.loginUser = new qx.ui.core.Command("Control+U");
			commands.loginUser.addListener("execute", function() {
				if (!this.__loginUserWindowLoaded) {
					this.__toolBarView.signalLoading("loginuser", true);
				}
				qx.io.PartLoader.require(["loginuser"], function() {
					this.__loginUserWindowLoaded = true;
					// if the window is not created
					if (!this.__loginUserWindow) {
						// create it
						this.__loginUserWindow = new joomtu.view.desktop.LoginUserWindow(this);
						this.getRoot().add(this.__loginUserWindow);
					}

					// open the window
					this.__loginUserWindow.center();
					this.__loginUserWindow.open();

					// signal the end of the loading
					this.__toolBarView.signalLoading("loginuser", false);
				}, this);
			}, this);
			commands.about = new qx.ui.core.Command("F1");
			commands.about.addListener("execute", function() {
						alert(this.tr("joomtu (qooxdoo powered)"));
					}, this);
			this.__commands = commands;
		},

		/**
		 * Get the command with the given command id
		 * 
		 * @param commandId
		 *            {String} the command's command id
		 * @return {qx.ui.core.Command} The command
		 */
		getCommand : function(commandId) {
			return this.__commands[commandId];
		},

		_treeControllerChange : function(ev) {
			alert(1);
		},

		/**
		 * Converter function which converts the state of a feed to a icon url.
		 * 
		 * @param value
		 *            {String} The loading state of the request.
		 */
		_state2iconConverter : function(value) {
			if (value == "new" || value == "loading") {
				return "joomtu/images/loading22.gif";
			} else if (value == "loaded") {
				return "icon/22/apps/internet-feed-reader.png";
			} else if (value == "error") {
				return "icon/22/actions/process-stop.png";
			} else if (value == "cached") {
				return "icon/22/apps/preferences-clock.png";
			}
			return "icon/22/places/folder.png";
		}
	},

	/*
	 * ****************************************************************************
	 * DESTRUCTOR
	 * ****************************************************************************
	 */

	destruct : function() {
		this._disposeObjects("__toolBarView", "__treeView", "__adminMenu",
				"__horizontalSplitPane", "__verticalSplitPane", "__header",
				"__treeController");
	}
});
