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

        this.setLayout(new qx.ui.layout.Basic());

        this.__createUi();

    },

    properties :
    {

    },

    members :{
        __nextId: 0,

        __toolBar : null,
        __content : null,

        __createUi : function(){
            var toolbar = new qx.ui.toolbar.ToolBar();
            var newButton = new qx.ui.toolbar.Button("New");
            toolbar.add(newButton);
            this.add(toolbar, {
                left: 10,
                top: 10
            });

            var rowData = this.__createRandomRows(50);

            var tableModel = new qx.ui.table.model.Simple();
            tableModel.setColumns([ "ID", "A number", "A date", "Boolean" ]);
            tableModel.setData(rowData);
            tableModel.setColumnEditable(1, true);
            tableModel.setColumnEditable(2, true);
            tableModel.setColumnSortable(3, false);

            var table = new qx.ui.table.Table(tableModel);

            table.set({
                width: 600,
                height: 400,
                decorator : null
            });

            table.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION);

            var tcm = table.getTableColumnModel();

            tcm.setDataCellRenderer(3, new qx.ui.table.cellrenderer.Boolean());
            tcm.setHeaderCellRenderer(2, new qx.ui.table.headerrenderer.Icon("icon/16/apps/office-calendar.png", "A date"));

            table.setFocusedCell(2,5);

            this.add(table, {
                left: 10,
                top: 50
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