sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], (Controller, MessageToast, Filter, FilterOperator, JSONModel, Fragment) => {
    "use strict";

    return Controller.extend("ecommercehub.controller.Cart", {
        onInit() {
            this.userData = this.getOwnerComponent().getModel("CurrentUser").getData();
            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("Cart").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched(oEvent) {
            const oModel = this.getOwnerComponent().getModel("CurrentUser");
            const user = oModel.getData();
            console.log("User Data:");
            console.log(user);
            const customerCode = oEvent.getParameter("arguments").customerCode;
            console.log("Received customerCode:", customerCode);
            this._loadCart(user.ID);
        },

        _loadCart(userId) {
            const oModel = this.getOwnerComponent().getModel();

            const oListBinding = oModel.bindList("/Carts", null, null, null, {
                $filter: `user_ID eq ${userId} and status eq 'ACTIVE'`,
                $expand: {
                    items: {
                        $expand: "variant"
                    }
                }
            });

            oListBinding.requestContexts()
                .then((aContexts) => {
                    if (!aContexts.length) {
                        console.log("No active cart found");
                        return;
                    }

                    const oCart = aContexts[0].getObject();

                    const aCartItems = oCart.items;

                    this.getOwnerComponent().setModel(
                        new JSONModel(oCart),
                        "cart"
                    );
                    console.log("Cart:", oCart);
                    console.log("Items:", aCartItems);
                })
                .catch(console.error);
        }, onQuantityChange() {
            const oModel = this.getOwnerComponent().getModel("cart");
            console.log("Model type:", oModel.getMetadata().getName());
        }, checkout() {
            const oModel = this.getOwnerComponent().getModel("cart");
            const cart = oModel.getData();
            console.log(cart.ID);
            this.getOwnerComponent().getRouter().navTo("Checkout", { cartId: cart.ID });
        }, onContinueShopping() {
            const router = this.getOwnerComponent().getRouter();
            router.navTo("RouteECommerceHub", {}, true);
        }

    });
});