const models = require('../dabase/models/index');


module.exports = {
  muestraStockProv: async (req, res) => {
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";

    try {
      const depoProvinciaStock = await models.DepoProvinciaStock.findAll({
        include: [
          {
            model: models.LoteProveedor,
            include: [
              {
                model: models.Vacuna,
                attributes: ["tipoVacuna", "nombreComercial", "paisOrigen"],
                include: [
                  {
                    model: models.Laboratorio,
                    attributes: ["nombre"],
                  },
                ],
              },
            ],
          },
          {
            model: models.DepositoProv,
            include: [
              {
                model: models.Localidad,
                attributes: ["provincia", "ciudad"],
              },
            ],
          },
        ],
      });
      console.log("depoProvinciaStock", depoProvinciaStock);

      const resultado = depoProvinciaStock.map((stock) => {
        const fechaRecepcion = new Date(stock.fechaRecepcion);
        const fechaFormateada = fechaRecepcion.toISOString().slice(0, 10);
        const fechaRecepcionFormateada = stock.fechaRecepcion ? fechaFormateada : null;
        return {
          id: stock.id,
          idLote: stock.LoteProveedor.idLote,
          tipoVacuna: stock.LoteProveedor.Vacuna.tipoVacuna,
          nombreComercial: stock.LoteProveedor.Vacuna.nombreComercial,
          nombreLaboratorio: stock.LoteProveedor.Vacuna.Laboratorio.nombre,
          fechaFabricacion: stock.LoteProveedor.fechaFabricacion,
          fechaVencimiento: stock.LoteProveedor.fechaVencimiento,
          vencida: stock.LoteProveedor.vencida,
          idDepoProv: stock.DepositoProv.idDepoProv,
          ciudad: stock.DepositoProv.Localidad.ciudad,
          provincia: stock.DepositoProv.Localidad.provincia,
          direccion: stock.DepositoProv.direccion,
          cantVacunas: stock.cantVacunas,
          estado: stock.estado,
          fechaRecepcion: fechaRecepcionFormateada,
        };
      });

      res.render("depositoProvinciaStock", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        resultado,
      });
    } catch (error) {
      console.error("Error al obtener las compras", error);
      res.sendStatus(500);
    }
  },
  muestraStockProvRecep: async (req, res) => {
    if (req.body !== undefined) {
      const id = req.params.id;
      const fechaRecepcion = req.body.fechaRecepcion;
      try {
        const depoProvStock = await models.DepoProvinciaStock.findOne({ where: { id: id } });
        console.log(depoProvStock.fechaRecepcion);
        depoProvStock.fechaRecepcion = fechaRecepcion;
        if (depoProvStock.estado !== "descartado") {
          depoProvStock.estado = "enStock";
        }

        await depoProvStock.save();
        res.render("depositoProvinciaStock", {
          alert: true,
          alertTitle: "Tarea Exitosa",
          alertMessage: "Recepción realizada Correctamente",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1800,
          ruta: "api/stocksProvincias/depositoProvinciaStock",
          resultado: ["a"],
          resultadoDepo: ["a"],
        });
      } catch (error) {
        res.render("depositoProvinciaStock", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "No se pudo hacer la Recepción",
          alertIcon: "error",
          showConfirmButton: true,
          ruta: "api/stocksProvincias/depositoProvinciaStock",
          resultado: ["a"],
          resultadoDepo: ["a"],
        });
      }
    } else {
      res.render("depositoProvinciaStock", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Complete el campo fecha",
        alertIcon: "warning",
        showConfirmButton: true,
        ruta: "api/stocksProvincias/depositoProvinciaStock",
        resultado: ["a"],
        resultadoDepo: ["a"],
      });
    }
  },
  editarLoteProv: async (req, res) => {
    const idLote = req.params.id;
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";
    console.log(req.body);
    try {
      const loteProveedor = await models.LoteProveedor.findAll({
        include: [
          {
            model: models.Vacuna,
            attributes: ["tipoVacuna", "nombreComercial", "paisOrigen"],
            include: [
              {
                model: models.Laboratorio,
                attributes: ["nombre"],
              },
            ],
          },
          {
            model: models.DepositoNacion,
            include: [
              {
                model: models.Localidad,
                attributes: ["provincia", "ciudad"],
              },
            ],
            as: "Deposito", // Actualiza el alias aquí
            attributes: ["direccion", "telefono"],
          },
        ],
      });


      const depoProvinciaStock = await models.DepoProvinciaStock.findOne({
        where: { idDepoProv: idLote },
        include: [
          {
            model: models.LoteProveedor,
            include: [
              {
                model: models.Vacuna,
                attributes: ["tipoVacuna", "nombreComercial", "paisOrigen"],
                include: [
                  {
                    model: models.Laboratorio,
                    attributes: ["nombre"],
                  },
                ],
              },
            ],
          },
          {
            model: models.DepositoProv,
            include: [
              {
                model: models.Localidad,
                attributes: ["provincia", "ciudad"],
              },
            ],
          },
        ],
      });
      console.log(depoProvinciaStock)
      const loteProvincia = {
        idLote: depoProvinciaStock.LoteProveedor.idLote,
        tipoVacuna: depoProvinciaStock.LoteProveedor.Vacuna.tipoVacuna,
        nombreComercial: depoProvinciaStock.LoteProveedor.Vacuna.nombreComercial,
        nombreLaboratorio: depoProvinciaStock.LoteProveedor.Vacuna.Laboratorio.nombre,
        fechaFabricacion: depoProvinciaStock.LoteProveedor.fechaFabricacion,
        fechaVencimiento: depoProvinciaStock.LoteProveedor.fechaVencimiento,
        idDepoProv: depoProvinciaStock.DepositoProv.idDepoProv,
        ciudad: depoProvinciaStock.DepositoProv.Localidad.ciudad,
        provincia: depoProvinciaStock.DepositoProv.Localidad.provincia,
        direccion: depoProvinciaStock.DepositoProv.direccion,
        cantVacunas: depoProvinciaStock.cantVacunas,
        estado: depoProvinciaStock.estado,
        origen: depoProvinciaStock.LoteProveedor.Vacuna.paisOrigen,
        fechaRecepcion: depoProvinciaStock.fechaRecepcion,
      };
      console.log(loteProvincia)




      const resultadoAux = loteProveedor.map((lote) => {
        if (lote.estado === "enStock" && lote.cantVacunas > 0) {
          const fechaAplicacion = new Date(aplicacion.fechaAplicacion);
          return {
            idLote: lote.idLote,
            tipoVacuna: lote.Vacuna.tipoVacuna,
            nombreComercial: lote.Vacuna.nombreComercial,
            nombreLaboratorio: lote.Vacuna.Laboratorio.nombre,
            paisOrigen: lote.Vacuna.paisOrigen,
            fechaFabricacion: lote.fechaFabricacion,
            fechaVencimiento: lote.fechaVencimiento,
            deposito: `${lote.idDepoNacion}-${lote.Deposito.Localidad.provincia} - ${lote.Deposito.Localidad.ciudad}`,
            vencida: lote.vencida,
            cantVacunas: lote.cantVacunas,
            fechaAdquisicion: lote.fechaAdquisicion,
          };
        } else {
          return;
        }
      });
      const resultado = resultadoAux.filter((item) => item !== undefined);

      //obtencion de depositosProvincia
      const depositosProvincia = await models.DepositoProv.findAll({
        include: [
          {
            model: models.Localidad,
            attributes: ["provincia", "ciudad"],
          },
        ],
      });

      const resultadoDepoProv = depositosProvincia.map((depo) => {
        return {
          idDepoProv: depo.idDepoProv,
          provincia: depo.Localidad.provincia,
          ciudad: depo.Localidad.ciudad,
          direccion: depo.direccion,
        };
      });

      // console.log(resultado);
      res.render("editarLotesProv", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        resultado,
        resultadoDepoProv,
        idLote,
        loteProvincia
      });
    } catch (error) {
      console.error("Error al obtener las compras", error);
      res.sendStatus(500);
    }
  },
  editarLoteProvPost: async (req, res) => {
    console.log("INICIA!!!!!!!!!!!!!!!");
    const idLoteProv = req.params.id;
    const idLote = req.body.loteSelect;
    const cantVacunas = req.body.cantidadVacunas;
    const idDeposito = req.body.deposito;
    const fechaRecepcion = req.body.fechaRecepcion;
    const devolverVacuna = req.body.devolverVacuna;
    console.log(req.body);
    console.log("idLoteProv");
    console.log(idLoteProv);
    console.log("cantVacunas");
    console.log(cantVacunas);
    console.log("idDeposito");
    console.log(idDeposito);
    console.log("fechaRecepcion");
    console.log(fechaRecepcion);

    console.log("idLote");
    console.log(idLote);
    try {
      const loteProvinciaOriginal = await models.DepoProvinciaStock.findByPk(idLoteProv, {
        include: [
          {
            model: models.LoteProveedor,
            include: [
              {
                model: models.Vacuna,

                include: [
                  {
                    model: models.Laboratorio,
                  },
                ],
              },
            ],
          },
          {
            model: models.DepositoProv,
            include: [
              {
                model: models.Localidad,
              },
            ],
          },
        ],
      });
      if (
        loteProvinciaOriginal.estado !== "descartado" &&
        loteProvinciaOriginal.estado !== "sinStock"
      ) {
        if (idLote !== "" && idLote !== "-") {
          const loteProveedorOriginal = await models.LoteProveedor.findByPk(
            loteProvinciaOriginal.idLote
          );
          const loteProveedorNuevo = await models.LoteProveedor.findByPk(idLote);
          if (devolverVacuna) {
            if (
              cantVacunas !== "" &&
              loteProveedorNuevo.cantVacunas >= Number(cantVacunas)
            ) {
              //dolviendo vacunas al lote original
              loteProveedorNuevo.cantVacunas =
                loteProveedorNuevo.cantVacunas - Number(cantVacunas);
              loteProveedorOriginal.cantVacunas =
                loteProveedorOriginal.cantVacunas + loteProvinciaOriginal.cantVacunas;

              loteProvinciaOriginal.cantVacunas = Number(cantVacunas);

              //estado a sin stock si luego de cambio de stock la cantidad de vacunas es 0
              if (loteProveedorNuevo.cantVacunas === 0) {
                loteProveedorNuevo.estado = "sinStock";
                console.log("==========");
                console.log("ENTRO 2");
                console.log("==========");
              }
              await loteProveedorNuevo.save();
              await loteProveedorOriginal.save();

              loteProvinciaOriginal.idLote = idLote;
            } else if (
              cantVacunas === "" &&
              loteProveedorNuevo.cantVacunas >= loteProvinciaOriginal.cantVacunas
            ) {
              console.log("==========");
              console.log("ENTRO 3");
              console.log("==========");
              loteProveedorNuevo.cantVacunas =
                loteProveedorNuevo.cantVacunas - loteProvinciaOriginal.cantVacunas;
              loteProveedorOriginal.cantVacunas =
                loteProveedorOriginal.cantVacunas + loteProvinciaOriginal.cantVacunas;
              if (loteProveedorNuevo.cantVacunas === 0) {
                loteProveedorNuevo.estado = "sinStock";
              }
              await loteProveedorNuevo.save();
              await loteProveedorOriginal.save();
              loteProvinciaOriginal.idLote = idLote;
            } else {
              return res.render("depositoProvinciaStock", {
                alert: true,
                alertTitle: "ERROR",
                alertMessage:
                  "El nuevo lote es menor a la cantidad de vacunas",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: "api/stocksProvincias/depositoProvinciaStock",
                resultado: ["a"],
              });
            }
          } else {
            if (cantVacunas !== "") {
              loteProvinciaOriginal.idLote = idLote;
              loteProvinciaOriginal.cantVacunas = cantVacunas;
            } else {
              loteProvinciaOriginal.idLote = idLote;
            }
          }
        }

        if (idLote === "" || (idLote === "-" && cantVacunas !== "")) {
          loteProvinciaOriginal.cantVacunas = cantVacunas;
        }

        if (idDeposito !== "-" && idDeposito !== "") {
          loteProvinciaOriginal.idDepoNacion = idDeposito;
        }

        if (fechaRecepcion !== "") {
          loteProvinciaOriginal.fechaRecepcion = fechaRecepcion;
          console.log("ESTADOOOOOO");
          console.log(loteProvinciaOriginal.estado);
          if (loteProvinciaOriginal.estado !== "descartado") {
            loteProvinciaOriginal.estado = "enStock";
          }
        }

        await loteProvinciaOriginal.save();

        res.render("depositoProvinciaStock", {
          alert: true,
          alertTitle: "Modificación Exitosa",
          alertMessage: "Modificación realizada correctamente",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1200,
          ruta: "api/stocksProvincias/depositoProvinciaStock",
          resultado: ["a"],
        });
      } else {
        return res.render("depositoProvinciaStock", {
          alert: true,
          alertTitle: "ERROR",
          alertMessage: "No se realizó la Modificación ",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "api/stocksProvincias/depositoProvinciaStock",
          resultado: ["a"],
        });
      }
    } catch (error) {
      console.log(error);
      res.render("depositoProvinciaStock", {
        alert: true,
        alertTitle: "ERROR",
        alertMessage: "No se realizó la Modificación",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "api/stocksProvincias/depositoProvinciaStock",
        resultado: ["a"],
      });
    }
  },
};
