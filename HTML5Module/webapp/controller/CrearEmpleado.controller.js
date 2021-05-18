// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     */
    function (Controller, JSONModel) {
        "use strict";

        var tipoEmpleadoSelec;

        function onBeforeRendering() {

            this._wizard = this.byId("CreateEmpleadoWizard");
            this._model = new JSONModel({});
            this.getView().setModel(this._model);

            var oFirstStep = this._wizard.getSteps()[0];
            this._wizard.discardProgress(oFirstStep);

            this._wizard.goToStep(oFirstStep);
            oFirstStep.setValidated(false);

        };

        function toStep2(oEvent) {

            //Paso 1
            var tipoEmpleadoStep1 = this.byId("TipoEmpleadoStep1");

            //Paso 2
            var datosEmpleadoStep2 = this.byId("DatosEmpleadoStep2");

            //Obtenemos el texto del button
            var textButtonSel = oEvent.getParameter("item").getKey();
            tipoEmpleadoSelec = textButtonSel;

            //Desactivamos el botón next hasta que se complete lo obligatorio
            this._wizard.invalidateStep(this.byId("DatosEmpleadoStep2"));

            let salario, tipo;

            switch (textButtonSel) {
                case "INT":
                    salario = 24000;
                    tipo = "0";
                    break;
                case "AUT":
                    salario = 400;
                    tipo = "1";
                    break;
                case "GER":
                    salario = 70000;
                    tipo = "2";
                    break;
                default:
                    break;
            };

            //Al pulsar sobre el botón se sobre escribe el modelo 

            this._model.setData({
                _tipoEmpleado: textButtonSel,
                Tipo: tipo,
                _salario: salario,
                _nombreEmpleadoState: "Error",
                _apellidosEmpleadoState: "Error",
                _documentoEmpleadoState: "Error",
            });

            //Si se está en el paso 1 se pasa al paso 2
            if (this._wizard.getCurrentStep() === tipoEmpleadoStep1.getId()) {
                this._wizard.nextStep();
            } else {
                //Si es que ya se encuentra activo este paso se navega directamente
                this._wizard.goToStep(datosEmpleadoStep2);
                this._wizard.invalidateStep(this.byId("DatosEmpleadoStep2"));
            }            

        };

        //Función para validar los datos del formulario y poder al paso 3
        //Callback: función que se pasa como parámetro desde la función que se llama
        //para poder devolver el valor isValid en la función wizardCompletHandler
        function onValidacionDatosEmpleado(oEvent, callback) {

            var nombreEmpleado = this.byId("InNombreEmpleado").getValue();
            var apellidosEmpleado = this.byId("InApellidosEmpleado").getValue();
            var dniEmpleado = this.byId("InDocumentoEmpleado").getValue();
            var isValid = true;

            if (nombreEmpleado.length < 3) {
                this._model.setProperty("/_nombreEmpleadoState", "Error");
                isValid = false;
            } else {
                this._model.setProperty("/_nombreEmpleadoState", "None");
            };

            if (apellidosEmpleado.length < 3) {
                this._model.setProperty("/_apellidosEmpleadoState", "Error");
                isValid =  false;
            } else {
                this._model.setProperty("/_apellidosEmpleadoState", "None");
            };

            let validacionDocEmpleado;

            if (tipoEmpleadoSelec === 'INT' || tipoEmpleadoSelec === 'GER'){

                let number, letter, letterList;

                var regularExp = new RegExp(/^\d{8}[a-zA-Z]$/);
                //Se comprueba que el formato es válido
                if (regularExp.test(dniEmpleado) === true) {
                    //Número
                    number = dniEmpleado.substr(0, dniEmpleado.length - 1);
                    //Letra
                    letter = dniEmpleado.substr(dniEmpleado.length - 1, 1);
                    number = number % 23;
                    letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                    letterList = letterList.substring(number, number + 1);
                    if (letterList !== letter.toUpperCase()) {
                        this._model.setProperty("/_documentoEmpleadoState", "Error");
                        validacionDocEmpleado = false;
                        isValid = false;
                    } else {
                        this._model.setProperty("/_documentoEmpleadoState", "None");
                        validacionDocEmpleado = true;
                    }
                } else {
                    this._model.setProperty("/_documentoEmpleadoState", "Error");
                    validacionDocEmpleado = false;
                    isValid = false;
                };
            }else{
                if(isNaN(dniEmpleado)){
                    this._model.setProperty("/_documentoEmpleadoState", "Error");
                    validacionDocEmpleado = false;
                    isValid = false;
                }else{
                    this._model.setProperty("/_documentoEmpleadoState", "None");
                    validacionDocEmpleado = true;
                }               
            };

            if(nombreEmpleado.length < 3 || apellidosEmpleado.length < 3 || validacionDocEmpleado === false){
                this._wizard.invalidateStep(this.byId("DatosEmpleadoStep2"));
            }else{
                this._wizard.validateStep(this.byId("DatosEmpleadoStep2"));
            };
        };
        
        //Función al dar en el botón verificar
        function wizardCompleteHandler(oEvent){

            //Se comprueba que no haya error
            this.onValidacionDatosEmpleado(oEvent,function(isValid){
                if(isValid){
                    //Se navega a la página review
                    this._oNavContainer.to(this.byId("ResumenPage"));
                    //Se obtiene los archivos subidos
                    var uploadColletion = this.byId("UploadCollectionDocs");
                    var files = uploadColletion.getItems();
                    var numeroFiles = uploadColletion.getItems().length;
                    this._model.setProperty("/_numFiles",numeroFiles);

                    if(numeroFiles>0){
                        let arrayFiles = [];
                        for(let i in arrayFiles){
                            arrayFiles.push({DocName:files[i].getFileName(),MimeType:files[i].getMimeType()});
                        }
                    }else{
                        this._model.setProperty("/_files",[]);
                    }

                }else{
                    alert("dasdasdas");
                    this._wizard.goToStep(this.byId("DatosEmpleadoStep2"));
                }
            }.bind(this)); 
        }

        function onInit() {

            var oView = this.getView();
            this._oNavContainer = this.byId("wizardNavContainer");

            var oJSONModelTipoEmpleado = new JSONModel();
            oJSONModelTipoEmpleado.loadData("./model/mockdata/TipoEmpleado.json", false);
            oView.setModel(oJSONModelTipoEmpleado, "jsonTipoEmpleado");

        };

        var CrearEmpleadodMain = Controller.extend("jimmy.HTML5Module.controller.CrearEmpleado", {});
        CrearEmpleadodMain.prototype.onBeforeRendering = onBeforeRendering;
        CrearEmpleadodMain.prototype.onInit = onInit;
        CrearEmpleadodMain.prototype.toStep2 = toStep2;
        CrearEmpleadodMain.prototype.onValidacionDatosEmpleado = onValidacionDatosEmpleado;
        CrearEmpleadodMain.prototype.wizardCompleteHandler = wizardCompleteHandler;

        return CrearEmpleadodMain;

    });
