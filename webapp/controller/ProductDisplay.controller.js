sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "../model/formatter"
], (Controller, MessageToast, Filter, FilterOperator, JSONModel, Fragment, formatter) => {
    "use strict";

    return Controller.extend("ecommercehub.controller.ProductDisplay", {
        formatter: formatter,
        onInit() {
            this.getView().setModel(
                new sap.ui.model.json.JSONModel({
                    quantity: 1
                }),
                "quantity"
            );
            this.userData = this.getOwnerComponent().getModel("CurrentUser").getData();
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("ProductDisplay").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched(oEvent) {
            const sProductId = oEvent.getParameter("arguments").productId;
            const productType = oEvent.getParameter("arguments").productType;
            console.log("Received Product ID:", sProductId);
            console.log("Product Type:", productType);
            this._loadProduct(sProductId, productType);
        },
        _loadProduct(sProductId, productType) {
            const oModel = this.getOwnerComponent().getModel();
            let variantQuery = `/ProductVariants(${sProductId})?$expand=product($expand=variants($expand=stocks))`;
            let baseQuery = `/Products(${sProductId})?$expand=variants($expand=stocks)`;
            if (productType === 'BaseProduct') {
                console.log('Query', baseQuery);
                const oContextBinding = oModel.bindContext(
                    baseQuery
                );
                oContextBinding.requestObject()
                    .then((oProduct) => {
                        console.log(oProduct);
                        this.getView().setModel(
                            new sap.ui.model.json.JSONModel(oProduct.variants),
                            "variants"
                        );
                        console.log(oProduct.variants);
                    });
            } else {
                console.log('Query:', variantQuery);
                const oContextBinding = oModel.bindContext(
                    variantQuery
                );
                oContextBinding.requestObject()
                    .then((oProduct) => {
                        console.log(oProduct);
                        this.getView().setModel(
                            new sap.ui.model.json.JSONModel(oProduct.product.variants),
                            "variants"
                        );
                        console.log(oProduct.product.variants);
                    });
            }

        }, backToHome() {
            this.getOwnerComponent().getTargets().display("TargetECommerceHub");
        }, addToCart(oEvent) {
            const oContext = oEvent.getSource().getBindingContext("variants");
            const variantId = oContext.getProperty("ID");
            const oVariant = oContext.getObject();
            console.log("Adding Product To cart", oVariant);
            const quantity = this.getView().getModel("quantity").getProperty("/quantity");
            const oModel = this.getOwnerComponent().getModel();
            const oActionContext = oModel.bindContext("/addToCart(...)", null, {
                parameters: {
                    $$deferred: true
                    //With $$deferred: true
                    //Create the binding now, but DO NOT send the request yet.”
                }
            });

            oActionContext.setParameter("productCode", variantId);
            oActionContext.setParameter("quantity", quantity);
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