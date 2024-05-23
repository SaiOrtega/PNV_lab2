const models = require('../dabase/models/index');

module.exports = {
  // aplicacionVacuna: async (req, res) => {

  //   try {
  //     const localidadesTodasAux = await models.Localidad.findAll();
  //     const localidadesOrdenadasTodas = localidadesTodasAux.sort((a, b) =>
  //       a.provincia.localeCompare(b.provincia)
  //     );
  //     const localidadesTodas = localidadesOrdenadasTodas.map((localidad) => {
  //       return {
  //         idLocalidad: localidad.idLocalidad,
  //         provincia: localidad.provincia,
  //         ciudad: localidad.ciudad,
  //       };
  //     });

  //     const centroStock = await models.CentroVacunacionStock.findAll({
  //       include: [
  //         {
  //           model: models.DepoProvinciaStock,
  //           include: [
  //             {
  //               model: models.LoteProveedor,
  //               include: [
  //                 {
  //                   model: models.Vacuna,
  //                   attributes: ["tipoVacuna", "nombreComercial", "paisOrigen"],
  //                   include: [
  //                     {
  //                       model: models.Laboratorio,
  //                       attributes: ["nombre"],
  //                     },
  //                   ],
  //                 },
  //               ],
  //             },
  //           ],
  //           attributes: ["id", "idDepoProv"],
  //         },
  //         {
  //           model: models.CentroVacunacion,
  //           include: [
  //             {
  //               model: models.Localidad,
  //               attributes: ["provincia", "ciudad"],
  //             },
  //           ],
  //         },
  //       ],
  //       where: {
  //         estado: "enStock",
  //       },
  //     });
  //     let idsCentros = [];

  //     const resultadoAux = centroStock.map((stock) => {
  //       idsCentros.push(stock.idCentro);
  //       return {
  //         id: stock.id,
  //         idCentro: stock.idCentro,
  //         idLote: stock.DepoProvinciaStock.LoteProveedor.idLote,
  //         tipoVacuna: stock.DepoProvinciaStock.LoteProveedor.Vacuna.tipoVacuna,
  //         nombreComercial: stock.DepoProvinciaStock.LoteProveedor.Vacuna.nombreComercial,
  //         nombreLaboratorio:
  //           stock.DepoProvinciaStock.LoteProveedor.Vacuna.Laboratorio.nombre,
  //         vencida: stock.DepoProvinciaStock.LoteProveedor.vencida,
  //         ciudad: stock.CentroVacunacion.Localidad.ciudad,
  //         provincia: stock.CentroVacunacion.Localidad.provincia,
  //         direccion: stock.CentroVacunacion.direccion,
  //         cantVacunas: stock.cantVacunas,
  //         fechaRecepcion: stock.fechaRecepcion,
  //         estado: stock.estado,
  //       };
  //     });

  //     if (resultadoAux.length > 0) {
  //       const resultados = resultadoAux.filter((item) => item !== undefined);

  //       const centrosVacunacion = await models.CentroVacunacion.findAll({
  //         where: {
  //           idCentro: idsCentros, // Filtramos por el idCentro igual a 1
  //         },
  //         include: [
  //           {
  //             model: models.Localidad,
  //             attributes: ["idLocalidad", "provincia", "ciudad"],
  //           },
  //         ],
  //       });
  //       let idLocalidades = [];

  //       centrosVacunacion.forEach((centro) => {
  //         idLocalidades.push(centro.idLocalidad);
  //       });

  //       const localidadesAux = await models.Localidad.findAll({
  //         where: {
  //           idLocalidad: idLocalidades, // Filtramos por el idCentro igual a 1
  //         },
  //       });

  //       const localidadesOrdenadas = localidadesAux.sort((a, b) =>
  //         a.provincia.localeCompare(b.provincia)
  //       );
  //       const localidades = localidadesOrdenadas.map((localidad) => {
  //         return {
  //           idLocalidad: localidad.idLocalidad,
  //           provincia: localidad.provincia,
  //           ciudad: localidad.ciudad,
  //         };
  //       });

  //       console.log("===============");
  //       console.log(centrosVacunacion.length);

  //       // const centrosVacunacion = await CentroVacunacion.findAll({
  //       //   include: [
  //       //     {
  //       //       model: Localidad,
  //       //       attributes: ["provincia", "ciudad"],
  //       //     },
  //       //   ],
  //       // });

  //       const resultadoCentros = centrosVacunacion.map((aux) => {
  //         return {
  //           idCentro: aux.idCentro,
  //           idLocalidad: aux.idLocalidad,
  //           provincia: aux.Localidad.provincia,
  //           ciudad: aux.Localidad.ciudad,
  //           direccion: aux.direccion,
  //           telefono: aux.telefono,
  //         };
  //       });

  //       const enfermeros = await models.Enfermero.findAll();

  //       const resultadoEnfermeros = enfermeros.map((aux) => {
  //         return {
  //           idEnfermero: aux.idEnfermero,
  //           nombre: aux.nombre,
  //           idCentro: aux.idCentro,
  //         };
  //       });

  //       res.render("aplicacionVacuna", {
  //         // userName,
  //         // loginlogoutLink,
  //         // loginlogoutName,
  //         resultados,
  //         localidades,
  //         resultadoCentros,
  //         resultadoEnfermeros,
  //         localidadesTodas,
  //       });
  //     } else {
  //       res.render("compra", {
  //         alert: true,
  //         alertTitle: "Error",
  //         alertMessage: `Aplicación fallida, no hay vacunas en ningun centro`,
  //         alertIcon: "error",
  //         showConfirmButton: true,
  //         timer: false,
  //         ruta: "api/vacunas/mostrarCompraVacuna/compra",
  //         resultado: ["a"],
  //         resultadoDepo: ["a"],
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error al obtener los datos", error);
  //     res.sendStatus(500);
  //   }
  // },
  aplicacionVacunaPost: async (req, res, next) => {
    const body = req.body;
    let idPaciente;
    let idLocalidad;
    let idEnfermero;
    console.log(body);

    if (
      body.provincia !== "-" &&
      body.vacunas !== "-" &&
      body.centro !== "-" &&
      body.lote !== "-" &&
      body.sublote !== "-" &&
      body.provincia.trim().length !== 0 &&
      body.vacunas.trim().length !== 0 &&
      body.centro.trim().length !== 0 &&
      body.lote.trim().length !== 0 &&
      body.sublote.trim().length !== 0 &&
      body.nombre.trim().length !== 0 &&
      body.apellido.trim().length !== 0 &&
      body.dni.trim().length !== 0 &&
      body.telefono.trim().length !== 0 &&
      body.direccion.trim().length !== 0 &&
      body.genero.trim().length !== 0 &&
      body.email.trim().length !== 0 &&
      body.ciudad.trim().length !== 0 &&
      body.provincia.trim().length !== 0
    ) {
      try {
        const centroStock = await models.CentroVacunacionStock.findOne({
          where: { id: body.sublote },
        });
        console.log(Number(body.lote));
        const loteAux = await models.LoteProveedor.findByPk(Number(body.lote));
        if (loteAux.vencida) {
          res.render("aplicacionVacuna", {
            alert: true,
            alertTitle: "Vacuna Vencida",
            alertMessage: `No se puede realizar la aplicacion de la vacuna por que esta vencida, proceda a hacer el descate correspondiente`,
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "vacunasDescarte",
          });
          return;
        } else if (centroStock.estado === "enStock") {
          const localidadBusc = await models.Localidad.findOne({
            where: { provincia: req.body.provincia, ciudad: req.body.ciudad },
          });
          if (localidadBusc === null) {
            const localidad = await models.Localidad.create({
              provincia: req.body.provincia,
              ciudad: req.body.ciudad,
            });
            console.log("LOCALIDAD ID: ");
            console.log(`${localidad.idLocalidad}`);
            idLocalidad = localidad.idLocalidad;
          } else {
            idLocalidad = localidadBusc.idLocalidad;
          }
          const pacienteBusc = await models.Paciente.findOne({ where: { dni: req.body.dni } });
          console.log(pacienteBusc);
          if (pacienteBusc === null) {
            console.log(`ID LOCALIDAD: ${idLocalidad}`);
            const newPaciente = await models.Paciente.create({
              nombre: body.nombre,
              apellido: body.apellido,
              dni: body.dni,
              telefono: body.telefono,
              direccion: body.direccion,
              genero: body.genero,
              mail: body.email,
              idLocalidad: Number(idLocalidad),
            });
            console.log(newPaciente);
            idPaciente = newPaciente.idPaciente;
          } else {
            idPaciente = pacienteBusc.idPaciente;
          }
          if (body.nombreEnfermero) {
            const enferemero = await models.Enfermero.create({
              nombre: body.nombreEnfermero,
              idCentro: body.centro,
            });
            console.log("enferemero.idEnfermero");
            console.log(enferemero.idEnfermero);
            idEnfermero = enferemero.idEnfermero;
          } else {
            console.log("NO HAY ENFEREMRO");
            idEnfermero = body.enfermero;
          }
          console.log("PASO");
          const vacunaAplicada = await models.VacunasAplicada.create({
            idLote: body.lote,
            idLoteCentro: body.sublote,
            fechaAplicacion: body.fechaAplicacion,
            idPaciente: idPaciente,
            idEnfermero: idEnfermero,
            idCentro: body.centro,
          });

          centroStock.cantVacunas = centroStock.cantVacunas - 1;
          if (centroStock.cantVacunas === 0) {
            centroStock.estado = "sinStock";
          }
          await centroStock.save();
          console.log(req.body);
          console.log(`ID PACIENTE: ${idPaciente}`);

          res.render("aplicacionVacuna", {
            alert: true,
            alertTitle: "Confirmacion de Aplicacion",
            alertMessage: `La confirmacion de la aplicacion de la vacuna ${body.vacunas}`,
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: "api/vacunaciones/aplicacionVacuna",
          });
        } else {
          res.render("aplicacionVacuna", {
            alert: true,
            alertTitle: "Error en la confirmacion de aplicacion",
            alertMessage: `No se pudo confirma la aplicacion por falta de stock`,
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "api/vacunaciones/aplicacionVacuna",
          });
        }
      } catch (error) {
        console.log(error);
        res.render("aplicacionVacuna", {
          alert: true,
          alertTitle: "Error en la confirmacion de aplicacion",
          alertMessage: `Error ${error}`,
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "api/vacunaciones/aplicacionVacuna",
        });
      }
    } else {
      // console.log(error);
      res.render("aplicacionVacuna", {
        alert: true,
        alertTitle: "Error en la confirmacion de aplicacion",
        alertMessage: `Todos los campos deben estar completos`,
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "api/vacunaciones/aplicacionVacuna",
      });
    }
  },
  mostrarAplicaciones: async (req, res) => {
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";

    try {
      const vacunasAplicadas = await models.VacunasAplicada.findAll({
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
          {
            model: models.CentroVacunacion,
            include: [
              {
                model: models.Localidad,
              },
            ],
          },
          {
            model: models.Paciente,
            include: [
              {
                model: models.Localidad,
              },
            ],
          },
          {
            model: models.Enfermero,
          },
        ],
      });
      console.log("vacunasAplicadas", vacunasAplicadas);

      const resultado = vacunasAplicadas.map((aplicacion) => {
        const fechaFabricacion = new Date(aplicacion.CentroVacunacionStock.DepoProvinciaStock.LoteProveedor
          .fechaFabricacion
        )
        const fechaAplicacion = new Date(aplicacion.fechaAplicacion);
        const fechaVencimiento = new Date(
          aplicacion.CentroVacunacionStock.DepoProvinciaStock.LoteProveedor
            .fechaVencimiento
        );
        return {
          idAplicacion: aplicacion.idAplicacion,
          idCentro: aplicacion.CentroVacunacionStock.idCentro,
          idSubloteCentro: aplicacion.CentroVacunacionStock.id,
          idSubloteProv: aplicacion.CentroVacunacionStock.idSublote,
          idLote: aplicacion.CentroVacunacionStock.DepoProvinciaStock.idLote,
          direccion: aplicacion.CentroVacunacion.direccion,
          telefono: aplicacion.CentroVacunacion.telefono,
          ciudad: aplicacion.CentroVacunacion.Localidad.ciudad,
          provincia: aplicacion.CentroVacunacion.Localidad.provincia,
          idPaciente: aplicacion.idPaciente,
          pacienteNombre: aplicacion.Paciente.nombre,
          pacienteApellido: aplicacion.Paciente.apellido,
          pacienteDni: aplicacion.Paciente.dni,
          pacienteGenero: aplicacion.Paciente.genero,
          enfermeroId: aplicacion.Enfermero.idEnfermero,
          enfermero: aplicacion.Enfermero.nombre,
          vacuna:
            aplicacion.CentroVacunacionStock.DepoProvinciaStock.LoteProveedor.Vacuna
              .tipoVacuna,
          nombreComercial:
            aplicacion.CentroVacunacionStock.DepoProvinciaStock.LoteProveedor.Vacuna
              .nombreComercial,
          laboratorio:
            aplicacion.CentroVacunacionStock.DepoProvinciaStock.LoteProveedor.Vacuna
              .Laboratorio.nombre,
          fechaFabricacion: `${fechaFabricacion.getFullYear()}-${fechaFabricacion.getMonth() +
            1}-${fechaFabricacion.getDate()}`,
          fechaVencimiento: `${fechaVencimiento.getFullYear()}-${fechaVencimiento.getMonth() +
            1}-${fechaVencimiento.getDate()}`,
          fechaAplicacion: `${fechaAplicacion.getFullYear()}-${fechaAplicacion.getMonth() +
            1}-${fechaAplicacion.getDate()}`,
          vencida:
            aplicacion.CentroVacunacionStock.DepoProvinciaStock.LoteProveedor.vencida,
          estadoLote: aplicacion.CentroVacunacionStock.estado,
        };
      });

      console.log(resultado);
      const localidadSet = new Set(
        resultado.map((resu) => {
          return { ciudad: resu.ciudad, provincia: resu.provincia };
        })
      );

      const tipoVacSet = new Set(resultado.map((resu) => resu.vacuna));
      const centrosVacSet = new Set(
        resultado.map((resu) => {
          return JSON.stringify({
            idCentro: resu.idCentro,
            ciudad: resu.ciudad,
            provincia: resu.provincia,
            direccion: resu.direccion,
          });
        })
      );
      const localidad = [...localidadSet];
      const tipoVac = [...tipoVacSet];
      const centroVac = Array.from(centrosVacSet).map((jsonString) =>
        JSON.parse(jsonString)
      );

      res.render("vacunasAplicadas", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        resultado,
        tipoVac,
        centroVac,
        localidad,
      });
    } catch (error) {
      console.error("Error al obtener las compras", error);
      res.sendStatus(500);
    }
  },
  filtrarAplicadas: async (req, res) => {
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";
    const provincia = req.query.provincia;
    const tipoVacuna = req.query.tipoVacuna;
    const centroId = req.query.centroId;
    const vencidas = req.query.vencidas;
    const ciudad = req.query.localidad;

    // console.log("provincia");
    // console.log(provincia);
    // console.log("tipoVacuna");
    // console.log(tipoVacuna);
    // console.log("centroId");
    // console.log(centroId);
    // console.log("vencidas");
    // console.log(vencidas);
    // console.log("localidad");
    // console.log(ciudad);
    // console.log("====================================");
    // console.log("====================================");
    // console.log(req.query);
    // console.log("====================================");
    // console.log("====================================");

    try {
      if (
        provincia.trim().length > 0 &&
        tipoVacuna.trim().length > 0 &&
        centroId.trim().length > 0 &&
        ciudad.trim().length
      ) {
        const vacunasAplicadas = await models.VacunasAplicada.findAll({
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
            {
              model: models.CentroVacunacion,
              include: [
                {
                  model: models.Localidad,
                },
              ],
            },
            {
              model: models.Paciente,
              include: [
                {
                  model: models.Localidad,
                },
              ],
            },
            {
              model: models.Enfermero,
            },
          ],
        });

        const resultadoAux = vacunasAplicadas.map((aplicacion) => {
          return {
            idAplicacion: aplicacion.id,
            idCentro: aplicacion.CentroVacunacionStock.idCentro,
            idSubloteCentro: aplicacion.CentroVacunacionStock.id,
            idSubloteProv: aplicacion.CentroVacunacionStock.idSublote,
            idLote: aplicacion.CentroVacunacionStock.DepoProvinciaStock.idLote,
            direccion: aplicacion.Centrovacunacion.direccion,
            telefono: aplicacion.Centrovacunacion.telefono,
            ciudad: aplicacion.Centrovacunacion.Localidad.ciudad,
            provincia: aplicacion.Centrovacunacion.Localidad.provincia,
            idPaciente: aplicacion.idPaciente,
            pacienteNombre: aplicacion.Paciente.nombre,
            pacienteApellido: aplicacion.Paciente.apellido,
            pacienteDni: aplicacion.Paciente.dni,
            pacienteGenero: aplicacion.Paciente.genero,
            enfermeroId: aplicacion.Enfermero.idEnfermero,
            enfermero: aplicacion.Enfermero.nombre,

            vacuna:
              aplicacion.CentroVacunacionStock.DepoProvinciaStock.LoteProveedor.Vacuna
                .tipoVacuna,
            nombreComercial:
              aplicacion.CentroVacunacionStock.DepoProvinciaStock.LoteProveedor.Vacuna
                .nombreComercial,
            laboratorio:
              aplicacion.CentroVacunacionStock.DepoProvinciaStock.LoteProveedor.Vacuna
                .Laboratorio.nombre,
            fechaFabricacion:
              aplicacion.CentroVacunacionStock.DepoProvinciaStock.LoteProveedor
                .fechaFabricacion,
            fechaVencimiento:
              aplicacion.CentroVacunacionStock.DepoProvinciaStock.LoteProveedor
                .fechaVencimiento,
            fechaAplicacion: aplicacion.fechaAplicacion,
            vencida:
              aplicacion.CentroVacunacionStock.DepoProvinciaStock.LoteProveedor.vencida,
            estadoLote: aplicacion.CentroVacunacionStock.estado,
          };
        });

        const tipoVacSet = new Set(resultadoAux.map((resu) => resu.vacuna));
        const localidadSet = new Set(
          resultadoAux.map((resu) => {
            return { ciudad: resu.ciudad, provincia: resu.provincia };
          })
        );
        const centrosVacSet = new Set(
          resultadoAux.map((resu) => {
            return JSON.stringify({
              idCentro: resu.idCentro,
              ciudad: resu.ciudad,
              provincia: resu.provincia,
              direccion: resu.direccion,
            });
          })
        );

        const tipoVac = [...tipoVacSet];
        const localidad = [...localidadSet];
        const centroVac = Array.from(centrosVacSet).map((jsonString) =>
          JSON.parse(jsonString)
        );

        const resultado = resultadoAux.filter((resu) => {
          if (
            provincia !== "-" &&
            tipoVacuna !== "-" &&
            centroId !== "-" &&
            ciudad !== "-"
          ) {
            if (vencidas) {
              return (
                resu.provincia === provincia &&
                resu.vacuna === tipoVacuna &&
                resu.idCentro === centroId &&
                resu.ciudad === ciudad &&
                resu.vencida
              );
            } else {
              return (
                resu.provincia === provincia &&
                resu.vacuna === tipoVacuna &&
                resu.ciudad === ciudad
              );
            }
          } else if (
            provincia === "-" &&
            centroId === "-" &&
            tipoVacuna !== "-" &&
            ciudad !== "-"
          ) {
            if (vencidas) {
              return resu.vacuna === tipoVacuna && resu.ciudad === ciudad && resu.vencida;
            } else {
              return resu.vacuna === tipoVacuna && resu.ciudad === ciudad;
            }
          } else if (
            provincia === "-" &&
            centroId === "-" &&
            tipoVacuna !== "-" &&
            ciudad === "-"
          ) {
            if (vencidas) {
              return resu.vacuna === tipoVacuna && resu.vencida;
            } else {
              return resu.vacuna === tipoVacuna;
            }
          } else if (
            provincia === "-" &&
            centroId !== "-" &&
            tipoVacuna !== "-" &&
            ciudad !== "-"
          ) {
            if (vencidas) {
              return (
                resu.vacuna === tipoVacuna &&
                resu.idCentro === centroId &&
                resu.ciudad === ciudad &&
                resu.vencida
              );
            } else {
              return (
                resu.vacuna === tipoVacuna &&
                resu.idCentro === centroId &&
                resu.ciudad === ciudad
              );
            }
          } else if (
            provincia === "-" &&
            centroId !== "-" &&
            tipoVacuna !== "-" &&
            ciudad === "-"
          ) {
            if (vencidas) {
              return (
                resu.vacuna === tipoVacuna && resu.idCentro === centroId && resu.vencida
              );
            } else {
              return resu.vacuna === tipoVacuna && resu.idCentro === centroId;
            }
          } else if (
            tipoVacuna === "-" &&
            centroId === "-" &&
            provincia !== "-" &&
            ciudad !== "-"
          ) {
            if (vencidas) {
              return (
                resu.provincia === provincia && resu.ciudad === ciudad && resu.vencida
              );
            } else {
              return resu.provincia === provincia && resu.ciudad === ciudad;
            }
          } else if (
            tipoVacuna === "-" &&
            centroId === "-" &&
            provincia !== "-" &&
            ciudad === "-"
          ) {
            if (vencidas) {
              return resu.provincia === provincia && resu.vencida;
            } else {
              console.log("ENTRO!!!! ACA");
              return resu.provincia === provincia;
            }
          } else if (
            tipoVacuna === "-" &&
            centroId !== "-" &&
            provincia !== "-" &&
            ciudad !== "-"
          ) {
            if (vencidas) {
              return (
                resu.provincia === provincia &&
                resu.idCentro === centroId &&
                resu.ciudad === ciudad &&
                resu.vencida
              );
            } else {
              return (
                resu.provincia === provincia &&
                resu.ciudad === ciudad &&
                resu.idCentro === centroId
              );
            }
          } else if (
            tipoVacuna === "-" &&
            centroId !== "-" &&
            provincia !== "-" &&
            ciudad === "-"
          ) {
            if (vencidas) {
              return (
                resu.provincia === provincia && resu.idCentro === centroId && resu.vencida
              );
            } else {
              return resu.provincia === provincia && resu.idCentro === centroId;
            }
          } else if (
            tipoVacuna !== "-" &&
            centroId === "-" &&
            provincia !== "-" &&
            ciudad !== "-"
          ) {
            if (vencidas) {
              return (
                resu.provincia === provincia &&
                resu.vacuna === tipoVacuna &&
                resu.ciudad === ciudad &&
                resu.vencida
              );
            } else {
              return (
                resu.provincia === provincia &&
                resu.vacuna === tipoVacuna &&
                resu.ciudad === ciudad
              );
            }
          } else if (
            tipoVacuna !== "-" &&
            centroId === "-" &&
            provincia !== "-" &&
            ciudad === "-"
          ) {
            if (vencidas) {
              return (
                resu.provincia === provincia && resu.vacuna === tipoVacuna && resu.vencida
              );
            } else {
              return resu.provincia === provincia && resu.vacuna === tipoVacuna;
            }
          } else if (
            tipoVacuna === "-" &&
            centroId !== "-" &&
            provincia === "-" &&
            ciudad !== "-"
          ) {
            if (vencidas) {
              return resu.idCentro === centroId && resu.ciudad === ciudad && resu.vencida;
            } else {
              resu.idCentro === centroId && resu.ciudad === ciudad;
            }
          } else if (
            tipoVacuna === "-" &&
            centroId !== "-" &&
            provincia === "-" &&
            ciudad === "-"
          ) {
            if (vencidas) {
              return resu.idCentro === centroId && resu.vencida;
            } else {
              resu.idCentro === centroId;
            }
          } else if (
            tipoVacuna === "-" &&
            centroId === "-" &&
            provincia === "-" &&
            ciudad === "-"
          ) {
            if (vencidas) {
              return resu.vencida;
            }
          }
        });
        if (resultado.length > 0) {
          res.render("vacunasAplicadas", {
            // userName,
            // loginlogoutLink,
            // loginlogoutName,
            resultado,
            tipoVac,
            centroVac,
            localidad,
          });
        } else {
          res.render("vacunasAplicadas", {
            alert: true,
            alertTitle: "Error al filtrar",
            alertMessage: `No se encontraron lotes que coincidan con los filtros`,
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta: "api/vacunaciones/vacunasAplicadas",
            resultado: ["a"],
            tipoVac: ["a"],
            prov: ["a"],
            localidad: ["a"],
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
          ruta: "api/stockCentros/centrosStock",
          resultado: ["a"],
          tipoVac: ["a"],
          prov: ["a"],
          localidad: ["a"],
        });
      }
    } catch (error) {
      console.error("Error al obtener las compras", error);
      res.sendStatus(500);
    }
  },
  borrarAplicacion: async (req, res) => {
    const idAplicacion = req.params.id;
    const devolverVacuna = req.body.devolverVacuna;
    try {
      const aplicacionVacuna = await models.VacunasAplicada.findOne({
        where: { idAplicacion: idAplicacion },
      });
      const loteCentro = await models.CentroVacunacionStock.findOne({
        where: { id: aplicacionVacuna.idLoteCentro },
      });

      if (loteCentro.estado !== "descartado" && devolverVacuna) {
        const nuevaCantVacunas = loteCentro.cantVacunas + 1;
        await models.CentroVacunacionStock.update(
          { cantVacunas: nuevaCantVacunas },
          { where: { id: loteCentro.id } }
        );
      }
      const aplicacionVacunaBorrada = await models.VacunasAplicada.destroy({
        where: { idAplicacion: idAplicacion },
      });
      res.render("vacunasAplicadas", {
        resultado: [""],
        tipoVac: [""],
        centroVac: [""],
        localidad: [""],
        alert: true,
        alertTitle: "Operacion Correcta",
        alertMessage: `Se elimino la aplicacion correctamente`,
        alertIcon: "success",
        showConfirmButton: false,
        timer: 1500,
        ruta: "vacunasAplicadas",
      });
    } catch (error) {
      // console.log(error);
      res.render("vacunasAplicadas", {
        resultado: [""],
        tipoVac: [""],
        centroVac: [""],
        localidad: [""],
        alert: true,
        alertTitle: "Error",
        alertMessage: `No se pudo eliminar la aplicacion debido a un error`,
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "vacunasAplicadas",
      });
    }
  },
  aplicacionVacuna: async (req, res) => {
    try {
      // Fetch and sort localidades
      const localidadesTodasAux = await models.Localidad.findAll();
      const localidadesOrdenadasTodas = localidadesTodasAux.sort((a, b) => a.provincia.localeCompare(b.provincia));
      const localidadesTodas = localidadesOrdenadasTodas.map(localidad => ({
        idLocalidad: localidad.idLocalidad,
        provincia: localidad.provincia,
        ciudad: localidad.ciudad
      }));

      // Fetch centro stock
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
                        attributes: ["nombre"]
                      }
                    ]
                  }
                ]
              }
            ],
            attributes: ["id", "idDepoProv"]
          },
          {
            model: models.CentroVacunacion,
            include: [
              {
                model: models.Localidad,
                attributes: ["provincia", "ciudad"]
              }
            ]
          }
        ],
        where: { estado: "enStock" }
      });

      const idsCentros = [];
      const resultados = centroStock.map(stock => {
        idsCentros.push(stock.idCentro);
        return {
          id: stock.id,
          idCentro: stock.idCentro,
          idLote: stock.DepoProvinciaStock.LoteProveedor.idLote,
          tipoVacuna: stock.DepoProvinciaStock.LoteProveedor.Vacuna.tipoVacuna,
          nombreComercial: stock.DepoProvinciaStock.LoteProveedor.Vacuna.nombreComercial,
          nombreLaboratorio: stock.DepoProvinciaStock.LoteProveedor.Vacuna.Laboratorio.nombre,
          vencida: stock.DepoProvinciaStock.LoteProveedor.vencida,
          ciudad: stock.CentroVacunacion.Localidad.ciudad,
          provincia: stock.CentroVacunacion.Localidad.provincia,
          direccion: stock.CentroVacunacion.direccion,
          cantVacunas: stock.cantVacunas,
          fechaRecepcion: stock.fechaRecepcion,
          estado: stock.estado
        };
      }).filter(item => item !== undefined);

      if (resultados.length > 0) {
        const centrosVacunacion = await models.CentroVacunacion.findAll({
          where: { idCentro: idsCentros },
          include: [
            {
              model: models.Localidad,
              attributes: ["idLocalidad", "provincia", "ciudad"]
            }
          ]
        });

        const idLocalidades = centrosVacunacion.map(centro => centro.idLocalidad);

        const localidadesAux = await models.Localidad.findAll({
          where: { idLocalidad: idLocalidades }
        });

        const localidadesOrdenadas = localidadesAux.sort((a, b) => a.provincia.localeCompare(b.provincia));
        const localidades = localidadesOrdenadas.map(localidad => ({
          idLocalidad: localidad.idLocalidad,
          provincia: localidad.provincia,
          ciudad: localidad.ciudad
        }));

        const resultadoCentros = centrosVacunacion.map(aux => ({
          idCentro: aux.idCentro,
          idLocalidad: aux.idLocalidad,
          provincia: aux.Localidad.provincia,
          ciudad: aux.Localidad.ciudad,
          direccion: aux.direccion,
          telefono: aux.telefono
        }));

        const enfermeros = await models.Enfermero.findAll();

        const resultadoEnfermeros = enfermeros.map(aux => ({
          idEnfermero: aux.idEnfermero,
          nombre: aux.nombre,
          idCentro: aux.idCentro
        }));

        res.render("aplicacionVacuna", {
          resultados,
          localidades,
          resultadoCentros,
          resultadoEnfermeros,
          localidadesTodas
        });
      } else {
        res.render("compra", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "Aplicación fallida, no hay vacunas en ningun centro",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "api/vacunas/mostrarCompraVacuna/compra",
          resultado: ["a"],
          resultadoDepo: ["a"]
        });
      }
    } catch (error) {
      console.error("Error al obtener los datos", error);
      res.sendStatus(500);
    }
  },
  listadoPersonasVacunaVencida: async (req, res) => {
    try {
      const resultado = await models.VacunasAplicada.findAll({
        include: [
          {
            model: models.Paciente,
            attributes: ['nombre', 'apellido']
          },
          {
            model: models.CentroVacunacion,
            include: [
              {
                model: models.Localidad,
                attributes: ['provincia']
              }
            ],
            attributes: ['direccion']
          },
          {
            model: models.LoteProveedor,
            where: { vencida: true },
            include: [
              {
                model: models.Vacuna,
                attributes: ['tipoVacuna', 'nombreComercial']
              }
            ]
          }
        ],
        attributes: ['fechaAplicacion']
      });

      res.render('listadoVacunasVencidas', { data: resultado });
    } catch (error) {
      console.error('Error fetching data:', error);
      res.sendStatus(500);
    }
  },


};
