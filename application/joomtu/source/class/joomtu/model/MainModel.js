/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2011 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)
     * Tino Butz (tbtz)

************************************************************************ */
/**
 * Main model containing the feeds and all the data. This is shared for
 * mobiel and desktop.
 */
qx.Class.define("joomtu.model.MainModel",
{
    extend : qx.core.Object,


    construct : function()
    {
        this.base(arguments);

        this._initializeModel();
    },


    properties : {
        /**
         * Contains the root folder of all feeds.
        */
        menuFolder : {
            init : null,
            event : "changeMenuFolder",
            nullable: true
        },


        /**
         * A folder containing all static feeds.
        */
        staticMenuFolder : {
            init : null,
            event : "changeStaticMenuFolder",
            nullable: true
        },


        /**
         * A folder containing all user feeds.
        */
        userMenuFolder : {
            init : null,
            event : "changeUserMenuFolder",
            nullable: true
        }
    },


    members :
    {
        /**
     * Sets up the model data. Also initializes the load of all the feeds.
     */
        _initializeModel : function()
        {
            // create the root folder
            var menuFolder = new joomtu.model.MenuFolder("Feeds");

            // Add static feeds
            var staticMenuFolder = new joomtu.model.MenuFolder(qx.locale.Manager.tr("System"));
            menuFolder.getMenus().push(staticMenuFolder);
            staticMenuFolder.getMenus().push(
                new joomtu.model.Menu(
                    "Site Setting", "http://feeds2.feedburner.com/qooxdoo/news/content", "static"
                    )
                );
            staticMenuFolder.getMenus().push(
                new joomtu.model.Menu(
                    "SEO Setting", "http://blogs.msdn.com/jscript/rss.xml", "static"
                    )
                );
            // Add user feeds
            var userMenuFolder = new joomtu.model.MenuFolder(qx.locale.Manager.tr("User"));
            menuFolder.getMenus().push(userMenuFolder);
            userMenuFolder.getMenus().push(
                new joomtu.model.Menu(
                    "User List", "http://www.heise.de/newsticker/heise-atom.xml", "user"
                    )
                );
            userMenuFolder.getMenus().push(
                new joomtu.model.Menu(
                    "Add User", "http://blogs.msdn.com/ie/rss.xml", "user"
                    )
                );
            this.setMenuFolder(menuFolder);
            this.setStaticMenuFolder(staticMenuFolder);
            this.setUserMenuFolder(userMenuFolder);
        }
    }
});
