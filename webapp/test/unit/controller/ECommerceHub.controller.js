/*global QUnit*/

sap.ui.define([
	"ecommercehub/controller/ECommerceHub.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ECommerceHub Controller");

	QUnit.test("I should test the ECommerceHub controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
