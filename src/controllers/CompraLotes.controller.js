const models = require('../dabase/models/index');

module.exports = {
  mostrarCompraLotes: async (req, res) => {
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";

    try {
      const compralotes = await models.Compralote.findAll({
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
          },
        ],
      });
      const resultado = compralotes.map((compra) => {
        // console.log(compra.LoteProveedor.Deposito.Localidad.provincia);
        return {
          idCompra: compra.idCompra,
          idLote: compra.LoteProveedor.idLote,
          tipoVacuna: compra.LoteProveedor.Vacuna.tipoVacuna,
          nombreLaboratorio: compra.LoteProveedor.Vacuna.Laboratorio.nombre,
          nombreComercial: compra.LoteProveedor.Vacuna.nombreComercial,
          paisOrigen: compra.LoteProveedor.Vacuna.paisOrigen,
          fechaFabricacion: compra.LoteProveedor.fechaFabricacion,
          fechaVencimiento: compra.LoteProveedor.fechaVencimiento,
          estado: compra.LoteProveedor.estado,
          fechaAdquisicion: compra.LoteProveedor.fechaAdquisicion,
          idDepoNacion: compra.LoteProveedor.idDepoNacion,
          deposito: `${compra.LoteProveedor.idDepoNacion}-${compra.LoteProveedor.Deposito.Localidad.provincia} - ${compra.LoteProveedor.Deposito.Localidad.ciudad}`,
          cantVacunasCompradas: compra.cantVacunas,
          cantVacunas: compra.LoteProveedor.cantVacunas,

          fechaCompra: compra.fechaCompra,
        };
      });
      console.log("resultado: CompraLotes ", compralotes);

      res.render("modCompra", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        resultado,
        resultadoTodos: null,
      });
    } catch (error) {
      console.error("Error al obtener las compras", error);
      res.sendStatus(500);
    }
  },

  // filtrarCompras: async (req, res) => {
  //   // userName = req.session.user.correo;
  //   // loginlogoutName = "Logout";
  //   // loginlogoutLink = "/logout";
  //   console.log(req.query);
  //   const fechaInicio = req.query.fechainicio;
  //   const fechaFin = req.query.fechafin;
  //   const laboratorio = req.query.laboratorios;

  //   try {
  //     const compralotesTodos = await models.Compralote.findAll({
  //       include: [
  //         {
  //           model: models.LoteProveedor,
  //           include: [
  //             {
  //               model: models.Vacuna,
  //               attributes: ["tipoVacuna", "nombreComercial", "paisOrigen"],
  //               include: [
  //                 {
  //                   model: models.Laboratorio,
  //                   attributes: ["nombre"],
  //                 },
  //               ],
  //             },
  //             {
  //               model: models.DepositoNacion,
  //               include: [
  //                 {
  //                   model: models.Localidad,
  //                   attributes: ["provincia", "ciudad"],
  //                 },
  //               ],
  //               as: "Deposito", // Actualiza el alias aquí
  //               attributes: ["direccion", "telefono"],
  //             },
  //           ],
  //         },
  //       ],
  //     });
  //     const resultadoTodos = compralotesTodos.map((compra) => {
  //       // console.log(compra.LoteProveedor.Deposito.Localidad.provincia);
  //       return {
  //         idCompra: compra.idCompra,
  //         idLote: compra.LoteProveedor.idLote,
  //         tipoVacuna: compra.LoteProveedor.Vacuna.tipoVacuna,
  //         nombreLaboratorio: compra.LoteProveedor.Vacuna.Laboratorio.nombre,
  //         nombreComercial: compra.LoteProveedor.Vacuna.nombreComercial,
  //         paisOrigen: compra.LoteProveedor.Vacuna.paisOrigen,
  //         fechaFabricacion: compra.LoteProveedor.fechaFabricacion,
  //         fechaVencimiento: compra.LoteProveedor.fechaVencimiento,
  //         estado: compra.LoteProveedor.estado,
  //         fechaAdquisicion: compra.LoteProveedor.fechaAdquisicion,
  //         idDepoNacion: compra.LoteProveedor.idDepoNacion,
  //         deposito: `${compra.LoteProveedor.idDepoNacion}-${compra.LoteProveedor.Deposito.Localidad.provincia} - ${compra.LoteProveedor.Deposito.Localidad.ciudad}`,
  //         cantVacunas: compra.cantVacunas,
  //         fechaCompra: compra.fechaCompra,
  //       };
  //     });

  //     const compralotes = await models.Compralote.findAll({
  //       include: [
  //         {
  //           model: models.LoteProveedor,
  //           include: [
  //             {
  //               model: models.Vacuna,
  //               attributes: ["tipoVacuna", "nombreComercial", "paisOrigen"],
  //               include: [
  //                 {
  //                   model: models.Laboratorio,
  //                   attributes: ["nombre"],
  //                 },
  //               ],
  //             },
  //             {
  //               model: models.DepositoNacion,
  //               include: [
  //                 {
  //                   model: models.Localidad,
  //                   attributes: ["provincia", "ciudad"],
  //                 },
  //               ],
  //               as: "Deposito", // Actualiza el alias aquí
  //               attributes: ["direccion", "telefono"],
  //             },
  //           ],
  //         },
  //       ],
  //     });

  //     if (compralotes.length > 0) {
  //       const resultadoAux = compralotes.map((compra) => {
  //         // console.log(compra.LoteProveedor.Deposito.Localidad.provincia);     
  //         return {
  //           idCompra: compra.idCompra,
  //           idLote: compra.LoteProveedor.idLote,
  //           tipoVacuna: compra.LoteProveedor.Vacuna.tipoVacuna,
  //           nombreLaboratorio: compra.LoteProveedor.Vacuna.Laboratorio.nombre,
  //           nombreComercial: compra.LoteProveedor.Vacuna.nombreComercial,
  //           paisOrigen: compra.LoteProveedor.Vacuna.paisOrigen,
  //           fechaFabricacion: compra.LoteProveedor.fechaFabricacion,
  //           fechaVencimiento: compra.LoteProveedor.fechaVencimiento,
  //           estado: compra.LoteProveedor.estado,
  //           fechaAdquisicion: compra.LoteProveedor.fechaAdquisicion,
  //           idDepoNacion: compra.LoteProveedor.idDepoNacion,
  //           deposito: `${compra.LoteProveedor.idDepoNacion}-${compra.LoteProveedor.Deposito.Localidad.provincia} - ${compra.LoteProveedor.Deposito.Localidad.ciudad}`,
  //           cantVacunas: compra.cantVacunas,
  //           fechaCompra: compra.fechaCompra,
  //         };

  //       });

  //       console.log("===================")
  //       console.log("===================")
  //       console.log("RESULTADO AUX")
  //       console.log(resultadoAux)
  //       console.log("===================")
  //       console.log("===================")
  //       const resultado = resultadoAux.filter((resu) => {
  //         console.log(resu)
  //         if (laboratorio !== "-" && fechaFin === "" && fechaInicio === "") {
  //           console.log("entroooooooooooooooo")
  //           return resu.nombreLaboratorio === laboratorio
  //         } else if (laboratorio === "-" && fechaFin && fechaInicio) {
  //           return resu.fechaCompra >= fechaInicio && resu.fechaCompra <= fechaFin
  //         } else if (laboratorio !== "-" && fechaFin && fechaInicio) {
  //           return resu.fechaCompra >= fechaInicio && resu.fechaCompra <= fechaFin && resu.nombreLaboratorio === laboratorio
  //         }
  //       })

  //       console.log("===================");
  //       console.log(resultado);
  //       console.log("===================");
  //       if (resultado.length > 0) {
  //         res.render("modCompra", {
  //           userName,
  //           loginlogoutLink,
  //           loginlogoutName,
  //           resultado,
  //           resultadoTodos,
  //         });
  //       } else {
  //         res.render("modCompra", {
  //           alert: true,
  //           alertTitle: "Error al filtrar",
  //           alertMessage: `No se encontraron compras que coincidan con los filtros`,
  //           alertIcon: "error",
  //           showConfirmButton: true,
  //           timer: false,
  //           ruta: "modCompra",
  //           resultado: ["a"],
  //         });
  //       }
  //     } else {
  //       res.render("modCompra", {
  //         alert: true,
  //         alertTitle: "Error al filtrar",
  //         alertMessage: `No se encontraron compras que coincidan con los filtros`,
  //         alertIcon: "error",
  //         showConfirmButton: true,
  //         timer: false,
  //         ruta: "modCompra",
  //         resultado: ["a"],
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error al obtener las compras", error);
  //     res.sendStatus(500);
  //   }
  // },
  filtrarCompras: async (req, res) => {
    const fechaInicio = req.query.fechainicio || '';
    const fechaFin = req.query.fechafin || '';
    const laboratorio = req.query.laboratorios || '-';

    try {
      const laboratorios = await models.Laboratorio.findAll({ attributes: ["nombre"] });

      const compralotesTodos = await models.Compralote.findAll({
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
              {
                model: models.DepositoNacion,
                include: [
                  {
                    model: models.Localidad,
                    attributes: ["provincia", "ciudad"],
                  },
                ],
                as: "Deposito",
                attributes: ["direccion", "telefono"],
              },
            ],
          },
        ],
      });

      const resultadoTodos = compralotesTodos.map((compra) => {
        return {
          idCompra: compra.idCompra,
          idLote: compra.LoteProveedor.idLote,
          tipoVacuna: compra.LoteProveedor.Vacuna.tipoVacuna,
          nombreLaboratorio: compra.LoteProveedor.Vacuna.Laboratorio.nombre,
          nombreComercial: compra.LoteProveedor.Vacuna.nombreComercial,
          paisOrigen: compra.LoteProveedor.Vacuna.paisOrigen,
          fechaFabricacion: compra.LoteProveedor.fechaFabricacion,
          fechaVencimiento: compra.LoteProveedor.fechaVencimiento,
          estado: compra.LoteProveedor.estado,
          fechaAdquisicion: compra.LoteProveedor.fechaAdquisicion,
          idDepoNacion: compra.LoteProveedor.idDepoNacion,
          deposito: `${compra.LoteProveedor.idDepoNacion}-${compra.LoteProveedor.Deposito.Localidad.provincia} - ${compra.LoteProveedor.Deposito.Localidad.ciudad}`,
          cantVacunas: compra.cantVacunas,
          fechaCompra: compra.fechaCompra,
        };
      });

      const compralotes = await models.Compralote.findAll({
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
              {
                model: models.DepositoNacion,
                include: [
                  {
                    model: models.Localidad,
                    attributes: ["provincia", "ciudad"],
                  },
                ],
                as: "Deposito",
                attributes: ["direccion", "telefono"],
              },
            ],
          },
        ],
      });

      let resultado = [];

      if (compralotes.length > 0) {
        const resultadoAux = compralotes.map((compra) => {
          return {
            idCompra: compra.idCompra,
            idLote: compra.LoteProveedor.idLote,
            tipoVacuna: compra.LoteProveedor.Vacuna.tipoVacuna,
            nombreLaboratorio: compra.LoteProveedor.Vacuna.Laboratorio.nombre,
            nombreComercial: compra.LoteProveedor.Vacuna.nombreComercial,
            paisOrigen: compra.LoteProveedor.Vacuna.paisOrigen,
            fechaFabricacion: compra.LoteProveedor.fechaFabricacion,
            fechaVencimiento: compra.LoteProveedor.fechaVencimiento,
            estado: compra.LoteProveedor.estado,
            fechaAdquisicion: compra.LoteProveedor.fechaAdquisicion,
            idDepoNacion: compra.LoteProveedor.idDepoNacion,
            deposito: `${compra.LoteProveedor.idDepoNacion}-${compra.LoteProveedor.Deposito.Localidad.provincia} - ${compra.LoteProveedor.Deposito.Localidad.ciudad}`,
            cantVacunas: compra.cantVacunas,
            fechaCompra: compra.fechaCompra,
          };
        });

        resultado = resultadoAux.filter((resu) => {
          if (laboratorio !== "-" && fechaFin === "" && fechaInicio === "") {
            return resu.nombreLaboratorio === laboratorio;
          } else if (laboratorio === "-" && fechaFin && fechaInicio) {
            return resu.fechaCompra >= fechaInicio && resu.fechaCompra <= fechaFin;
          } else if (laboratorio !== "-" && fechaFin && fechaInicio) {
            return resu.fechaCompra >= fechaInicio && resu.fechaCompra <= fechaFin && resu.nombreLaboratorio === laboratorio;
          }
        });
      }

      res.render("filtroCompras", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        laboratorios,
        resultado,
        resultadoTodos,
        alert: resultado.length === 0,
        alertTitle: resultado.length === 0 ? "Error al filtrar" : "",
        alertMessage: resultado.length === 0 ? "No se encontraron compras que coincidan con los filtros" : "",
        alertIcon: resultado.length === 0 ? "error" : "",
        showConfirmButton: resultado.length === 0,
        timer: resultado.length === 0 ? false : 0,
        ruta: "filtroCompras",
      });
    } catch (error) {
      console.error("Error al obtener las compras", error);
      res.sendStatus(500);
    }
  },

};
