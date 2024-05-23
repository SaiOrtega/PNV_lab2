const models = require('../dabase/models/index');
const { Sequelize } = require('sequelize');

module.exports = {
  descarteVacunas: async (req, res) => {
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";

    try {
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
                attributes: ["fechaFabricacion", "fechaVencimiento", "fechaAdquisicion"],
              },
            ],
            attributes: ["id", "idDepoProv"],
          },
          {
            model: models.CentroVacunacion,
            include: [
              {
                model: models.Localidad,
                attributes: ["provincia", "ciudad"],
              },
            ],
          },
        ],
        attributes: ["id", "idSublote", "idCentro", "fechaRecepcion", "estado"],
      });

      const resultadoCentroStockAux = centroStockAux.map((lotes) => {
        if (lotes.estado === "enStock") {
          return {
            idCentroStock: lotes.id,
            idSublote: lotes.idSublote,
            vacuna: lotes.DepoProvinciaStock.LoteProveedor.Vacuna.tipoVacuna,
            nombreComercial: lotes.DepoProvinciaStock.LoteProveedor.Vacuna.nombreComercial,
            origen: lotes.DepoProvinciaStock.LoteProveedor.Vacuna.paisOrigen,
            laboratorio: lotes.DepoProvinciaStock.LoteProveedor.Vacuna.Laboratorio.nombre,
            fechaFabricacion: lotes.DepoProvinciaStock.LoteProveedor.fechaFabricacion,
            fechaVencimiento: lotes.DepoProvinciaStock.LoteProveedor.fechaVencimiento,
            fechaAquisicion: lotes.fechaRecepcion,
            idCentro: lotes.CentroVacunacion.idCentro,
            provincia: lotes.CentroVacunacion.Localidad.provincia,
            ciudad: lotes.CentroVacunacion.Localidad.ciudad,
            direccion: lotes.CentroVacunacion.direccion,
          };
        }
      });
      console.log(resultadoCentroStockAux);
      const provStockAux = await models.DepoProvinciaStock.findAll({
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
            attributes: [
              "idLote",
              "fechaFabricacion",
              "fechaVencimiento",
              "fechaAdquisicion",
            ],
          },
        ],
        attributes: ["id", "idDepoProv", "fechaRecepcion", "estado"],
      });
      const resultadoProvStockAux = provStockAux.map((lotes) => {
        if (lotes.estado === "enStock") {
          return {
            idProvStock: lotes.id,
            idLote: lotes.LoteProveedor.idLote,
            vacuna: lotes.LoteProveedor.Vacuna.tipoVacuna,
            nombreComercial: lotes.LoteProveedor.Vacuna.nombreComercial,
            origen: lotes.LoteProveedor.Vacuna.paisOrigen,
            laboratorio: lotes.LoteProveedor.Vacuna.Laboratorio.nombre,
            fechaFabricacion: lotes.LoteProveedor.fechaFabricacion,
            fechaVencimiento: lotes.LoteProveedor.fechaVencimiento,
            fechaAquisicion: lotes.fechaRecepcion,
          };
        }
      });

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
        attributes: [
          "idLote",
          "fechaFabricacion",
          "fechaVencimiento",
          "fechaAdquisicion",
          "estado",
          "vencida",
        ],
      });
      const todosDepos = provStockAux.map((lotes) => {
        return {
          idProvStock: lotes.id,
          idLote: lotes.LoteProveedor.idLote,
          vacuna: lotes.LoteProveedor.Vacuna.tipoVacuna,
          nombreComercial: lotes.LoteProveedor.Vacuna.nombreComercial,
          origen: lotes.LoteProveedor.Vacuna.paisOrigen,
          laboratorio: lotes.LoteProveedor.Vacuna.Laboratorio.nombre,
          fechaFabricacion: lotes.LoteProveedor.fechaFabricacion,
          fechaVencimiento: lotes.LoteProveedor.fechaVencimiento,
          fechaAquisicion: lotes.fechaRecepcion,
        };
      });

      const resultadoLoteProveedorAux = loteProveedorAux.map((lotes) => {
        if (lotes.estado === "enStock" || lotes.estado === "sinStock") {
          return {
            idLote: lotes.idLote,
            vacuna: lotes.Vacuna.tipoVacuna,
            nombreComercial: lotes.Vacuna.nombreComercial,
            origen: lotes.Vacuna.paisOrigen,
            laboratorio: lotes.Vacuna.Laboratorio.nombre,
            fechaFabricacion: lotes.fechaFabricacion,
            fechaVencimiento: lotes.fechaVencimiento,
            fechaAquisicion: lotes.fechaAdquisicion,
            vencida: lotes.vencida,
          };
        } else {
        }
      });
      const resultadoLoteProveedor = resultadoLoteProveedorAux.filter(
        (item) => item !== undefined
      );

      const resultadoProvStock = resultadoProvStockAux.filter(
        (item) => item !== undefined
      );
      const resultadoCentroStock = resultadoCentroStockAux.filter(
        (item) => item !== undefined
      );
      console.log("==========================");
      console.log(resultadoCentroStock);
      console.log("==========================");

      const vencidas = [];
      const lotesVencidos = resultadoLoteProveedor.filter((lote) => lote.vencida);
      // Filtrar los lotes vencidos
      lotesVencidos.forEach((lote) => {
        console.log("lotes");
        console.log(lote);
        todosDepos.forEach((depo) => {
          if (lote.idLote === depo.idLote) {
            console.log("depo");
            console.log(depo);
            resultadoCentroStock.forEach((centro) => {
              if (centro.idSublote === depo.idProvStock) {
                console.log("centro");
                console.log(centro);
                const vencida = {
                  idLote: lote.idLote,
                  vacuna: lote.vacuna,
                  laboratorio: lote.laboratorio,
                  nombreComercial: lote.nombreComercial,
                  fechaFabricacion: lote.fechaFabricacion,
                  fechaVencimiento: lote.fechaVencimiento,
                  idCentro: centro.idCentroStock,
                  ciudad: centro.ciudad,
                  provincia: centro.provincia,
                  direccion: centro.direccion,
                };

                vencidas.push(vencida);
              }
            });
          }
        });
      });

      console.log("VENCIDAS");
      console.log(vencidas);

      // vencidas.forEach(vencidas=>{
      //   vencidas.centroVacunacion.forEach(centro=>console.log(centro))
      // })

      console.log("FINALIZO");

      const provSet = new Set(resultadoCentroStock.map((resu) => resu.provincia));
      const tipoVacSet = new Set(resultadoLoteProveedor.map((resu) => resu.vacuna));
      const centrosVacSet = new Set(
        resultadoCentroStock.map((resu) => {
          return JSON.stringify({
            idCentro: resu.idCentro,
            ciudad: resu.ciudad,
            provincia: resu.provincia,
            direccion: resu.direccion,
          });
        })
      );

      const prov = [...provSet];
      const tipoVac = [...tipoVacSet];
      const centroVac = Array.from(centrosVacSet).map((jsonString) =>
        JSON.parse(jsonString)
      );

      res.render("vacunasDescarte", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        resultadoCentroStock,
        resultadoProvStock,
        resultadoLoteProveedor,
        prov,
        tipoVac,
        centroVac,
        vencidas,
      });
    } catch (error) {
      console.error("Error al obtener los datos", error);
      res.sendStatus(500);
    }
  },
  descarteVacunasPost: async (req, res) => {
    if (
      req.body.lote !== undefined &&
      req.body.loteSelect !== "-" &&
      req.body.motivo !== "" &&
      req.body.fechaDescarte !== ""
    ) {
      const lote = req.body.lote;
      const loteSelect = req.body.loteSelect;
      const motivo = req.body.motivo;
      const fechaDescarte = req.body.fechaDescarte;
      const eliminarLotesInf = req.body.lotesInferiores;
      console.log(eliminarLotesInf);
      console.log(req.body);
      try {
        if (lote === "loteNacion") {
          const loteAux = await models.LoteProveedor.findByPk(loteSelect);
          console.log(loteAux);
          const vacunaDescarte = await models.VacunasDescarte.create({
            idLote: loteSelect,
            motivo: motivo,
            fechaDescarte: fechaDescarte,
            personaACargo: req.session.user.id,
            tipoLote: "LoteNacion",
            cantVacunas: loteAux.cantVacunas,
          });
          loteAux.estado = "descartado";
          loteAux.cantVacunas = 0;
          await loteAux.save();
          if (eliminarLotesInf) {
            console.log("==========");
            console.log("ENTROOOO PROV");
            console.log("==========");
            const provStock = await models.DepoProvinciaStock.findAll({
              where: { idLote: loteSelect },
            });
            if (provStock) {
              console.log("PASO 3");
              for (const lote2 of provStock) {
                const vacunaDescarte = await models.VacunasDescarte.create({
                  idLote: lote2.id,
                  motivo: motivo,
                  fechaDescarte: fechaDescarte,
                  personaACargo: req.session.user.id,
                  tipoLote: "LoteProvincia",
                  cantVacunas: lote2.cantVacunas,
                });
                lote2.estado = "descartado";
                lote2.cantVacunas = 0;
                await lote2.save();
                const centroStock = await models.CentroVacunacionStock.findAll({
                  where: { idSublote: lote2.id },
                });
                if (centroStock) {
                  console.log("PASO 4");
                  for (const lote3 of centroStock) {
                    const vacunaDescarte = await models.VacunasDescarte.create({
                      idLote: lote3.id,
                      motivo: motivo,
                      fechaDescarte: fechaDescarte,
                      personaACargo: req.session.user.id,
                      tipoLote: "LoteCentro",
                      cantVacunas: lote3.cantVacunas,
                    });
                    lote3.estado = "descartado";
                    lote3.cantVacunas = 0;
                    await lote3.save();
                  }
                }
              }
            }
          }
        } else if (lote === "loteProvincia") {
          const loteAux = await models.DepoProvinciaStock.findByPk(loteSelect);
          console.log(loteAux);
          const vacunaDescarte = await models.VacunasDescarte.create({
            idLote: loteSelect,
            motivo: motivo,
            fechaDescarte: fechaDescarte,
            personaACargo: req.session.user.id,
            tipoLote: "LoteProvincia",
            cantVacunas: loteAux.cantVacunas,
          });
          loteAux.estado = "descartado";
          loteAux.cantVacunas = 0;
          await loteAux.save();
          if (eliminarLotesInf) {
            const centroStock = await models.CentroVacunacionStock.findAll({
              where: { idSublote: loteSelect },
            });
            if (centroStock) {
              console.log("PASO 4");
              for (const lote3 of centroStock) {
                const vacunaDescarte = await models.VacunasDescarte.create({
                  idLote: lote3.id,
                  motivo: motivo,
                  fechaDescarte: fechaDescarte,
                  personaACargo: req.session.user.id,
                  tipoLote: "LoteCentro",
                  cantVacunas: lote3.cantVacunas,
                });
                lote3.estado = "descartado";
                lote3.cantVacunas = 0;
                await lote3.save();
              }
            }
          }
        } else if (lote === "loteCentro") {
          const loteAux = await models.CentroVacunacionStock.findByPk(loteSelect);
          console.log(loteAux);
          const vacunaDescarte = await models.VacunasDescarte.create({
            idLote: loteSelect,
            motivo: motivo,
            fechaDescarte: fechaDescarte,
            personaACargo: req.session.user.id,
            tipoLote: "LoteCentro",
            cantVacunas: loteAux.cantVacunas,
          });
          console.log(loteAux.estado);
          loteAux.estado = "descartado";
          loteAux.cantVacunas = 0;
          await loteAux.save();
        }

        res.render("vacunasDescarte", {
          alert: true,
          alertTitle: "Lote Descartadado Correctamente",
          alertMessage: `Se realizo el descarte del lote correctamente`,
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "vacunasDescarte",
          prov: ["a"],
          tipoVac: ["a"],
          centroVac: ["a"],
          vencidas: ["a"],
        });
      } catch (error) {
        console.log(error);
        res.render("vacunasDescarte", {
          alert: true,
          alertTitle: "Error en el Descarte",
          alertMessage: `No realizo el descarte, ERROR: ${error}`,
          alertIcon: "warning",
          showConfirmButton: true,
          timer: false,
          ruta: "vacunasDescarte",
          prov: ["a"],
          tipoVac: ["a"],
          centroVac: ["a"],
          vencidas: ["a"],
        });
      }
    } else {
      res.render("vacunasDescarte", {
        alert: true,
        alertTitle: "No se realizo descarte",
        alertMessage: `No realizo el descarte, debe completar todos los campos`,
        alertIcon: "warning",
        showConfirmButton: true,
        timer: false,
        ruta: "vacunasDescarte",
        prov: ["a"],
        tipoVac: ["a"],
        centroVac: ["a"],
        vencidas: ["a"],
      });
    }
  },
  descarteVacunasVencidas: async (req, res) => {
    console.log("ENTRO DESCARTE VENCIDAS");
    let flag = false; // Inicializar el flag como false
    try {
      const loteProveedor = await models.LoteProveedor.findAll();
      if (loteProveedor) {
        console.log("PASO 1");
        for (const lote of loteProveedor) {
          if (lote.vencida && lote.estado !== "descartado") {
            console.log("PASO 2");

            const vacunaDescarte = await models.VacunasDescarte.create({
              idLote: lote.idLote,
              motivo: "Vencida",
              fechaDescarte: new Date(),
              personaACargo: req.session.user.id,
              tipoLote: "LoteNacion",
              cantVacunas: lote.cantVacunas,
            });
            lote.estado = "descartado";
            lote.cantVacunas = 0;
            await lote.save();
            const provStock = await models.DepoProvinciaStock.findAll({
              where: { idLote: lote.idLote },
            });
            if (provStock) {
              console.log("PASO 3");
              for (const lote2 of provStock) {
                const vacunaDescarte = await models.VacunasDescarte.create({
                  idLote: lote2.id,
                  motivo: "Vencida",
                  fechaDescarte: new Date(),
                  personaACargo: req.session.user.id,
                  tipoLote: "LoteProvincia",
                  cantVacunas: lote2.cantVacunas,
                });
                lote2.cantVacunas = 0;
                lote2.estado = "descartado";
                await lote2.save();
                const centroStock = await models.CentroVacunacionStock.findAll({
                  where: { idSublote: lote2.id },
                });
                if (centroStock) {
                  console.log("PASO 4");
                  for (const lote3 of centroStock) {
                    const vacunaDescarte = await models.VacunasDescarte.create({
                      idLote: lote3.id,
                      motivo: "Vencida",
                      fechaDescarte: new Date(),
                      personaACargo: req.session.user.id,
                      tipoLote: "LoteCentro",
                      cantVacunas: lote3.cantVacunas,
                    });
                    lote3.estado = "descartado";
                    lote3.cantVacunas = 0;
                    await lote3.save();
                  }
                }
              }
            }
            flag = true;
            console.log("FLAG=================>");
          }
        }
      }
      console.log(flag);
      if (flag) {
        res.render("vacunasDescarte", {
          alert: true,
          alertTitle: "Lotes Descartadados Correctamente",
          alertMessage: `Se realizo el descarte de todas los lotes vencidos al dia de la fecha`,
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "vacunasDescarte",
          prov: ["a"],
          tipoVac: ["a"]
        });
      } else {
        res.render("vacunasDescarte", {
          alert: true,
          alertTitle: "No hay lotes Vencidas",
          alertMessage: `No realizo el descarte de ningun lote, ya que no hay lotes vencidos al dia de la fecha`,
          alertIcon: "warning",
          showConfirmButton: true,
          timer: false,
          ruta: "vacunasDescarte",
          prov: ["a"],
          tipoVac: ["a"]
        });
      }
    } catch (error) { }
  },
  vacunasDescartadas: async (req, res) => {
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";

    try {
      const vacunasDescarte = await models.VacunasDescarte.findAll({
        include: [{ model: models.usuario }],
      });
      const resultados = [];

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
                model: model.LoteProveedor,
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
          resultados.push({
            idDescarte: vacunaDescarte.idDescarte,
            idLote: vacunaDescarte.idLote,
            tipoLote: vacunaDescarte.tipoLote,
            tipoVacuna:
              resultado.DepoProvinciaStock?.LoteProveedor?.Vacuna.tipoVacuna ||
              resultado.LoteProveedor?.Vacuna.tipoVacuna ||
              resultado.Vacuna.tipoVacuna,
            nombreComercial:
              resultado.DepoProvinciaStock?.LoteProveedor?.Vacuna.nombreComercial ||
              resultado.LoteProveedor?.Vacuna.nombreComercial ||
              resultado.Vacuna.nombreComercial,
            laboratorio:
              resultado.DepoProvinciaStock?.LoteProveedor?.Vacuna.Laboratorio.nombre ||
              resultado.LoteProveedor?.Vacuna.Laboratorio.nombre ||
              resultado.Vacuna.Laboratorio.nombre,
            origen:
              resultado.DepoProvinciaStock?.LoteProveedor?.Vacuna.Laboratorio.pais ||
              resultado.LoteProveedor?.Vacuna.Laboratorio.pais ||
              resultado.Vacuna.Laboratorio.pais,
            fechaFabricacion:
              resultado.DepoProvinciaStock?.LoteProveedor?.fechaFabricacion ||
              resultado.LoteProveedor?.fechaFabricacion ||
              resultado.fechaFabricacion,
            fechaVencimiento:
              resultado.DepoProvinciaStock?.LoteProveedor?.fechaVencimiento ||
              resultado.LoteProveedor?.fechaVencimiento ||
              resultado.fechaVencimiento,
            motivoDescarte: vacunaDescarte.motivo,
            idPersonaACargo: vacunaDescarte.personaACargo,
            personaACargoApellido: vacunaDescarte.usuario.apellido, // Usar operador opcional '?' para evitar undefined
            personaACargoNombre: vacunaDescarte.usuario.nombre, // Usar operador opcional '?' para evitar undefined
          });
        }
      }

      res.render("vacunasDescartadas", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        resultados,
      });
    } catch (error) {
      console.error("Error al obtener las compras", error);
      res.sendStatus(500);
    }
  },
  filtrarVencidas: async (req, res) => {
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";

    const provincia = req.query.provincia;
    const tipoVacuna = req.query.tipoVacuna;
    const centroId = req.query.centroId;
    console.log("QUERY!!!!");
    console.log(req.query);

    try {
      if (
        provincia.trim().length > 0 &&
        tipoVacuna.trim().length > 0 &&
        centroId.trim().length > 0
      ) {
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
                  attributes: [
                    "fechaFabricacion",
                    "fechaVencimiento",
                    "fechaAdquisicion",
                  ],
                },
              ],
              attributes: ["id", "idDepoProv"],
            },
            {
              model: models.CentroVacunacion,
              include: [
                {
                  model: models.Localidad,
                  attributes: ["provincia", "ciudad"],
                },
              ],
            },
          ],
          attributes: ["id", "idSublote", "idCentro", "fechaRecepcion", "estado"],
        });

        const resultadoCentroStockAux = centroStockAux.map((lotes) => {
          if (lotes.estado !== "descartado" && lotes.estado === "enStock") {
            return {
              idCentroStock: lotes.id,
              idSublote: lotes.idSublote,
              vacuna: lotes.DepoProvinciaStock.LoteProveedor.Vacuna.tipoVacuna,
              nombreComercial:
                lotes.DepoProvinciaStock.LoteProveedor.Vacuna.nombreComercial,
              origen: lotes.DepoProvinciaStock.LoteProveedor.Vacuna.paisOrigen,
              laboratorio:
                lotes.DepoProvinciaStock.LoteProveedor.Vacuna.Laboratorio.nombre,
              fechaFabricacion: lotes.DepoProvinciaStock.LoteProveedor.fechaFabricacion,
              fechaVencimiento: lotes.DepoProvinciaStock.LoteProveedor.fechaVencimiento,
              fechaAquisicion: lotes.fechaRecepcion,
              idCentro: lotes.Centrovacunacion.idCentro,
              provincia: lotes.Centrovacunacion.Localidad.provincia,
              ciudad: lotes.Centrovacunacion.Localidad.ciudad,
              direccion: lotes.Centrovacunacion.direccion,
            };
          }
        });
        console.log(resultadoCentroStockAux);
        const provStockAux = await models.DepoProvinciaStock.findAll({
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
              attributes: [
                "idLote",
                "fechaFabricacion",
                "fechaVencimiento",
                "fechaAdquisicion",
              ],
            },
          ],
          attributes: ["id", "idDepoProv", "fechaRecepcion", "estado"],
        });
        const resultadoProvStockAux = provStockAux.map((lotes) => {
          if (lotes.estado !== "descartado" && lotes.estado === "enStock") {
            return {
              idProvStock: lotes.id,
              idLote: lotes.LoteProveedor.idLote,
              vacuna: lotes.LoteProveedor.Vacuna.tipoVacuna,
              nombreComercial: lotes.LoteProveedor.Vacuna.nombreComercial,
              origen: lotes.LoteProveedor.Vacuna.paisOrigen,
              laboratorio: lotes.LoteProveedor.Vacuna.Laboratorio.nombre,
              fechaFabricacion: lotes.LoteProveedor.fechaFabricacion,
              fechaVencimiento: lotes.LoteProveedor.fechaVencimiento,
              fechaAquisicion: lotes.fechaRecepcion,
            };
          }
        });

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
          attributes: [
            "idLote",
            "fechaFabricacion",
            "fechaVencimiento",
            "fechaAdquisicion",
            "estado",
            "vencida",
          ],
        });

        const resultadoLoteProveedorAux = loteProveedorAux.map((lotes) => {
          if (
            (lotes.estado !== "descartado" && lotes.estado === "enStock") ||
            lotes.estado === "sinStock"
          ) {
            console.log("ENTRO NO DESCARTADO");
            return {
              idLote: lotes.idLote,
              vacuna: lotes.Vacuna.tipoVacuna,
              nombreComercial: lotes.Vacuna.nombreComercial,
              origen: lotes.Vacuna.paisOrigen,
              laboratorio: lotes.Vacuna.Laboratorio.nombre,
              fechaFabricacion: lotes.fechaFabricacion,
              fechaVencimiento: lotes.fechaVencimiento,
              fechaAquisicion: lotes.fechaAdquisicion,
              vencida: lotes.vencida,
            };
          } else {
            console.log("======");
            console.log("======");
            console.log(`El lote ${lotes.idLote} se encunetra descartado`);
            console.log("======");
            console.log("======");
          }
        });
        const resultadoLoteProveedor = resultadoLoteProveedorAux.filter(
          (item) => item !== undefined
        );

        const resultadoProvStock = resultadoProvStockAux.filter(
          (item) => item !== undefined
        );
        const resultadoCentroStock = resultadoCentroStockAux.filter(
          (item) => item !== undefined
        );
        const vencidasAux = [];
        const todosDepos = provStockAux.map((lotes) => {
          return {
            idProvStock: lotes.id,
            idLote: lotes.LoteProveedor.idLote,
            vacuna: lotes.LoteProveedor.Vacuna.tipoVacuna,
            nombreComercial: lotes.LoteProveedor.Vacuna.nombreComercial,
            origen: lotes.LoteProveedor.Vacuna.paisOrigen,
            laboratorio: lotes.LoteProveedor.Vacuna.Laboratorio.nombre,
            fechaFabricacion: lotes.LoteProveedor.fechaFabricacion,
            fechaVencimiento: lotes.LoteProveedor.fechaVencimiento,
            fechaAquisicion: lotes.fechaRecepcion,
          };
        });
        const lotesVencidos = resultadoLoteProveedor.filter((lote) => lote.vencida);
        // Filtrar los lotes vencidos
        lotesVencidos.forEach((lote) => {
          console.log("lotes");
          console.log(lote);
          todosDepos.forEach((depo) => {
            if (lote.idLote === depo.idLote) {
              console.log("depo");
              console.log(depo);
              resultadoCentroStock.forEach((centro) => {
                if (centro.idSublote === depo.idProvStock) {
                  console.log("centro");
                  console.log(centro);
                  const vencida = {
                    idLote: lote.idLote,
                    vacuna: lote.vacuna,
                    laboratorio: lote.laboratorio,
                    nombreComercial: lote.nombreComercial,
                    fechaFabricacion: lote.fechaFabricacion,
                    fechaVencimiento: lote.fechaVencimiento,
                    idCentro: centro.idCentro,
                    ciudad: centro.ciudad,
                    provincia: centro.provincia,
                    direccion: centro.direccion,
                  };

                  vencidasAux.push(vencida);
                }
              });
            }
          });
        });

        const provSet = new Set(resultadoCentroStock.map((resu) => resu.provincia));
        const tipoVacSet = new Set(resultadoLoteProveedor.map((resu) => resu.vacuna));
        const centrosVacSet = new Set(
          resultadoCentroStock.map((resu) => {
            return JSON.stringify({
              idCentro: resu.idCentro,
              ciudad: resu.ciudad,
              provincia: resu.provincia,
              direccion: resu.direccion,
            });
          })
        );

        const prov = [...provSet];
        const tipoVac = [...tipoVacSet];
        const centroVac = Array.from(centrosVacSet).map((jsonString) =>
          JSON.parse(jsonString)
        );

        const vencidas = vencidasAux.filter((resu) => {
          if (provincia !== "-" && tipoVacuna !== "-" && centroId !== "-") {
            console.log("resu.provincia");
            console.log(resu.provincia);
            console.log("resu.vacuna");
            console.log(resu.vacuna);
            console.log("resu.idCentro");
            console.log(resu.idCentro);
            return (
              resu.provincia === provincia &&
              resu.vacuna === tipoVacuna &&
              resu.idCentro == centroId
            );
          } else if (provincia === "-" && tipoVacuna !== "-" && centroId === "-") {
            return resu.vacuna === tipoVacuna;
          } else if (provincia === "-" && centroId !== "-" && tipoVacuna !== "-") {
            return resu.vacuna === tipoVacuna && resu.idCentro == centroId;
          } else if (tipoVacuna === "-" && centroId === "-" && provincia !== "-") {
            return resu.provincia === provincia;
          } else if (tipoVacuna === "-" && centroId !== "-" && provincia !== "-") {
            return resu.provincia === provincia && resu.idCentro == centroId;
          } else if (tipoVacuna !== "-" && centroId === "-" && provincia !== "-") {
            return resu.provincia === provincia && resu.vacuna === tipoVacuna;
          } else if (tipoVacuna === "-" && centroId !== "-" && provincia === "-") {
            resu.idCentro == centroId;
          }
        });

        if (vencidas.length > 0) {
          res.render("vacunasDescarte", {
            userName,
            loginlogoutLink,
            loginlogoutName,
            tipoVac,
            prov,
            resultadoCentroStock,
            resultadoProvStock,
            resultadoLoteProveedor,
            centroVac,
            vencidas,
          });
        } else {
          res.render("vacunasDescarte", {
            alert: true,
            alertTitle: "Error al filtrar",
            alertMessage: `No se encontraron lotes que coincidan con los filtros`,
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "vacunasDescarte",
            resultadoCentroStock: ["a"],
            resultadoProvStock: ["a"],
            resultadoLoteProveedor: ["a"],
            resultado: ["a"],
            tipoVac: ["a"],
            prov: ["a"],
          });
        }
      } else {
        res.render("vacunasDescarte", {
          alert: true,
          alertTitle: "Error al filtrar",
          alertMessage: `No se encontraron lotes que coincidan con los filtros`,
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "vacunasDescarte",
          resultado: ["a"],
          tipoVac: ["a"],
          prov: ["a"],
          resultadoCentroStock: ["a"],
          resultadoProvStock: ["a"],
          resultadoLoteProveedor: ["a"],
        });
      }
    } catch (error) {
      console.error("Error al obtener los datos", error);
      res.sendStatus(500);
    }
  },
  borrarDescarte: async (req, res) => {
    const idDescarte = req.params.id;
    const restaurarLote = req.body.restaurarLote;
    try {
      const vacunasDescartadas = await models.VacunasDescarte.findOne({
        where: { idDescarte: idDescarte },
      });
      console.log(restaurarLote);
      console.log(vacunasDescartadas);
      const tipoLote = vacunasDescartadas.tipoLote;
      const idLote = vacunasDescartadas.idLote;
      const cantVacunas = vacunasDescartadas.cantVacunas;


      if (restaurarLote) {
        if (tipoLote === "LoteNacion") {
          await models.LoteProveedor.update(
            {
              cantVacunas: cantVacunas,
              estado: Sequelize.literal(
                `CASE WHEN fechaAdquisicion IS NULL THEN 'enViaje' ELSE 'enStock' END`
              ),
            },
            {
              where: {
                idLote: idLote,
              },
            }
          );
        } else if (tipoLote === "LoteProvincia") {
          await models.DepoProvinciaStock.update(
            {
              cantVacunas: cantVacunas,
              estado: Sequelize.literal(
                `CASE WHEN fechaRecepcion IS NULL THEN 'enViaje' ELSE 'enStock' END`
              ),
            },
            {
              where: {
                id: idLote,
              },
            }
          );
        } else {
          await models.CentroVacunacionStock.update(
            {
              cantVacunas: cantVacunas,
              estado: Sequelize.literal(
                `CASE WHEN fechaRecepcion IS NULL THEN 'enViaje' ELSE 'enStock' END`
              ),
            },
            {
              where: {
                id: idLote,
              },
            }
          );
        }
      }

      const descarteBorrado = await models.VacunasDescarte.destroy({
        where: { idDescarte: idDescarte },
      });

      res.render("vacunasDescartadas", {
        resultados: [""],
        alert: true,
        alertTitle: "Operacion Correcta",
        alertMessage: `Se elimino el descarte correctamente`,
        alertIcon: "success",
        showConfirmButton: false,
        timer: 1500,
        ruta: "vacunasDescartadas",
      });
    } catch (error) {
      console.log(error);

      res.render("vacunasDescartadas", {
        resultados: [""],
        alert: true,
        alertTitle: "Error",
        alertMessage: `No se pudo eliminar el descarte debido a un error`,
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "vacunasDescartadas",
      });
    }
  },
};
