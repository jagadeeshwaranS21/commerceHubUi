sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Messaging",
    "sap/m/Popover",
    "sap/m/List",
    "sap/m/StandardListItem"
], function (
    Controller,
    MessageToast,
    JSONModel,
    Messaging,
    Popover,
    List,
    StandardListItem
) {
    "use strict";

    return Controller.extend("ecommercehub.controller.Checkout", {

        onInit() {
            const oViewModel = new JSONModel({
                delivery: {
                    street: "",
                    city: "",
                    state: "",
                    country: "",
                    postalcode: ""
                },
                map: {
                    lat: 13.0827,
                    lng: 80.2707
                },
                locationResults: [],
                selectedLocationIndex: 0, paymentMethod: "CARD",
                card: {
                    number: "",
                    name: "",
                    expiry: "",
                    cvv: ""
                }
            });

            this.getView().setModel(oViewModel, "view");

            Messaging.registerObject(this.getView(), true);

            const oProvider = this.byId("mapProvider");
            const osm = sap.ui.require.toUrl("ecommercehub/model/osm.json");
            setTimeout(() => {
                oProvider.setStyleUrl(`${window.location.origin}/${osm}`);
            });
        },
        onLocationSelectionChange(oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oLocation = oItem.getBindingContext("view").getObject();
            this._updateMap(oLocation);
        }
        ,

        checkAddress() {
            const oODataModel = this.getOwnerComponent().getModel();
            const oViewModel = this.getView().getModel("view");

            const delivery = oViewModel.getProperty("/delivery");

            const oActionContext = oODataModel.bindContext("/findLocation(...)");

            oActionContext.setParameter("address", {
                street: delivery.street,
                city: delivery.city,
                state: delivery.state,
                country: delivery.country,
                postalcode: delivery.postalcode
            });

            oActionContext.execute().then(() => {
                const aResults =
                    oActionContext.getBoundContext().getObject().value;

                if (!aResults || !aResults.length) {
                    MessageToast.show("No locations found");
                    return;
                }

                this._handleLocationResponse(aResults);
            }).catch((err) => {
                console.error(err);
            });
        },

        _handleLocationResponse(aLocations) {
            const oViewModel = this.getView().getModel("view");

            oViewModel.setProperty("/locationResults", aLocations);

            oViewModel.setProperty("/selectedLocationIndex", 0);

            this._updateMap(aLocations[0]);
        },

        onLocationSelect(oEvent) {
            const iIndex = oEvent.getParameter("listItem")
                .getBindingContext("view")
                .getPath()
                .split("/")
                .pop();

            const oViewModel = this.getView().getModel("view");
            const oLocation =
                oViewModel.getProperty(`/locationResults/${iIndex}`);

            oViewModel.setProperty("/selectedLocationIndex", iIndex);

            this._updateMap(oLocation);
        },

        _updateMap(oLocation) {
            const oViewModel = this.getView().getModel("view");
            const lat = parseFloat(oLocation.lat);
            const lng = parseFloat(oLocation.lon);

            const oMap = this.byId("deliveryMap");

            oMap.setCenterLat(lat);
            oMap.setCenterLng(lng);
            oViewModel.setProperty("/map/lat", parseFloat(oLocation.lat));
            oViewModel.setProperty("/map/lng", parseFloat(oLocation.lon));
        },

        spotClick(oEvent) {
            const oTarget = oEvent.getSource();

            const oPopover = new Popover({
                title: "Location Info",
                content: [
                    new List({
                        items: [
                            new StandardListItem({
                                title: `Latitude: ${oTarget.getLat()}`
                            }),
                            new StandardListItem({
                                title: `Longitude: ${oTarget.getLng()}`
                            })
                        ]
                    })
                ]
            });

            oTarget.addDependent(oPopover);
            oPopover.openBy(oTarget);
        }

    });
});
