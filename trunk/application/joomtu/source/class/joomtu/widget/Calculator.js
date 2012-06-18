qx.Class.define("joomtu.widget.Calculator", {

	extend : qx.ui.window.Window,

	construct : function() {
		this.base(arguments);

		this.setTitle(Calculator);
		this.setLayout(new qx.ui.layout.VBox(3));
		this.setShowMinimize(false);

		this.__createUI();

		this.open();
	},

	members : {
		__createUI : function() {
			var display = new qx.ui.basic.Label("0").set({
				allowGrowX : true,
				allowGrowT : true,
				textAlign : "right",
				font : "bold",
				decorator : "main"
			});
			this.add(display, {
				flex : 1
			});

			var buttonContainer = new qx.ui.container.Composite();
			var grid = new qx.ui.layout.Grid(3, 3);
			buttonContainer.setLayout(grid);
			this.add(buttonContainer, {
				flex : 6
			});

			var labels = [
				["MC", "M+", "M-", "MR"],
				["C", "±", "÷", "*"],
				["7", "8", "9", "-"],
				["4", "5", "6", "+"],
				["1", "2", "3", "="],
				["0", null, ".", null]
			];

			var buttons = {};
			for (var row = 0; row < 6; row++) {
				grid.setRowFlex(row, 1);
				for (var column = 0; column < 4; column++) {
					grid.setColumnFlex(column, 1);
					var label = labels[row][column];
					if (label) {
						var button = new qx.ui.form.button(label).set({
							rich : true,
							allowShinkX : false
						});
						buttonContainer.add(button, {
							row : row,
							column : column
						});
						buttons[label] = button;
					}
				}
			}
			buttons["="].setLayoutProperties({
				rowSpan : 2
			});
			buttons["0"].setLayoutProperties({
				colSpan : 2
			});

			for (lable in buttons) {
				buttons[lable].addListener("execute", function(e) {
					var button = e.getTarget();
					alert("Pressed:" + button.getLable());
				}, this);
			}
			this.addListener("keypress", function(e) {
				alert("Key:" + g.getKeyIdentifier());
			}, this);
		}
	}
});