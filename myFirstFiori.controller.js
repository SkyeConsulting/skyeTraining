sap.ui.define([
	'sap/ui/core/mvc/Controller'
], function(Controller) {
	"use strict";

	var controller = Controller.extend("skye.training.myFirstFiori", {

		onInit: function() {
			//this.getStorageLocations();
			this.buildHierarchy();
		},

		onDebug: function(oEvent) {
			/*this.cleanModel();
			var iLevels = this.getLevels();
            
			var ob = this.getLevel1(1);
			ob = this.getLevel2(ob);
			ob = this.getLevel3(ob);*/

		},

		buildHierarchy: function() {

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setSizeLimit(10000);
			oModel.loadData("mockdata/locations.json", false, false);

			var data = oModel.getData().results;
			var tree = [];

			for (var i = 0; i < data.length; i++) {
				var pathParts = data[i].split('_');
				var locationType = pathParts.shift(); // Remove first blank element from the parts array.

				var currentLevel = tree; // initialize currentLevel to root

				for (var j = 0; j < pathParts.length; j++) {
					var existingPath = undefined; // jo, denne må være undefined

					for (var k = 0; k < currentLevel.length; k++) {
						if (currentLevel[k].name === pathParts[j]) {
							existingPath = currentLevel[k];
						}
					}

					if (existingPath) {
						currentLevel = existingPath.children;
					} else {
						var location = pathParts[j].split("~");
						var locationName = location[0];
						var comment = location[1];

						var newPart = {
							name: locationName,
							comment: comment || "",
							children: [],
							locationType: locationType
						};

						currentLevel.push(newPart);
						currentLevel = newPart.children;
					}
				}
			}

			oModel.setData({
				results: tree
			});
		
			this.getView().setModel(oModel, "storageLocationsModel");
			
			console.log(oModel.getData());
		},

		getLevel1: function(iLevel) {
			var oModel = new sap.ui.model.json.JSONModel();
			var aArray = [];
			var aHelper = [];
			var oData = this.getView().getModel("storageLocationsModel").getData();

			for (var i = 0; i < oData.length; i++) {
				if (aHelper.indexOf(oData[i][iLevel]) === -1) {
					aArray.push({
						level1: oData[i][iLevel]
					});

					aHelper.push(oData[i][iLevel]); // lazy development - 
				}
			}
			return aArray;
		},

		getLevel2: function(lvl1) {
			var aHelper = [];
			var oData = this.getView().getModel("storageLocationsModel").getData();

			for (var i = 0; i < lvl1.length; i++) {
				for (var x = 0; x < oData.length; x++) {
					if (lvl1[i].level1 === oData[x][1]) { // level1 = oData plant
						if (aHelper.indexOf(oData[x][2]) === -1 && oData[x][2] !== undefined) { // finnes ikke fra før
							aHelper.push(oData[x][2]);
						}
					}
				}
				lvl1[i].lagere = aHelper;
				aHelper = [];
			}
			return lvl1;
		},

		getLevel3: function(lvl1) {
			var aHelper = [];
			var oData = this.getView().getModel("storageLocationsModel").getData();

			for (var i = 0; i < lvl1.length; i++) {
				for (var x = 0; x < oData.length; x++) {
					if (lvl1[i].level1 === oData[x][1]) {
						console.log(lvl1[i].level1);
					}
				}
			}
			return lvl1;
		},

		getStorageLocations: function() {
			// denne skal hente alle mulighe storage locations fra en service.
			var oModel = new sap.ui.model.json.JSONModel();

			oModel.loadData("/mockdata/tileCollection.json");
			this.getView().setModel(oModel, "storageLocationsModel");
		},

		cleanModel: function() {
			var oData = this.getView().getModel("storageLocationsModel").getData();
			var aArray = [];

			for (var i = 0; i < oData.results.length; i++) {
				// create an array of arrays and remove the description junk. Yeah, because it is junk, is it not?
				oData.results[i].desc.indexOf("+");
				aArray.push(oData.results[i].desc.substr(0, oData.results[i].desc.indexOf("+")).split("-"));
			}

			this.getView().getModel("storageLocationsModel").setData(aArray);
		},

		getLevels: function() {
			var oData = this.getView().getModel("storageLocationsModel").getData();
			var iLevels = 0;

			for (var i = 0; i < oData.length; i++) {
				if (oData[i].length > iLevels) {
					iLevels = oData[i].length;
				}
			}

			return iLevels;
		}

	});

	return controller;

});