sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
], (Controller, MessageToast, Filter, FilterOperator, JSONModel, Fragment) => {
    "use strict";

    return Controller.extend("ecommercehub.controller.Header", {
        customerCode: 'CUST-1001',
        onInit() {
            this.getView().setModel(
                new sap.ui.model.json.JSONModel([]),
                "suggestions"
            );
            const oModel = this.getOwnerComponent().getModel();
            const oListBinding = oModel.bindList("/Users", null, null, null, {
                $filter: `customerCode eq '${this.customerCode}'`
            });

            oListBinding.requestContexts()
                .then((aContexts) => {
                    if (!aContexts.length) {
                        console.log("No user found");
                        return;
                    }

                    const oUser = aContexts[0].getObject();

                    const oUserModel = new JSONModel(oUser);
                    this.getOwnerComponent().setModel(oUserModel, "CurrentUser");

                    console.log("User:", oUser);
                })
                .catch((oError) => {
                    console.error("OData V4 error:", oError);
                });

            const oUIModel = new sap.ui.model.json.JSONModel({
                showBack: false
            });
            this.getView().setModel(oUIModel, "ui");

            const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.attachRouteMatched(this._onRouteMatched, this);
        }, _onRouteMatched(oEvent) {
            const sRouteName = oEvent.getParameter("name");
            const bShowBack = sRouteName !== "RouteECommerceHub";
            this.getView().getModel("ui").setProperty("/showBack", bShowBack);
        }, onNavBack() {
            const oHistory = sap.ui.core.routing.History.getInstance();
            const sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteECommerceHub", {}, true);
            }
        }, goToUserPage() {
            this.getOwnerComponent().getTargets().display("User");
        }, onSearch: function (oEvent) {
            const sQuery = oEvent.getParameter("query");
            if (!sQuery) {
                return;
            }

            this.getOwnerComponent()
                .getRouter()
                .navTo("ProductListing", {
                    query: encodeURIComponent(sQuery)
                });
        }, toCart(oEvent) {
            this.getOwnerComponent()
                .getRouter()
                .navTo("Cart", {
                    customerCode: this.customerCode
                });
        }


    });
});