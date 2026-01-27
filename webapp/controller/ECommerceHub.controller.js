sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment"
], (Controller, MessageToast, Filter, FilterOperator, JSONModel, Fragment) => {
    "use strict";


    return Controller.extend("ecommercehub.controller.ECommerceHub", {
        onInit() {
            this.getBannerImages();
            this._startCarouselAutoSlide();
            this.getOfferBanner();
        },
        getOfferBanner() {
            const oModel = this.getOwnerComponent().getModel();

            const oListBinding = oModel.bindList("/OfferBanner");

            oListBinding.requestContexts().then((aContexts) => {
                if (!aContexts.length) {
                    return;
                }

                const oBanner = aContexts[0].getObject();
                console.log(oBanner);
                this.getView().setModel(
                    new JSONModel(oBanner),
                    "OfferBanner"
                );
            });
        },
        _startCarouselAutoSlide: function () {
            const oCarousel = this.byId("offerCarousel");

            this._carouselInterval = setInterval(() => {
                if (oCarousel) {
                    oCarousel.next();
                }
            }, 4000);
        },
        getBannerImages() {
            const oModel = this.getOwnerComponent().getModel();
            const oListBinding = oModel.bindList("/CarouselBanner");
            oListBinding.requestContexts().then((aContexts) => {
                const OfferBanner = aContexts.map(oContext => oContext.getObject());
                console.log("OfferBanners:", OfferBanner);
                const OfferBannerModel = new JSONModel({
                    banners: OfferBanner
                });

                this.getView().setModel(OfferBannerModel, "OfferBanner");

            }).catch((oError) => {
                console.error("OData V4 error:", oError);
            });
        },
        selectProduct(oEvent) {
            const oContext = oEvent.getSource().getBindingContext();
            // oContext.setProperty('basePrice',0.00);
            // oContext.delete();
            console.log(oContext);
            const sProductId = oContext.getProperty("ID");
            this.getOwnerComponent().getRouter().navTo("ProductDisplay", {
                productId: sProductId, productType: 'BaseProduct'
            });
        }, searchProduct(oEvent) {
            console.log(oEvent.getParameters());
            console.log(oEvent.getSource());
        }
    });
});