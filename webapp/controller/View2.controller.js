sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/SearchField",
    "sap/m/Dialog",
    "sap/m/List",
    "sap/m/StandardListItem",
	  "sap/ui/model/odata/v2/ODataModel",
	  "sap/ui/model/json/JSONModel",
	  "sap/ui/core/Fragment",
	  "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/export/Spreadsheet"

], function(Controller, SearchField, Dialog, List, StandardListItem,ODataModel,JSONModel,Fragment,MessageBox,Filter,FilterOperator,Spreadsheet) {
  "use strict";
  
    const sUrl = "/V2/Northwind/Northwind.svc/";

    return Controller.extend("project1.controller.View2", {

      onInit: function () {
        const oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("RouteView2").attachPatternMatched(this.onRouteMatched, this);

      },
      
      onRouteMatched: function (oEvent) {

        const sCompanyName = oEvent.getParameter("arguments").companyName;
        const sCustomerId = oEvent.getParameter("arguments").customerId;
        const sContactName = oEvent.getParameter("arguments").contactName;
        const sContactTitle = oEvent.getParameter("arguments").contactTitle;
        const sAddress = oEvent.getParameter("arguments").address;
        const sPostalCode = oEvent.getParameter("arguments").postalCode;

        this.chiamataCustomerDetails(sCustomerId,{
          companyName: sCompanyName,
          contactName: sContactName,
          contactTitle: sContactTitle,
          address: sAddress,
          postalCode: sPostalCode
    });
      },
  
      chiamataCustomerDetails: async function (sCustomerId,customerInfo) {
        const oModel = new sap.ui.model.odata.v2.ODataModel(sUrl);
  
        const oData = await new Promise((resolve, reject) => {
          oModel.read("/Orders", {
            filters: [new sap.ui.model.Filter("CustomerID", sap.ui.model.FilterOperator.EQ, sCustomerId)],
            success: function (oData) {
              resolve(oData);
            },
            error: function (oError) {
              reject(oError);
            }
          });
        });
  
        //this.getView().setModel(new JSONModel(oData.results), "customerDetail");

        //var aOrders = this.getView().getModel("customerDetail").getData();

       /*aOrders.forEach(order => {

          aOrders.oModel.setProperty(order, sCompanyName);

        })*/
           //var aOrders = oData.results;

            oData.results.forEach(order => {
              order.CompanyName = customerInfo.companyName
          });

            var oCustomerDetailModel = new JSONModel({
                orders: oData.results
           });

            var modInfo = new JSONModel({
                contactName: customerInfo.contactName,
                contactTitle: customerInfo.contactTitle,
                address: customerInfo.address,
                postalCode: customerInfo.postalCode
           });

            this.getView().setModel(oCustomerDetailModel, "customerDetail");
            this.getView().setModel(modInfo, "modInfo");


            this.deliveryStatus();
      },

      aggiungiCompanyName: function(sCompanyName){},
  
      deliveryStatus: function () {
        
        const oModel = this.getView().getModel("customerDetail");
        const aOrders = oModel.getData().orders;
        const giornoCorr = new Date("1996-07-27"); 
  
        const deliveryDays = {
          "Germany": 4,
          "Mexico": 12,
          "Sweden": 6,
          "France": 4,
          "Spain": 6,
          "Canada": 15,
          "Argentina": 18,
          "Switzerland": 3,
          "Brazil": 19,
          "UK": 5,
          "Austria": 3
        };
  
        aOrders.forEach(order => {
          const sCountry = order.ShipCountry;
          const sDeliveryDays = deliveryDays[sCountry] || 0;

          const oOrderDate = new Date(order.OrderDate);
          const oShippedDate = new Date(order.ShippedDate);
          const oRequiredDate = new Date(order.RequiredDate);

          const oDeliveryDate = new Date(oShippedDate);
          oDeliveryDate.setDate(oDeliveryDate.getDate() + sDeliveryDays);

          if (giornoCorr > oRequiredDate && giornoCorr > oDeliveryDate) {
              order.DeliveryStatus = "In Ritardo";
          } else if (giornoCorr > oDeliveryDate) {
              order.DeliveryStatus = "Consegnato";
          } else {
              order.DeliveryStatus = "In Progress";
          }
      });

  
        oModel.refresh();
      },
  
      onExport: function () {

        const oModel = this.getView().getModel("customerDetail");
        const aOrders = oModel.getData();
  
        const aColumns = [
          { label: "Order ID", property: "OrderID" },
          { label: "Ship City", property: "ShipCity" },
          { label: "Order Date", property: "OrderDate", type: "date" },
          { label: "Shipped Date", property: "ShippedDate", type: "date" },
          { label: "Required Date", property: "RequiredDate", type: "date" },
          { label: "Customer ID", property: "CustomerID" },
          { label: "Company Name", property: "Customer.CompanyName" },
          { label: "Country", property: "ShipCountry" },
          { label: "Delivery Status", property: "DeliveryStatus" }
        ];
  
        const oSettings = {
          workbook: {
            columns: aColumns
          },
          dataSource: aOrders,
          fileName: `CustomerOrders.xlsx`
        };
  
        const oSheet = new Spreadsheet(oSettings);
        oSheet.build().finally(function () {
          oSheet.destroy();
        });
      }
    });
  });
  