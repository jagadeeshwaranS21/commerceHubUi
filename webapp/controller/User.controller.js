sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
], (Controller, MessageToast, Filter, FilterOperator, JSONModel, Fragment) => {
    "use strict";

    return Controller.extend("ecommercehub.controller.User", {
        onInit() {
            const oModel = this.getOwnerComponent().getModel('CurrentUser');
        },backToHome : function () {
			this.getOwnerComponent().getTargets().display("TargetECommerceHub");
		}
    });
});