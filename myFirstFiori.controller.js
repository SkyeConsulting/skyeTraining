sap.ui.define([
    'sap/ui/core/mvc/Controller'
    ], function(Controller) {
        "use strict";

    var controller = Controller.extend("skye.training.myFirstFiori", {

        onInit: function() {
            console.log("myFirstFiori - onInit");

            sap.ui.getCore().getEventBus().subscribe("myFirstFiori", "gotData", this.gotData, this);
        },

        onPress: function(oEvent){
            console.log("myFirstFiori - onPress");

            var oModel    = new sap.ui.model.odata.ODataModel({serviceUrl: "/sap/opu/odata/SAP/ZSASIMEN_SRV/"});

            oModel.read("/UserSet", null, null, true,
                function(oData) {
                    console.log("Data ble hentet");
                    sap.ui.getCore().getEventBus().publish("myFirstFiori", "gotData", oData);
                },
                function(oError) {
                    console.log("Det gikk til helvete");
                });
        },

        gotData: function(channelId,eventId,oData){
            // vi lager en ny json modell fordi den er enklere å jobbe med.
            var oModel = new sap.ui.model.json.JSONModel();

            // legg inn data i modellen
            oModel.setData(oData);

            // bind modellen til viewet
            this.getView().setModel(oModel);
        }

    });

    return controller;

});