sap.ui.define([
		"sap/ui/core/mvc/Controller"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
	function (Controller) {
		"use strict";

        function onInit() {
            
        };
        
        function navToCrearEmpleadoView(){
            //Se obtiene el conjuntos de routers del programa
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //Se navega hacia el router "CreateEmployee"
            oRouter.navTo("CrearEmpleado", {}, false);            
        };

        function navToVerEmpleadoView(){

            //Se obtiene el conjuntos de routers del programa
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //Se navega hacia el router "CreateEmployee"
            oRouter.navTo("VerEmpleado", {}, false);                

        };

        var LaunchpadMain = Controller.extend("jimmy.HTML5Module.controller.Launchpad", {});

        LaunchpadMain.prototype.onInit = onInit;
        LaunchpadMain.prototype.navToCrearEmpleadoView = navToCrearEmpleadoView;
        LaunchpadMain.prototype.navToVerEmpleadoView = navToVerEmpleadoView;

        return LaunchpadMain;

	});
