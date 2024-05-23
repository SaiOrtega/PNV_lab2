const models = require('../dabase/models/index');


module.exports = {
  centrosStock: async (req, res) => {
    try {
      const centroStock = await models.CentroVacunacionStock.findAll({
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
            attributes: ["idDepoProv"],
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
      });
      if (centroStock === null || centroStock.length === 0) {
        return res.sendStatus(204);
      }

      const resultado = centroStock.map((stock) => {
        const fechaRecepcion = stock.fechaRecepcion !== null ? new Date(stock.fechaRecepcion) : null;
        const fechaFormateada = fechaRecepcion !== null ? fechaRecepcion.toISOString().slice(0, 10) : null;
        const fechaRecepcionFormateada = fechaRecepcion !== null ? fechaFormateada : null;
        return {
          idLoteCentro: stock.id,
          idSublote: stock.idSublote,
          idCentro: stock.idCentro,
          idLote: stock.DepoProvinciaStock.LoteProveedor.idLote,
          tipoVacuna: stock.DepoProvinciaStock.LoteProveedor.Vacuna.tipoVacuna,
          nombreComercial: stock.DepoProvinciaStock.LoteProveedor.Vacuna.nombreComercial,
          nombreLaboratorio:
            stock.DepoProvinciaStock.LoteProveedor.Vacuna.Laboratorio !== null
              ? stock.DepoProvinciaStock.LoteProveedor.Vacuna.Laboratorio.nombre
              : null,
          fechaFabricacion: stock.DepoProvinciaStock.LoteProveedor.fechaFabricacion,
          fechaVencimiento: stock.DepoProvinciaStock.LoteProveedor.fechaVencimiento,
          vencida: stock.DepoProvinciaStock.LoteProveedor.vencida,
          ciudad: stock.CentroVacunacion.Localidad !== null ? stock.CentroVacunacion.Localidad.ciudad : null,
          provincia: stock.CentroVacunacion.Localidad !== null ? stock.CentroVacunacion.Localidad.provincia : null,
          direccion: stock.CentroVacunacion.direccion !== null ? stock.CentroVacunacion.direccion : null,
          cantVacunas: stock.cantVacunas !== null ? stock.cantVacunas : null,
          estado: stock.estado !== null ? stock.estado : null,
          fechaRecepcion: fechaRecepcionFormateada,
        };
      });
      const provSet = new Set(resultado.map((resu) => resu.provincia));
      const tipoVacSet = new Set(resultado.map((resu) => resu.tipoVacuna));

      const prov = [...provSet].filter((value) => value !== null && value !== undefined && value !== "");
      const tipoVac = [...tipoVacSet].filter((value) => value !== null && value !== undefined && value !== "");

      res.render("centrosVacunacionStock", {
        resultado,
        tipoVac,
        prov,
      });
    } catch (error) {
      console.error("Error al obtener las compras", error);
      res.sendStatus(500);
    }
  },
  centrosStockPost: async (req, res) => {
    if (req.body !== undefined) {
      const id = req.params.id;
      const fechaRecepcion = req.body.fechaRecepcion;

      try {
        const centrosStock = await models.CentroVacunacionStock.findOne({ where: { id: id } });
        console.log(centrosStock);
        centrosStock.fechaRecepcion = fechaRecepcion;
        if (centrosStock.estado !== "descartado") {
          centrosStock.estado = "enStock";
        }

        await centrosStock.save();
        res.render("centrosVacunacionStock", {
          alert: true,
          alertTitle: "Recepcion Exitosa",
          alertMessage: "Se realizó la recepción Correctamente",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1800,
          ruta: "api/stockCentros/centrosStock",
          resultado: ["a"],
          prov: ["a"],
          tipoVac: ["a"],
        });
      } catch (error) {
        res.render("centrosVacunacionStock", {
          alert: true,
          alertTitle: "Recepción Inválida",
          alertMessage: "No se pudede hacer la Recepción",
          alertIcon: "error",
          showConfirmButton: true,
          ruta: "api/stockCentros/centrosStock",
          resultado: ["a"],
          prov: ["a"],
          tipoVac: ["a"],
        });
      }
    } else {
      res.render("centrosVacunacionStock", {
        alert: true,
        alertTitle: "Recepción Inválida",
        alertMessage: "Debe completar el campo de la fecha",
        alertIcon: "error",
        showConfirmButton: true,
        ruta: "api/stockCentros/centrosStock",
        resultado: ["a"],
        prov: ["a"],
        tipoVac: ["a"],
      });
    }
  },
  centrosStockReasignar: async (req, res) => {
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";
    const idsCentros = [];
    const idLocalidades = [];

    try {
      const centroStock = await models.CentroVacunacionStock.findAll({
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
        where: {
          estado: "enStock",
        },
      });
      const resultadoAux = centroStock.map((stock) => {
        idsCentros.push(stock.idCentro);
        return {
          id: stock.id,
          idDepoProv: stock.DepoProvinciaStock.id,
          idCentro: stock.idCentro,
          idLote: stock.DepoProvinciaStock.LoteProveedor.idLote,
          tipoVacuna: stock.DepoProvinciaStock.LoteProveedor.Vacuna.tipoVacuna,
          nombreComercial: stock.DepoProvinciaStock.LoteProveedor.Vacuna.nombreComercial,
          nombreLaboratorio:
            stock.DepoProvinciaStock.LoteProveedor.Vacuna.Laboratorio.nombre,
          vencida: stock.DepoProvinciaStock.LoteProveedor.vencida,
          ciudad: stock.CentroVacunacion.Localidad.ciudad,
          provincia: stock.CentroVacunacion.Localidad.provincia,
          direccion: stock.CentroVacunacion.direccion,
          cantVacunas: stock.cantVacunas,
          fechaRecepcion: stock.fechaRecepcion,
          estado: stock.estado,
        };
      });

      if (resultadoAux.length > 0) {
        const resultados = resultadoAux.filter((item) => item !== undefined);

        const centrosVacunacion = await models.CentroVacunacion.findAll({
          where: {
            idCentro: idsCentros, // Filtramos por el idCentro igual a 1
          },
          include: [
            {
              model: models.Localidad,
              attributes: ["idLocalidad", "provincia", "ciudad"],
            },
          ],
        });

        centrosVacunacion.forEach((centro) => {
          idLocalidades.push(centro.idLocalidad);
        });

        const localidadesAux = await models.Localidad.findAll({
          where: {
            idLocalidad: idLocalidades, // Filtramos por el idCentro igual a 1
          },
        });

        localidadesOrdenadas = localidadesAux.sort((a, b) =>
          a.provincia.localeCompare(b.provincia)
        );
        const localidades = localidadesOrdenadas.map((localidad) => {
          return {
            idLocalidad: localidad.idLocalidad,
            provincia: localidad.provincia,
            ciudad: localidad.ciudad,
          };
        });


        const centrosVacunacionTodos = await models.CentroVacunacion.findAll({
          include: [
            {
              model: models.Localidad,
              attributes: ["provincia", "ciudad"],
            },
          ],
        });
        const resultadoCentrosTodos = centrosVacunacionTodos.map((aux) => {
          return {
            idCentro: aux.idCentro,
            idLocalidad: aux.idLocalidad,
            provincia: aux.Localidad.provincia,
            ciudad: aux.Localidad.ciudad,
            direccion: aux.direccion,
            telefono: aux.telefono,
          };
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

        res.render("reasignarLotes", {
          resultados,
          localidades,
          resultadoCentros,
          resultadoCentrosTodos,
        });
      } else {
        res.render("reasignarLotes", {
          alert: true,
          alertTitle: "No hay compras existentes",
          alertMessage: `Aplicación de vacuna no realizada, no hay vacunas en ningun centro`,
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "reasignarLotes",
          resultado: ["a"],
          resultadoDepo: ["a"],
        });
      }
    } catch (error) {
      console.error("Error al obtener los datos", error);
      res.sendStatus(500);
    }
  },
  centrosStockReasignarPost: async (req, res) => {
    try {
      const body = req.body;
      console.log(body);
      if (
        body.provinciaSelect !== "-" &&
        body.vacunas !== "-" &&
        body.centro !== "-" &&
        body.lote !== "-" &&
        body.sublote !== "-" &&
        body.centroReceptor !== "-" &&
        body.provinciaSelect.trim().length !== 0 &&
        body.vacunas.trim().length !== 0 &&
        body.centro.trim().length !== 0 &&
        body.lote.trim().length !== 0 &&
        body.sublote.trim().length !== 0 &&
        body.centroReceptor.trim().length !== 0
      ) {
        console.log(req.body);
        const idCentroReceptor = req.body.centroReceptor;
        const idCentroStock = req.body.sublote;
        const centroStockAux = await models.CentroVacunacionStock.findByPk(idCentroStock);
        await models.CentroVacunacionStock.create({
          idCentro: idCentroReceptor,
          idSublote: centroStockAux.idSublote,
          cantVacunas: centroStockAux.cantVacunas,
          estado: "EnViaje",
        });
        centroStockAux.cantVacunas = 0;
        centroStockAux.estado = "sinStock";
        await centroStockAux.save();
        res.render("reasignarLotes", {
          alert: true,
          alertTitle: "Tarea Exitosa",
          alertMessage: `Lote correctamente reasignado`,
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "reasignarLotes",
          localidades: [""],
        });
      } else {
        throw new Error("Error en el envio");
      }
    } catch (error) {
      console.log(error);
      res.render("reasignarLotes", {
        alert: true,
        alertTitle: "Error de envio",
        alertMessage: `Los Campos debes estar completos`,
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "reasignarLotes",
        localidades: [""],
      });
    }

  },
  centrosAplicar: async (req, res) => {
    try {
      const provincia = req.query.provincia ?? "";
      const tipoVacuna = req.query.tipoVacuna ?? "";
      const disponibleVac = req.query.disponibleVac === "true";

      if (provincia.trim().length > 0 && tipoVacuna.trim().length > 0) {
        const centroStock = await models.CentroVacunacionStock.findAll({
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
        });

        if (centroStock === null) {
          throw new Error("Error al obtener los datos de Stock");
        }

        const resultadoAux = centroStock.map((stock) => {
          return {
            idLoteCentro: stock.id,
            idSublote: stock.idSublote,
            idCentro: stock.idCentro,
            idLote: stock.DepoProvinciaStock.LoteProveedor.idLote ?? null,
            tipoVacuna: stock.DepoProvinciaStock.LoteProveedor.Vacuna.tipoVacuna ?? null,
            nombreComercial: stock.DepoProvinciaStock.LoteProveedor.Vacuna.nombreComercial ?? null,
            nombreLaboratorio: stock.DepoProvinciaStock.LoteProveedor.Vacuna.Laboratorio?.nombre ?? null,
            fechaFabricacion: stock.DepoProvinciaStock.LoteProveedor.fechaFabricacion ?? null,
            fechaVencimiento: stock.DepoProvinciaStock.LoteProveedor.fechaVencimiento ?? null,
            vencida: stock.DepoProvinciaStock.LoteProveedor.vencida ?? null,
            ciudad: stock.CentroVacunacion.Localidad?.ciudad ?? null,
            provincia: stock.CentroVacunacion.Localidad?.provincia ?? null,
            direccion: stock.CentroVacunacion.direccion ?? null,
            cantVacunas: stock.cantVacunas ?? null,
            estado: stock.estado ?? null,
            fechaRecepcion: stock.fechaRecepcion ?? null,
          };
        });

        if (resultadoAux === null) {
          throw new Error("Error al mapear los datos");
        }

        const provSet = new Set(resultadoAux.map((resu) => resu.provincia));
        const tipoVacSet = new Set(resultadoAux.map((resu) => resu.tipoVacuna));

        const prov = [...provSet];
        const tipoVac = [...tipoVacSet];
        const resultado = resultadoAux.filter((resu) => {
          if (provincia !== "-" && tipoVacuna !== "-") {
            if (disponibleVac) {
              return (
                resu.provincia === provincia &&
                resu.tipoVacuna === tipoVacuna &&
                resu.estado === "enStock"
              );
            } else {
              return resu.provincia === provincia && resu.tipoVacuna === tipoVacuna;
            }
          } else if (tipoVacuna === "-" && provincia === "-" && disponibleVac) {
            return resu.estado === "enStock";
          } else if (provincia === "-" && tipoVacuna !== "-") {
            if (disponibleVac) {
              return resu.tipoVacuna === tipoVacuna && resu.estado === "enStock";
            } else {
              return resu.tipoVacuna === tipoVacuna;
            }
          } else if (tipoVacuna === "-" && provincia !== "-") {
            if (disponibleVac) {
              return resu.provincia === provincia && resu.estado === "enStock";
            } else {
              return resu.provincia === provincia;
            }
          }
        });

        if (resultado.length > 0) {
          res.render("centrosVacunacionStock", {
            resultado,
            tipoVac,
            prov,
          });
        } else {
          res.render("centrosVacunacionStock", {
            alert: true,
            alertTitle: "Error al filtrar",
            alertMessage: `No se encontraron lotes que coincidan con los filtros`,
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "centrosStock",
            resultado: ["a"],
            tipoVac: ["a"],
            prov: ["a"],
          });
        }
      } else {
        res.render("centrosVacunacionStock", {
          alert: true,
          alertTitle: "Error al filtrar",
          alertMessage: `No se encontraron lotes que coincidan con los filtros`,
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "centrosStock",
          resultado: ["a"],
          tipoVac: ["a"],
          prov: ["a"],
        });
      }
    } catch (error) {
      console.error("Error al obtener las compras", error);
      res.sendStatus(500);
    }
  },
  editarLoteCentro: async (req, res) => {
    const idLote = req.params.id;
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";

    try {
      const centroOriginal = await models.CentroVacunacionStock.findByPk(idLote, {
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
          {
            model: models.CentroVacunacion,
            include: [
              {
                model: models.Localidad,
              },
            ],
          },
        ],
      });

      const loteCentro = {
        idSublote: centroOriginal.idSublote,
        tipoVacuna: centroOriginal.DepoProvinciaStock.LoteProveedor.Vacuna.tipoVacuna,
        nombreComercial: centroOriginal.DepoProvinciaStock.LoteProveedor.Vacuna.nombreComercial,
        nombreLaboratorio: centroOriginal.DepoProvinciaStock.LoteProveedor.Vacuna.Laboratorio.nombre,
        fechaFabricacion: centroOriginal.DepoProvinciaStock.LoteProveedor.fechaFabricacion,
        fechaVencimiento: centroOriginal.DepoProvinciaStock.LoteProveedor.fechaVencimiento,
        idCentro: centroOriginal.idCentro,
        ciudad: centroOriginal.CentroVacunacion.Localidad.ciudad,
        provincia: centroOriginal.CentroVacunacion.Localidad.provincia,
        direccion: centroOriginal.CentroVacunacion.direccion,
        cantVacunas: centroOriginal.cantVacunas,
        origen: centroOriginal.DepoProvinciaStock.LoteProveedor.Vacuna.paisOrigen,
        fechaRecepcion: centroOriginal.fechaRecepcion,
      };
      console.log(loteCentro)

      const depoProvStocks = await models.DepoProvinciaStock.findAll({
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

      const resultadoAux = depoProvStocks.map((stock) => {
        if (
          stock.DepositoProv.Localidad.provincia ===
          centroOriginal.CentroVacunacion.Localidad.provincia
        ) {
          return {
            id: stock.id,
            idLote: stock.LoteProveedor.idLote,
            tipoVacuna: stock.LoteProveedor.Vacuna.tipoVacuna,
            nombreComercial: stock.LoteProveedor.Vacuna.nombreComercial,
            nombreLaboratorio: stock.LoteProveedor.Vacuna.Laboratorio.nombre,
            fechaFabricacion: stock.LoteProveedor.fechaFabricacion,
            fechaVencimiento: stock.LoteProveedor.fechaVencimiento,
            origen: stock.LoteProveedor.Vacuna.paisOrigen,
            vencida: stock.LoteProveedor.vencida,
            idDepoProv: stock.DepositoProv.idDepoProv,
            ciudad: stock.DepositoProv.Localidad.ciudad,
            provincia: stock.DepositoProv.Localidad.provincia,
            direccion: stock.DepositoProv.direccion,
            cantVacunas: stock.cantVacunas,
            estado: stock.estado,
            fechaRecepcion: stock.fechaRecepcion,
          };
        }
      });
      const resultado = resultadoAux.filter((resu) => resu !== undefined);

      const centrosVacunacionAux = await models.CentroVacunacion.findAll({
        include: [
          {
            model: models.Localidad,
            attributes: ["idLocalidad", "provincia", "ciudad"],
          },
        ],
      });
      const resultadoCentrosAux = centrosVacunacionAux.map((centro) => {
        if (
          centro.Localidad.provincia ===
          centroOriginal.CentroVacunacion.Localidad.provincia
        ) {
          return {
            idCentro: centro.idCentro,
            idLocalidad: centro.idLocalidad,
            provincia: centro.Localidad.provincia,
            ciudad: centro.Localidad.ciudad,
            direccion: centro.direccion,
            telefono: centro.telefono,
          };
        }
      });
      const resultadoCentro = resultadoCentrosAux.filter((resu) => resu !== undefined);

      res.render("editarLoteCentro", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        resultadoCentro,
        idLote,
        resultado,
        loteCentro
      });
    } catch (error) {
      console.error("Error al obtener las compras", error);
      res.sendStatus(500);
    }
  },
  editarLoteCentroPost: async (req, res) => {
    const idLoteCentro = req.params.id;
    const idSubloteProv = req.body.loteSelect;
    const cantVacunas = req.body.cantidadVacunas;
    const idCentro = req.body.centros;
    const fechaRecepcion = req.body.fechaRecepcion;
    const devolverVacuna = req.body.devolverVacuna;

    console.log(req.body);
    try {
      const centroOriginal = await models.CentroVacunacionStock.findByPk(idLoteCentro, {
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
          {
            model: models.CentroVacunacion,
            include: [
              {
                model: models.Localidad,
              },
            ],
          },
        ],
      });
      console.log("CENTROSTROCK");
      console.log(centroOriginal);

      if (
        centroOriginal.estado !== "descarcado" &&
        centroOriginal.estado !== "sinStock"
      ) {
        if (idSubloteProv !== "" && idSubloteProv !== "-") {
          const subloteProvOriginal = await models.DepoProvinciaStock.findByPk(
            centroOriginal.idSublote
          );

          const subloteProvNuevo = await models.DepoProvinciaStock.findByPk(idSubloteProv);
          if (devolverVacuna) {
            if (
              cantVacunas !== "" &&
              subloteProvNuevo.cantVacunas >= Number(cantVacunas)
            ) {
              subloteProvNuevo.cantVacunas =
                subloteProvNuevo.cantVacunas - Number(cantVacunas);
              subloteProvOriginal.cantVacunas =
                subloteProvOriginal.cantVacunas + centroOriginal.cantVacunas;

              await models.CentroVacunacionStock.update(
                { cantVacunas: cantVacunas },
                { where: { id: idLoteCentro } }
              );
              if (subloteProvNuevo.cantVacunas === 0) {
                subloteProvNuevo.estado = "sinStock";
              }
              await subloteProvNuevo.save();
              await subloteProvOriginal.save();

              const [numUpdated] = await models.CentroVacunacionStock.update(
                { idSublote: idSubloteProv },
                { where: { id: idLoteCentro } }
              );
              // centroOriginal.idSublote = idSubloteProv;
            } else if (
              cantVacunas === "" &&
              subloteProvNuevo.cantVacunas >= centroOriginal.cantVacunas
            ) {
              console.log("ENTROOOOOOOOOOOOOO 2");
              subloteProvNuevo.cantVacunas =
                subloteProvNuevo.cantVacunas - centroOriginal.cantVacunas;
              subloteProvOriginal.cantVacunas =
                subloteProvOriginal.cantVacunas + centroOriginal.cantVacunas;

              if (subloteProvNuevo.cantVacunas === 0) {
                subloteProvNuevo.estado = "sinStock";
              }
              await subloteProvNuevo.save();
              await subloteProvOriginal.save();
              console.log("centroOriginal.idSublote");
              console.log(centroOriginal.idSublote);
              console.log("idSubloteProv");
              console.log(parseInt(idSubloteProv));

              // centroOriginal.idSublote = idSubloteProv;
              const [numUpdated] = await models.CentroVacunacionStock.update(
                { idSublote: idSubloteProv },
                { where: { id: idLoteCentro } }
              );

              console.log("CENTROORIGINAL DEPSUES");
              console.log(centroOriginal);
            } else {
              console.log("ENTROOOOOOOOOOOOOO 3");
              return res.render("centrosVacunacionStock", {
                alert: true,
                alertTitle: "ERROR",
                alertMessage:
                  "Modificacion no permitida, la cantidad del nuevo lote es menor a la cantidad de vacunas",
                alertIcon: "error",
                showConfirmButton: true,
                timer: false,
                ruta: "centrosStock",
                resultado: ["a"],
                tipoVac: ["a"],
                prov: ["a"],
              });
            }
          } else {
            if (cantVacunas !== "") {
              await models.CentroVacunacionStock.update(
                { idSublote: idSubloteProv },
                { where: { id: idLoteCentro } }
              );
              await models.CentroVacunacionStock.update(
                { cantVacunas: cantVacunas },
                { where: { id: idLoteCentro } }
              );
            } else {
              await models.CentroVacunacionStock.update(
                { idSublote: idSubloteProv },
                { where: { id: idLoteCentro } }
              );
            }
          }
        }

        if (idSubloteProv === "" || (idSubloteProv === "-" && cantVacunas !== "")) {
          centroOriginal.cantVacunas = cantVacunas;
        }

        if (idCentro !== "-" && idCentro !== "") {
          const [numUpdated] = await models.CentroVacunacionStock.update(
            { idCentro: idCentro },
            { where: { id: idLoteCentro } }
          );
        }

        if (fechaRecepcion !== "") {
          centroOriginal.fechaRecepcion = fechaRecepcion;
          console.log("ESTADOOOOOO");
          console.log(centroOriginal.estado);
          if (centroOriginal.estado !== "descartado") {
            centroOriginal.estado = "enStock";
          }
        }

        await centroOriginal.save();
        console.log("FINNNNNNNNNNNN===========================================");
        res.render("centrosVacunacionStock", {
          alert: true,
          alertTitle: "Modificacion Exitosa",
          alertMessage: "Correctamente realizada",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1200,
          ruta: "centrosStock",
          resultado: ["a"],
          tipoVac: ["a"],
          prov: ["a"],
        });
      } else {
        return res.render("centrosVacunacionStock", {
          alert: true,
          alertTitle: "ERROR",
          alertMessage: "No se pudo realizar la Modificación",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "centrosStock",
          resultado: ["a"],
          tipoVac: ["a"],
          prov: ["a"],
        });
      }
    } catch (error) {
      console.log(error);
      res.render("centrosVacunacionStock", {
        alert: true,
        alertTitle: "ERROR",
        alertMessage: "No se pudo realizar la Modificación",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "centrosStock",
        resultado: ["a"],
        tipoVac: ["a"],
        prov: ["a"],
      });
    }
  },
};
