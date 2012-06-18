/**
 * The Application's header
 */

qx.Class.define("joomtu.view.desktop.Header", {
	extend : qx.ui.container.Composite,

	/*
	 * ****************************************************************************
	 * CONSTRUCTOR
	 * ****************************************************************************
	 */

	construct : function() {
		this.base(arguments);

		this.setLayout(new qx.ui.layout.HBox);
		this.setAppearance("app-header");

		var title = new qx.ui.basic.Label("Mobao Manager System");
		var version = new qxc.ui.versionlabel.VersionLabel();
		version.setFont("default");

		this.add(title);
		this.add(new qx.ui.core.Spacer, {
					flex : 1
				});
		this.add(version);

	}
});
