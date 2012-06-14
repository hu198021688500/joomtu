/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
qx.Class.define("joomtu.view.desktop.MainArea",
{
    extend : qx.ui.container.Composite,

    construct : function()
    {
        this.base(arguments);

        this.setLayout(new qx.ui.layout.VBox(5));
        
        this.__createUi();
    },

    properties :
    {

    },

    members :{
        __nextId: 0,

        __toolBar : null,
        __content : null,
        
        getToolBar : function(){
            return this.__toolBar;
        },
        
        getContent : function(){
            return this.__content;
        },

        __createUi : function(){
            //add toolbar
            var toolbar = new qx.ui.toolbar.ToolBar();
            toolbar.addSpacer();
            var listButton = new qx.ui.toolbar.Button("List");
            toolbar.add(listButton);
            var iconButton = new qx.ui.toolbar.Button("Icon");
            toolbar.add(iconButton);
            var closeButton = new qx.ui.toolbar.Button("Close");
            closeButton.addListener("execute", function(){
                this.remove(toolbar);
            }, this);
            toolbar.add(closeButton);
            this.add(toolbar);

            //add table
            var tableModel = new qx.ui.table.model.Simple();
            tableModel.setColumns(["ID", "A number", "A date", "Boolean"]);
            tableModel.setData(this.__createRandomRows(80));
            tableModel.setColumnEditable(1, true);
            tableModel.setColumnEditable(2, true);
            tableModel.setColumnSortable(3, false);

            var table = new qx.ui.table.Table(tableModel);
            table.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION);

            var tcm = table.getTableColumnModel();
            tcm.setDataCellRenderer(3, new qx.ui.table.cellrenderer.Boolean());
            tcm.setHeaderCellRenderer(2, new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png", "A date"));
            table.setFocusedCell(2,5);
            this.add(table,{
                flex:1
            });
        },
        
        __createRandomRows : function(rowCount)
        {
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