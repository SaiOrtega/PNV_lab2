const { Op } = require('sequelize');
const models = require('../dabase/models/index');


module.exports = {
  envioVacunas: async (req, res) => {
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";

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

      console.log("lote buscado", loteProveedor);

      const resultadoAux = loteProveedor.map((lote) => {
        if (lote.estado === "enStock" && lote.cantVacunas > 0) {
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

      console.log('----', resultado);
      res.render("envioVacunas", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        resultado,
        resultadoDepoProv,
      });
    } catch (error) {
      console.error("Error al obtener las compras", error);
      res.sendStatus(500);
    }
  },

  envioVacunasPost: async (req, res) => {
    const depositoProvId = req.body.deposito;
    const lotes = req.body;
    const alertas = {
      envioCorrecto: {
        alert: true,
        alertTitle: "Tarea Exitosa",
        alertMessage: "Se realizó el envío de vacunas",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 1500,
        ruta: "api/lotes/envioVacunas",
      },
      envioIncorrecto: {
        alert: true,
        alertTitle: "Error",
        alertMessage:
          "Vacunas no enviadas- motivos posibles: falta de stock o vacunas vencidas.Debe descartar vacunas vencidas",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "api/lotes/envioVacunas",
      },
      errorDeposito: {
        alert: true,
        alertTitle: "Error ",
        alertMessage: "Seleccione un depósito",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "api/lotes/envioVacunas",
      },
    };
    let allLotesDispatched = true;

    if (depositoProvId !== "-") {
      for (const loteId in lotes) {
        if (!isNaN(loteId)) {
          const cantidadEnvio = Number(lotes[loteId]);
          if (cantidadEnvio > 0) {
            try {
              const lote = await models.LoteProveedor.findOne({ where: { idLote: loteId } });
              if (lote.cantVacunas >= cantidadEnvio && !lote.vencida) {
                lote.cantVacunas -= cantidadEnvio;
                if (lote.cantVacunas === 0) {
                  lote.estado = "sinStock";
                }
                await lote.save();

                const depoProvinciaStock = await models.DepoProvinciaStock.findOne({
                  where: {
                    idDepoProv: depositoProvId,
                    idLote: Number(loteId)
                  }
                });

                if (depoProvinciaStock) {
                  depoProvinciaStock.cantVacunas += cantidadEnvio;
                  await depoProvinciaStock.save();
                } else {
                  await models.DepoProvinciaStock.create({
                    idDepoProv: depositoProvId,
                    idLote: loteId,
                    cantVacunas: cantidadEnvio,
                  });
                }
              } else {
                allLotesDispatched = false;
              }
            } catch (error) {
              console.error("Error al crear los elementos de depoprovinciastock:", error);
              res.sendStatus(500);
            }
          }
        }
      }
      const alerta = allLotesDispatched
        ? alertas.envioCorrecto
        : alertas.envioIncorrecto;
      res.render("envioVacunas", alerta);
    } else {
      res.render("envioVacunas", alertas.errorDeposito);
    }
  },

  envioVacunasCentro: async (req, res) => {
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";

    try {
      const depoProvinciaStock = await models.DepoProvinciaStock.findAll({
        include: [
          {
            model: models.DepositoProv,
            attributes: ["direccion"],
            include: [
              {
                model: models.Localidad,
                attributes: ["idLocalidad", "provincia", "ciudad"],
              },
            ],
          },
          {
            model: models.LoteProveedor,
            include: [
              {
                model: models.Vacuna,
                include: [
                  {
                    model: models.Laboratorio,
                    attributes: ["nombre"],
                  },
                ],
                attributes: ["tipoVacuna", "nombreComercial"],
              },
            ],
            attributes: ["idLote", "fechaFabricacion", "fechaVencimiento", "vencida"],
          },
        ],
      });


      const resultadoAux = depoProvinciaStock.map((aux) => {
        if (aux.cantVacunas > 0 && aux.estado === "enStock") {
          return {
            idSublote: aux.id,
            idDepoProv: aux.idDepoProv,
            direccion: aux.DepositoProv.direccion,
            idLocalidad: aux.DepositoProv.Localidad.idLocalidad,
            provincia: aux.DepositoProv.Localidad.provincia,
            ciudad: aux.DepositoProv.Localidad.ciudad,
            idLote: aux.LoteProveedor.idLote,
            tipoVacuna: aux.LoteProveedor.Vacuna.tipoVacuna,
            vencida: aux.LoteProveedor.vencida,
            nombreComercial: aux.LoteProveedor.Vacuna.nombreComercial,
            nombreLaboratorio: aux.LoteProveedor.Vacuna.Laboratorio.nombre,
            fechaFabricacion: aux.LoteProveedor.fechaFabricacion,
            fechaVencimiento: aux.LoteProveedor.fechaVencimiento,
            cantVacunas: aux.cantVacunas,
          };
        }
      });


      const resultado = resultadoAux.filter((item) => item !== undefined);
      console.log("-------------");
      console.log(resultado);
      console.log("-------------");
      const centrosVacunacion = await models.CentroVacunacion.findAll({
        include: [
          {
            model: models.Localidad,
            attributes: ["provincia", "ciudad"],
          },
        ],
      });

      const resultadoCentros = centrosVacunacion.map((aux) => {
        return {
          idCentro: aux.idCentro,
          idLocalidad: aux.idLocalidad,
          provincia: aux.Localidad.provincia,
          ciudad: aux.Localidad.ciudad,
          direccion: aux.direccion,
          telefono: aux.telefono,
        };
      });

      res.render("envioVacunasCentros", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        resultado,

        resultadoCentros,
      });
    } catch (error) {
      console.error("Error al obtener las compras", error);
      res.sendStatus(500);
    }
  },
  envioVacunasPostCentro: async (req, res, next) => {
    const body = req.body;
    const idDeposito = req.body.deposito;
    const idCentro = req.body.centro;

    let flag = true;
    console.log(req.body);

    if (idCentro !== "-" && idDeposito !== "-" && req.body.provincia !== "-") {
      for (const key in body) {
        const cantVacunasEnviadas = Number(body[key]);
        const idSublote = Number(key);

        if (!isNaN(idSublote)) {
          if (cantVacunasEnviadas > 0) {
            try {
              const depositoProvStock = await models.DepoProvinciaStock.findOne({
                where: { id: idSublote },
              });

              if (cantVacunasEnviadas <= depositoProvStock.cantVacunas) {
                console.log(`ANTES: ${depositoProvStock.cantVacunas}`);
                depositoProvStock.cantVacunas =
                  depositoProvStock.cantVacunas - cantVacunasEnviadas;
                console.log(`DESPUES: ${depositoProvStock.cantVacunas}`);

                if (depositoProvStock.cantVacunas == 0) {
                  depositoProvStock.estado = "sinStock";
                }
                await depositoProvStock.save();
                const centroVacunacionStock = await models.CentroVacunacionStock.create({
                  idCentro: idCentro,
                  idSublote: idSublote,
                  cantVacunas: cantVacunasEnviadas,
                  fechaRecepcion: null,
                });
              } else {
                flag = false;
                console.log("==============");
                console.log("PASO 6");
                console.log("==============");
              }
            } catch (error) {
              console.error(
                "Error al crear los elementos de centrovacunacionstock:",
                error
              );
              res.sendStatus(500);
            }
          }
        }
      }

      if (!flag) {
        res.render("envioVacunasCentros", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "Vacunas no enviadas- motivos posibles: falta de stock o vacunas vencidas.Debe descartar vacunas vencidas",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "api/lotes/envioVacunasCentros",
          resultado: ["a"],
          resultadoDepoProv: ["a"],
        });
      } else {
        res.render("envioVacunasCentros", {
          alert: true,
          alertTitle: "Tarea Exitosa",
          alertMessage: "Se realizó el envío correctamente",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "api/lotes/envioVacunasCentros",
          resultado: ["a"],
          resultadoDepoProv: ["a"],
        });
      }
    } else {
      res.render("envioVacunasCentros", {
        alert: true,
        alertTitle: "Error",
        alertMessage: `Complete todos los Campos`,
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "api/lotes/envioVacunasCentros",
        resultado: ["a"],
        resultadoDepoProv: ["a"],
      });
    }
  },
  modificarEstado: async (req, res) => {
    if (req.body !== undefined) {
      try {
        const idLote = req.params.id;
        const fechaAdquisicion = req.body.fechaAdquisicion;

        const lote = await models.LoteProveedor.findOne({ where: { idLote: idLote } });
        if (lote.estado !== "descartado") {
          lote.estado = "enStock";
        }

        lote.fechaAdquisicion = fechaAdquisicion;
        await lote.save();
        res.render("modCompra", {
          alert: true,
          alertTitle: "Modificación de Estado",
          alertMessage: "Recepción realizada correctamente",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1200,
          ruta: "api/compras/modCompra",
          resultado: ["a"],
        });
      } catch (error) {
        res.render("modCompra", {
          alert: true,
          alertTitle: "Error",
          alertMessage: `No se pudo realizar la modificación Error: ${error}`,
          alertIcon: "error",
          showConfirmButton: true,
          ruta: "api/compras/modCompra",
          resultado: ["a"],
        });
      }
    } else {
      res.render("modCompra", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Complete el campo fecha",
        alertIcon: "warning",
        showConfirmButton: true,
        ruta: "api/compras/modCompra",
        resultado: ["a"],
      });
    }
  },

  mostrarLotesProvedor: async (req, res, next) => {


    try {
      const loteProveedorAux = await models.LoteProveedor.findAll({
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
      });

      const lotesProvedor = loteProveedorAux.map((lote) => {
        return {
          idLote: lote.idLote,
          tipoVacuna: lote.Vacuna.tipoVacuna,
          nombreLaboratorio: lote.Vacuna.Laboratorio.nombre,
          nombreComercial: lote.Vacuna.nombreComercial,
          paisOrigen: lote.Vacuna.paisOrigen,
          fechaFabricacion: lote.fechaFabricacion,
          fechaVencimiento: lote.fechaVencimiento,
          estado: lote.estado,
          fechaAdquisicion: lote.fechaAdquisicion,
          cantVacunas: lote.cantVacunas,
        };
      });

      const depoProvStockAux = await models.DepoProvinciaStock.findAll({
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
        ],
      });

      const depoProvStock = depoProvStockAux.map((stock) => {
        return {
          idLoteProv: stock.id,
          idLote: stock.LoteProveedor.idLote,
          tipoVacuna: stock.LoteProveedor.Vacuna.tipoVacuna,
          nombreComercial: stock.LoteProveedor.Vacuna.nombreComercial,
          nombreLaboratorio: stock.LoteProveedor.Vacuna.Laboratorio.nombre,
          vencida: stock.LoteProveedor.vencida,
          cantVacunas: stock.cantVacunas,
          estado: stock.estado,
          fechaRecepcion: stock.fechaRecepcion,
        };
      });

      const centroStockAux = await models.CentroVacunacionStock.findAll({
        include: [
          {
            model: models.DepoProvinciaStock,
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
            ],
            attributes: ["id", "idDepoProv"],
          },
        ],
      });

      const centroStock = centroStockAux.map((stock) => {
        return {
          idLoteCentro: stock.id,
          idSublote: stock.idSublote,
          idCentro: stock.idCentro,
          idLote: stock.DepoProvinciaStock.LoteProveedor.idLote,
          tipoVacuna: stock.DepoProvinciaStock.LoteProveedor.Vacuna.tipoVacuna,
          nombreComercial: stock.DepoProvinciaStock.LoteProveedor.Vacuna.nombreComercial,
          nombreLaboratorio:
            stock.DepoProvinciaStock.LoteProveedor.Vacuna.Laboratorio.nombre,
          vencida: stock.DepoProvinciaStock.LoteProveedor.vencida,
          cantVacunas: stock.cantVacunas,
          estado: stock.estado,
          fechaRecepcion: stock.fechaRecepcion,
        };
      });

      const vacunasAplicadasAux = await models.VacunasAplicada.findAll({
        include: [
          {
            model: models.CentroVacunacionStock,
            include: [
              {
                model: models.DepoProvinciaStock,
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
                ],
              },
            ],
          },
        ],
      });
      const vacunasAplicadas = {};

      vacunasAplicadasAux.forEach((item) => {
        const idLote = item.idLote;
        const cantidadElementos = vacunasAplicadas[idLote] || 0; // Si no existe, establecemos 0
        vacunasAplicadas[idLote] = cantidadElementos + 1; // Incrementamos la cantidad por "idLote"
      });
      console.log(vacunasAplicadas);

      /////////////
      const vacunasDescarte = await models.VacunasDescarte.findAll();
      const resultadosDescarte = [];

      for (const vacunaDescarte of vacunasDescarte) {
        let resultado;

        if (vacunaDescarte.tipoLote === "LoteNacion") {
          console.log("ENTRO LOTE COMPLETO");
          resultado = await models.LoteProveedor.findOne({
            where: {
              idLote: vacunaDescarte.idLote,
            },
            include: [
              {
                model: models.Vacuna,
                include: [
                  {
                    model: models.Laboratorio,
                    attributes: ["nombre", "pais"],
                  },
                ],
                attributes: ["tipoVacuna", "nombreComercial"],
              },
            ],
          });
        } else if (vacunaDescarte.tipoLote === "LoteProvincia") {
          console.log("ENTRO LOTE PROVINCIA");
          resultado = await models.DepoProvinciaStock.findOne({
            where: {
              id: vacunaDescarte.idLote,
            },
            include: [
              {
                model: models.LoteProveedor,
                include: [
                  {
                    model: models.Vacuna,
                    include: [
                      {
                        model: models.Laboratorio,
                        attributes: ["nombre", "pais"],
                      },
                    ],
                    attributes: ["tipoVacuna", "nombreComercial"],
                  },
                ],
              },
            ],
          });
        } else if (vacunaDescarte.tipoLote === "LoteCentro") {
          console.log("ENTRO LOTE CENTRO");
          resultado = await models.CentroVacunacionStock.findOne({
            where: {
              id: vacunaDescarte.idLote,
            },
            include: [
              {
                model: models.DepoProvinciaStock,
                include: [
                  {
                    model: models.LoteProveedor,
                    include: [
                      {
                        model: models.Vacuna,
                        include: [
                          {
                            model: models.Laboratorio,
                            attributes: ["nombre", "pais"],
                          },
                        ],
                        attributes: ["tipoVacuna", "nombreComercial"],
                      },
                    ],
                  },
                ],
              },
            ],
          });
        }

        if (resultado) {
          resultadosDescarte.push({
            idLote: vacunaDescarte.idLote,
            tipoLote: vacunaDescarte.tipoLote,
            cantVacunas: vacunaDescarte.cantVacunas,
          });
        }
      }
      console.log("RESULTADOS DESCARTE");
      console.log(resultadosDescarte);

      ////////////////

      const resultadoFinal = [];

      // Combinar los datos de los diferentes objetos y obtener las cantidades
      lotesProvedor.forEach((loteProveedor) => {
        const idLote = loteProveedor.idLote;

        const nuevoObjeto = {
          idLote,
          tipoVacuna: loteProveedor.tipoVacuna,
          nombreLaboratorio: loteProveedor.nombreLaboratorio,
          nombreComercial: loteProveedor.nombreComercial,
          paisOrigen: loteProveedor.paisOrigen,
          fechaFabricacion: loteProveedor.fechaFabricacion,
          fechaVencimiento: loteProveedor.fechaVencimiento,
          estado: loteProveedor.estado,
          fechaAdquisicion: loteProveedor.fechaAdquisicion,
          cantVacunasNacion: loteProveedor.cantVacunas,
          cantVacunasDistribucion: 0,
          cantVacunasProvincia: 0,
          cantVacunasCentroVac: 0,
          cantVacunasAplicadas: vacunasAplicadas[idLote] || 0,
          cantVacunasDescartadas: 0, // Agregar aquí la cantidad de vacunas descartadas por lote
          cantVacunasVencidas: 0, // Agregar aquí la cantidad de vacunas vencidas por lote
        };

        if (loteProveedor.estado === "descartado") {
          const descartesNacion = resultadosDescarte.filter(
            (descartes) => descartes.tipoLote === "LoteNacion"
          );
          console.log("DESCARTE NACION");
          console.log(descartesNacion);
          descartesNacion.forEach((descarte) => {
            if (descarte.idLote === loteProveedor.idLote) {
              nuevoObjeto.cantVacunasDescartadas += descarte.cantVacunas;
            }
          });
        }

        depoProvStock.forEach((stockDepoProv) => {
          if (stockDepoProv.idLote === idLote) {
            if (stockDepoProv.estado === "enStock") {
              nuevoObjeto.cantVacunasProvincia += stockDepoProv.cantVacunas;
            }
            if (stockDepoProv.vencida) {
              nuevoObjeto.cantVacunasVencidas += stockDepoProv.cantVacunas;
            }
            if (stockDepoProv.estado === "descartado") {
              const descartesProv = resultadosDescarte.filter(
                (descartes) => descartes.tipoLote === "LoteProvincia"
              );
              console.log("DESCARTE PROVINCIA");
              console.log(descartesProv);
              descartesProv.forEach((descarte) => {
                if (descarte.idLote === stockDepoProv.idLoteProv) {
                  nuevoObjeto.cantVacunasDescartadas += descarte.cantVacunas;
                }
              });
            }
            if (stockDepoProv.estado === "enViaje") {
              nuevoObjeto.cantVacunasDistribucion += stockDepoProv.cantVacunas;
            }
          }
        });

        centroStock.forEach((stockCentro) => {
          if (stockCentro.idLote === idLote) {
            if (stockCentro.estado === "enStock") {
              nuevoObjeto.cantVacunasCentroVac += stockCentro.cantVacunas;
            }
            if (stockCentro.estado === "descartado") {
              const descartesCentro = resultadosDescarte.filter(
                (descartes) => descartes.tipoLote === "LoteCentro"
              );
              console.log("DESCARTE Centro");
              console.log(descartesCentro);
              descartesCentro.forEach((descarte) => {
                if (descarte.idLote === stockCentro.idLoteCentro) {
                  nuevoObjeto.cantVacunasDescartadas += descarte.cantVacunas;
                }
              });
            }
            if (stockCentro.estado === "enViaje") {
              nuevoObjeto.cantVacunasDistribucion += stockCentro.cantVacunas;
            }
          }
        });

        resultadoFinal.push(nuevoObjeto);
      });
      console.log("RESULTADOFINAL");

      console.log(resultadoFinal);

      res.render("lotesProvedor", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        resultadoFinal,
      });
    } catch (error) {
      console.error("Error al obtener las compras", error);
      res.sendStatus(500);
    }
  },
  editarLote: async (req, res, next) => {
    const idLote = req.params.id;
    console.log("Lote a editar", idLote);

    try {
      const vacunas = await models.Vacuna.findAll({
        include: [
          {
            model: models.Laboratorio,
            attributes: ["nombre"],
          },
        ],
      });
      const loteProveedorAux = await models.LoteProveedor.findOne({
        where: { idLote: idLote },
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
            as: "Deposito",
            include: [
              {
                model: models.Localidad,
              },
            ],
          },
        ],
      });

      const loteProveedor = {
        idLote: loteProveedorAux.idLote,
        tipoVacuna: loteProveedorAux.Vacuna.tipoVacuna,
        nombreLaboratorio: loteProveedorAux.Vacuna.Laboratorio.nombre,
        nombreComercial: loteProveedorAux.Vacuna.nombreComercial,
        paisOrigen: loteProveedorAux.Vacuna.paisOrigen,
        fechaFabricacion: loteProveedorAux.fechaFabricacion,
        fechaVencimiento: loteProveedorAux.fechaVencimiento,
        estado: loteProveedorAux.estado,
        deposito: `${loteProveedorAux.Deposito.idDepoNacion} - ${loteProveedorAux.Deposito.Localidad.ciudad}, ${loteProveedorAux.Deposito.Localidad.provincia} (${loteProveedorAux.Deposito.direccion})`,
        fechaAdquisicion: loteProveedorAux.fechaAdquisicion,
        idDepoNacion: loteProveedorAux.idDepoNacion,
        cantVacunas: loteProveedorAux.cantVacunas,
      };
      console.log(loteProveedor);

      const resultado = vacunas.map((vacuna) => {
        return {
          idVacuna: vacuna.idVacuna,
          tipoVacuna: vacuna.tipoVacuna,
          nombreComercial: vacuna.nombreComercial,
          paisOrigen: vacuna.paisOrigen,
          nombreLaboratorio: vacuna.Laboratorio.nombre,
        };
      });

      const depositos = await models.DepositoNacion.findAll({
        include: [
          {
            model: models.Localidad,
            attributes: ["provincia", "ciudad"],
          },
        ],
      });

      const resultadoDepo = depositos.map((depo) => {
        return {
          idDepoNacion: depo.idDepoNacion,
          provincia: depo.Localidad.provincia,
          ciudad: depo.Localidad.ciudad,
          direccion: depo.direccion,
        };
      });

      res.render("editarLotes", {

        resultado,
        resultadoDepo,
        idLote,
        loteProveedor,
      });
    } catch (error) {
      console.error("Error al obtener las vacunas", error);
      res.sendStatus(500);
    }
  },
  editarLotePost: async (req, res, next) => {
    const idLote = req.params.id;
    const idVacuna = req.body.idVacuna;
    const cantVacunas = req.body.cantidadVacunas;
    const fechaFabricacion = req.body.fechaFabricacion;
    const fechaVencimiento = req.body.fechaVencimiento;
    const fechaAdquisicion = req.body.fechaAdquisicion;
    const idDeposito = req.body.deposito;
    console.log(req.body);
    console.log("idLote");
    console.log(idLote);
    try {
      const loteOriginal = await models.LoteProveedor.findByPk(idLote, {
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
            as: "Deposito",
          },
        ],
      });
      if (idVacuna !== "") {
        loteOriginal.idVacuna = idVacuna;
      }
      if (fechaFabricacion !== "") {
        loteOriginal.fechaFabricacion = fechaFabricacion;
      }
      if (fechaVencimiento !== "") {
        loteOriginal.fechaVencimiento = fechaVencimiento;
      }
      if (cantVacunas !== "") {
        loteOriginal.cantVacunas = cantVacunas;
        if (cantVacunas <= 0) {
          loteOriginal.estado = "sinStock";
        }
      }

      if (idDeposito !== "-" && idDeposito !== "") {
        loteOriginal.idDepoNacion = idDeposito;
      }

      if (fechaAdquisicion !== "") {
        loteOriginal.fechaAdquisicion = fechaAdquisicion;
        if (loteOriginal.estado !== "descartado") {
          loteOriginal.estado === "enStock";
        }
      }
      await loteOriginal.save();

      res.render("modCompra", {
        alert: true,
        alertTitle: "Modificación Exitosa",
        alertMessage: "Modificación realizada correctamente",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 1200,
        ruta: "api/compras/modCompra",
        resultado: ["a"],
      });
    } catch (error) {
      res.render("modCompra", {
        alert: true,
        alertTitle: "ERROR",
        alertMessage: "Modificación no realizada",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "api/compras/modCompra",
        resultado: ["a"],
      });
    }
  },
};
