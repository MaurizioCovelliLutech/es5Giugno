sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/SearchField",
    "sap/m/Dialog",
    "sap/m/List",
    "sap/m/StandardListItem",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"

], function(Controller, SearchField, Dialog, List, StandardListItem,ODataModel,JSONModel,Fragment,MessageBox) {
    "use strict";

    const sURL = "/V2/Northwind/Northwind.svc/";

    // Mostrare inoltre i dati anagrafici dell’impiegato, ovvero Nome (FirstName), Cognome (LastName), 
    // Data assunzione (HireDate, formattata gg/mm/yyyy), Titolo (Title)

    return Controller.extend("project1.controller.View1", {

        onInit: function () {

			const oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteView1").attachPatternMatched(this.onRouteMatched, this);
        }
    })

})
