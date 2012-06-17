qx.Class.define("joomtu.view.desktop.MainArea", {

    extend : qx.ui.splitpane.Pane,

    construct : function() {
        this.base(arguments);
        
        this.setDecorator(null);
        this.setOrientation("vertical");
        
        this.__createUI();
    },
    
    properties : {

    },

    members : {
        __nextId: 0,

        __toolBar : null,
        __table : null,
        __information : null,
        
        __config : null,

        getToolBar : function() {
            return this.__toolBar;
        },

        getTable : function() {
            return this.__table;
        },

        getInformation : function() {
            return this.__information;
        },

        __createUI : function() {
            var composite = new qx.ui.container.Composite();
            composite.setLayout(new qx.ui.layout.VBox(5));
            //add toolbar
            this.__toolBar = new qx.ui.toolbar.ToolBar();
            var listButton = new qx.ui.toolbar.Button("List");
            this.__toolBar.add(listButton);
            var iconButton = new qx.ui.toolbar.Button("Icon");
            this.__toolBar.add(iconButton);
            this.__toolBar.addSpacer();
            var closeButton = new qx.ui.toolbar.Button("Close");
            closeButton.addListener("execute", function() {
                composite.remove(this.__toolBar);
            }, this);
            this.__toolBar.add(closeButton);
            composite.add(this.__toolBar);

            //var tableModel =  new joomtu.model.TablePaging(this.__config.uiConfig.user_list);
            var tableModel =  new joomtu.model.RemoteTable();
            tableModel.setBlockSize(2);
            //tableModel.setMaxCachedBlockCount(2);
            var custom = {
                tableColumnModel : function(obj) {
                    return new qx.ui.table.columnmodel.Resize(obj);
                }
            };
            /*tableModel.addListener("dataChanged", function(evt){
                var data = evt.getData();
            //this.__table.setAdditionalStatusBarText(data.firstRow + " to " + data.lastRow + " " + this.getRowCount());
            });*/
            //this.__table = new qx.ui.table.Table(tableModel, custom);
            this.__table = new joomtu.view.desktop.PagingTable(tableModel, custom);
            var col = this.__table.getTableColumnModel().getBehavior();
            col.setWidth(0, '10%');
            col.setWidth(1, '90%');

            // Establish a context menu for the boolean field, to select its value
            //this.__table.setContextMenuHandler(1, this.__contextMenuHandlerBoolean);

            //add table
            /*var tableModel = new qx.ui.table.model.Simple();
            tableModel.setColumns(["ID", "A number", "A date", "Boolean"]);
            tableModel.setData(this.__createRandomRows(80));
            tableModel.setColumnEditable(1, true);
            tableModel.setColumnEditable(2, true);
            tableModel.setColumnSortable(3, false);

            this.__table = new qx.ui.table.Table(tableModel);
            this.__table.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION);

            var tcm = this.__table.getTableColumnModel();
            tcm.setDataCellRenderer(3, new qx.ui.table.cellrenderer.Boolean());
            tcm.setHeaderCellRenderer(2, new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png", "A date"));
            this.__table.setFocusedCell(2,5);*/
            composite.add(this.__table, {
                flex:1
            });

            this.add(composite, 1);

            // create a list for the selection
            this.__information = new qx.ui.form.List();
            this.add(this.__information, 0);
        },

        __contextMenuHandlerBoolean : function(col, row, table, dataModel, contextMenu) {
            var menuEntry;
            for (var i = 0; i <= 1; i++) {
                menuEntry = new qx.ui.menu.Button("menu" + i);
                menuEntry.setUserData("value", "menu" + i);
                menuEntry.addListener("execute", function(evt) {
                    // Toggle the value
                    dataModel.setValue(col, row, this.getUserData("value"));
                });
                contextMenu.add(menuEntry);
            }
            return true;
        },

        __createRandomRows : function(rowCount) {
            var rowData = [];
            var now = new Date().getTime();
            var dateRange = 400 * 24 * 60 * 60 * 1000; // 400 days
            for (var row = 0; row < rowCount; row++) {
                var date = new Date(now + Math.random() * dateRange - dateRange / 2);
                rowData.push([ this.__nextId++, Math.random() * 10000, date, (Math.random() > 0.5) ]);
            }
            return rowData;
        }
    }
});