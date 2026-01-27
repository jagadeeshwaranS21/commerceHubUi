sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
], function (Controller, MessageToast, Filter, FilterOperator, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("ecommercehub.controller.ProductListing", {
        onInit() {
            const oViewModel = new JSONModel({
                searchQuery: ""
            });
            this.userData = this.getOwnerComponent().getModel("CurrentUser").getData();
            this.getView().setModel(oViewModel, "view");
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("ProductListing").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched(oEvent) {
            const sQuery = decodeURIComponent(
                oEvent.getParameter("arguments").query
            );
            this._loadProducts(sQuery);
        },
        _loadProducts(sQuery) {
            this.getView()
                .getModel("view")
                .setProperty("/searchQuery", sQuery);
            const oList = this.byId("productList");
            const oBinding = oList.getBinding("items");
            oBinding.changeParameters({
                $search: sQuery
            });
        },
        selectProduct(oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const sProductId = oContext.getProperty("ID");
            this.getOwnerComponent().getRouter().navTo("ProductDisplay", {
                productId: sProductId, productType: 'VariantProduct'
            });
        }, addToCart(oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            const sProductId = oContext.getProperty("ID");
            console.log("Adding Product To cart", sProductId);
            const oModel = this.getOwnerComponent().getModel();
            const oActionContext = oModel.bindContext("/addToCart(...)", null, {
                parameters: {
                    $$deferred: true
                    //With $$deferred: true
                    //Create the binding now, but DO NOT send the request yet.”
                }
            });

            oActionContext.setParameter("productCode", sProductId);
            oActionContext.setParameter("quantity", 1);
            oActionContext.setParameter("userID", this.userData.ID);

            oActionContext.execute()
                .then(() => {
                    sap.m.MessageToast.show("Item added to cart");
                })
                .catch((err) => {
                    console.error("AddToCart failed", err);
                });

        }
    });
});
