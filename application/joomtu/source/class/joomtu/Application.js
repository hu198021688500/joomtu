/* ************************************************************************

   Copyright:

   License:

   Authors:

 ************************************************************************ */

/* ************************************************************************

#asset(joomtu/*)

 ************************************************************************ */

/**
 * This is the main application class of your custom application "joomtu"
 */
qx.Class.define("joomtu.Application",
{
    extend : qx.application.Standalone,



    /*
     *****************************************************************************
     MEMBERS
     *****************************************************************************
     */

    members :
    {
        // private memebers
        __header : null,
        __toolBarView : null,
        __horizontalSplitPane : null,
        __verticalSplitPane : null,
        __treeView : null,
        __adminMenu : null,

        /**
         * This method contains the initial application code and gets called
         * during startup of the application
         *
         * @lint ignoreDeprecated(alert)
         */
        main : function()
        {
            // Call super class
            this.base(arguments);

            // Enable logging in debug variant
            if (qx.core.Environment.get("qx.debug"))
            {
                // support native logging capabilities, e.g. Firebug for Firefox
                qx.log.appender.Native;
                // support additional cross-browser console. Press F7 to toggle visibility
                qx.log.appender.Console;
            }

            this.buildUpGui();
        },

        /**
         * Main routine which builds the whole GUI.
         */
        buildUpGui : function()
        {
            // Create application layout
            this._createLayout();

            // Initialize the bindings
            this._setUpBinding();

            // Set up the default view of the tree
            this.__treeView.getRoot().setOpen(true);
            this.__treeView.getRoot().getChildren()[0].setOpen(true);
            this.__treeView.setHideRoot(true);
        },

        /**
         * Set up the bindings and controller.
         */
        _setUpBinding : function() {
            // bind the tree
            // create the options used to store the converter for the icon
            var iconOptions = {
                converter: this._state2iconConverter
            };
            // create the controller which binds the feeds to the tree
            // 1. Parameter: The model (root feed folder)
            // 2. Parameter: The view (the tree widget)
            // 3. Parameter: name of the children of the model items
            // 4. Parameter: name of the model property to show as label in the tree
            this.__treeController = new qx.data.controller.Tree(
                this.__adminMenu, this.__treeView, "feeds", "title"
                );
            // set the options for the icon binding
            this.__treeController.setIconOptions(iconOptions);
            // set the property for the icon binding
            this.__treeController.setIconPath("state");
        },

        /**
         * Creates the core layout.
         */
        _createLayout : function()
        {
            // Create main layout
            var dockLayout = new qx.ui.layout.Dock();
            // dockLayout.setSeparatorY("separator-vertical");
            var dockLayoutComposite = new qx.ui.container.Composite(dockLayout);
            this.getRoot().add(dockLayoutComposite, {
                edge:0
            });

            // Create header
            this.__header = new joomtu.view.desktop.Header();
            dockLayoutComposite.add(this.__header, {
                edge: "north"
            });

            // Create toolbar
            this.__toolBarView = new joomtu.view.desktop.ToolBar(this);
            dockLayoutComposite.add(this.__toolBarView, {
                edge: "north"
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

            // Create vertical splitpane for list and detail view
            this.__verticalSplitPane = new qx.ui.splitpane.Pane("vertical");
            this.__verticalSplitPane.setDecorator(null);
            this.__horizontalSplitPane.add(this.__verticalSplitPane, 1);
        },

        /**
     * Converter function which converts the state of a feed to a icon url.
     * @param value {String} The loading state of the request.
     */
        _state2iconConverter : function(value) {
            if (value == "new" || value == "loading") {
                return "feedreader/images/loading22.gif";
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
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

    destruct : function()
    {
        this._disposeObjects("__toolBarView", "__treeView", "__adminMenu",
            "__horizontalSplitPane", "__verticalSplitPane", "__header", "__treeController"
            );
    }
});
