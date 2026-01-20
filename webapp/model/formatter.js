sap.ui.define([], function () {
    "use strict";

    return {
        totalStockQuantity(aStocks) {
            if (!Array.isArray(aStocks)) {
                return 0;
            }

            return aStocks.reduce((sum, stock) => {
                return sum + (stock.quantity || 0);
            }, 0);
        },
        stockState(aStocks) {
            if (!Array.isArray(aStocks)) {
                return "None";
            }

            const total = aStocks.reduce((sum, stock) => {
                return sum + (stock.quantity || 0);
            }, 0);

            if (total === 0) {
                return "Error";
            } else if (total <= 10) {
                return "Warning";
            }
            return "Success";
        }, isAddToCartEnabled(aStocks) {
            if (!Array.isArray(aStocks)) {
                return false;
            }

            const totalQuantity = aStocks.reduce((sum, stock) => {
                return sum + (stock.quantity || 0);
            }, 0);
            return totalQuantity > 0;
        }
    };
});
