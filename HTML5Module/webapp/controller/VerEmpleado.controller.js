sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/m/MessageBox",
        "sap/ui/core/UIComponent",
        "sap/ui/model/json/JSONModel",
        "sap/m/MessageToast"
	],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.m.MessageBox} MessageBox
     * @param {typeof sap.ui.core.UIComponent} UIComponent
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.m.MessageToast} MessageToast
     */
	function (Controller, MessageBox, UIComponent, JSONModel, MessageToast) {
		"use strict";

        function onInit() {
            this._splitAppEmpleado = this.byId("splitAppEmpleado");
        };

        //Funcion del botón regresar
        function onPressBack(){
            //ir al launchpad
            var oRouter = UIComponent.getRouterFor(this);
            oRouter.navTo("Launchpad", {}, true)
        };

        function onSeleccionarEmpleado(oEvent){
            //Se navega al detalle del empleado
            this._splitAppEmpleado.to(this.createId("detalleEmpleado"));
            var context = oEvent.getParameter("listItem").getBindingContext("oDataModel");
            //Se almacena el usuario seleccionado
            this.employeeId = context.getProperty("EmployeeId");
            var detalleEmpleado = this.byId("detalleEmpleado");
            //Se hace el binding a la vista con la entidad User y las claves del ID del empleado
            detalleEmpleado.bindElement("oDataModel>/Users(EmployeeId='"+this.employeeId+"',SapId='"+this.getOwnerComponent().SapId+"')");
        };
        
        //Funcion para dar de baja al empleado seleccionado
        function onDarBajaEmpleado(oEvent){
            //Primero se muestra un mensaje de confirmacion
            MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("estaSeguroEliminar"),{
                title: this.getView().getModel("i18n").getResourceBundle().getText("confirmar"),
                onClose: function(oAction){
                    if(oAction === "OK"){
                        //Se llama a la funcion remove
                        this.getView().getModel("oDataModel").remove("/Users(EmployeeId='"+this.employeeId+ "',SapId='"+this.getOwnerComponent().SapId+"')",{
                            success: function(data){
                                MessageBox.show(this.getView().getModel("i18n").getResourceBundle().getText("seEliminoUsuario"));
                                //En el detalle se muestra el mensaje <<Seleccione empleado
                                this._splitAppEmpleado.to(this.createId("detalleSelectEmpleado"));
                            }.bind(this),
                            error: function(e){
                                sap.base.Log.info(e);
                            }.bind(this)
                        });
                    }
                }.bind(this)
            });
        };

        function onAscenderEmpleado(oEvent){
            if(!this.riseDialog){
                this.riseDialog = sap.ui.xmlfragment("jimmy.HTML5Module/fragment/AscenderEmpleado",this);
                this.getView().addDependent(this.riseDialog);
            };
            this.riseDialog.setModel(new JSONModel({}), "nuevoAscensoModel");
            this.riseDialog.open();
        };

        function onCloseRiseDialog(){
            this.riseDialog.close();
        };

        function onNuevoAscenso(oEvent){
            //Se obtiene el modelo nuevoAscensoModel
            var nuevoAscenso = this.riseDialog.getModel("nuevoAscensoModel");
            //Se obtiene los datos
            var oData = nuevoAscenso.getData();
            //Se prepara la información con el json
            var body = {
                Ammount : oData.Ammount,
                CreationDate : oData.CreationDate,
                Comments : oData.Comments,
                SapId : this.getOwnerComponent().SapId,
                EmployeeId : this.employeeId
            };
            this.getView().setBusy(true);
            this.getView().getModel("oDataModel").create("/Salaries",body,{
                success: function(){
                    this.getView().setBusy(false);
                    MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ascensoOK"));
                    this.onCloseRiseDialog();
                }.bind(this),
                error: function(){
                    this.getView().setBusy(false);
                    MessageToast.show(this.getView().getModel("i18n").getResourceBundle().getText("ascensoKO"));
                }.bind(this)
            });
        };

        var LaunchpadMain = Controller.extend("jimmy.HTML5Module.controller.VerEmpleado", {});

        LaunchpadMain.prototype.onInit = onInit;
        LaunchpadMain.prototype.onSeleccionarEmpleado = onSeleccionarEmpleado;
        LaunchpadMain.prototype.onDarBajaEmpleado = onDarBajaEmpleado;
        LaunchpadMain.prototype.onPressBack = onPressBack;
        LaunchpadMain.prototype.onAscenderEmpleado = onAscenderEmpleado;
        LaunchpadMain.prototype.onCloseRiseDialog = onCloseRiseDialog;
        LaunchpadMain.prototype.onNuevoAscenso = onNuevoAscenso;

        return LaunchpadMain;

	});
