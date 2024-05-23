const models = require('../dabase/models/index');

module.exports = {
  compraVacuna: async (req, res) => {
    const tipoVacuna = req.body.tipoVacuna;
    const laboratorio = req.body.laboratorio;
    const nombreComercial = req.body.laboratorio;
    const paisOrigen = req.body.paisOrigen;
    const cantidadVacunas = req.body.cantidadVacunas;
    const deposito = req.body.deposito;
    const idVacuna = req.body.idVacuna;
    if (
      tipoVacuna !== "-" &&
      laboratorio !== "-" &&
      nombreComercial !== "" &&
      paisOrigen !== "" &&
      cantidadVacunas > 0 &&
      deposito !== "-"
    ) {
      try {
        const nuevoLote = {
          idVacuna: idVacuna,
          fechaFabricacion: getRandomDate("2024-01-01", "2024-02-21"),
          fechaVencimiento: getRandomDate("2025-07-15", "2028-01-01"),
          estado: "enViaje",
          cantVacunas: cantidadVacunas,
          fechaAdquisicion: null,
          idDepoNacion: deposito,
        };

        const loteCreado = await models.LoteProveedor.create(nuevoLote);

        console.log("Lote proveedor creado:", loteCreado);
        try {
          const nuevaCompra = {
            idLote: loteCreado.idLote,
            fechaCompra: new Date(),
            cantVacunas: cantidadVacunas,
          };

          // Crea la compra en la base de datos
          const compraCreada = await models.Compralote.create(nuevaCompra);

          console.log("Compra creada:", compraCreada);
        } catch (error) {
          console.error("Error al crear la compra:", error);
        }
      } catch (error) {
        console.error("Error al crear el lote proveedor:", error);
      }

      console.log(req.body);
      res.render("compra", {
        alert: true,
        alertTitle: "Tarea Exitosa!!",
        alertMessage: "Compra realizada Correctamente",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 1800,
        ruta: "api/vacunas/compra",
        resultado: ["a"],
        resultadoDepo: ["a"],
      });
    } else {
      res.render("compra", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Complete todos los campos",
        alertIcon: "error",
        showConfirmButton: false,
        timer: 1800,
        ruta: "/api/vacunas/compra",
        resultado: ["a"],
        resultadoDepo: ["a"],
      });
    }
  },
  mostrarCompraVacuna: async (req, res) => {
    // userName = req.session.user.email;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";

    try {
      const vacunas = await models.Vacuna.findAll({
        include: [
          {
            model: models.Laboratorio,
            attributes: ["nombre"],
          },
        ],
      });

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

      res.render("compra", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        resultado,
        resultadoDepo,
      });
    } catch (error) {
      console.error("Error al obtener las vacunas", error);
      res.sendStatus(500);
    }
  },
  crearVacuna: async (req, res) => {
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";

    try {
      const vacunas = await models.Vacuna.findAll({
        include: [
          {
            model: models.Laboratorio,
            attributes: ["nombre"],
          },
        ],
      });

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

      res.render("crearVacuna", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        resultado,
        resultadoDepo,
      });
    } catch (error) {
      console.error("Error al obtener las vacunas", error);
      res.sendStatus(500);
    }
  },
  crearVacunaPost: async (req, res) => {
    const tipoVacuna = req.body.tipoVacuna;
    const nombreComercial = req.body.nombreComercial;
    const paisOrigen = req.body.paisOrigen;
    const nobreLaboratorio = req.body.nobreLaboratorio;
    const emailLaboratorio = req.body.emailLaboratorio;
    const telefonoLaboratorio = req.body.telefonoLaboratorio;
    let labId;
    let vac;
    console.log(req.body);
    try {
      const vacunas = await models.Vacuna.findAll();
      const laboratorios = await models.Laboratorio.findAll();
      laboratorios.forEach((lab) => {
        if (lab.nombre === nobreLaboratorio) {
          labId = lab.idLaboratorio;
        }
      });

      if (!labId) {
        const nuevoLab = await models.Laboratorio.create({
          nombre: nobreLaboratorio,
          pais: paisOrigen,
          email: emailLaboratorio,
          telefono: telefonoLaboratorio,
        });
        labId = nuevoLab.idLaboratorio;
      }

      if (
        vacunas.find(
          (vacuna) =>
            vacuna.tipoVacuna === tipoVacuna &&
            vacuna.nombreComercial === nombreComercial &&
            vacuna.idLaboratorio == labId
        )
      ) {
        res.render("crearVacuna", {
          alert: true,
          alertTitle: "Error",
          alertMessage:
            "Vacuna no creada datos iguales a una existente",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "crearVacuna",
          resultado: ["a"],
          resultadoDepo: ["a"],
        });
      } else {
        const nuevaVac = await models.Vacuna.create({
          idLaboratorio: labId,
          tipoVacuna: tipoVacuna,
          nombreComercial: nombreComercial,
          paisOrigen: paisOrigen,
        });
      }

      res.render("compra", {
        alert: true,
        alertTitle: "Tarea Exitosa!",
        alertMessage: "Vacuna creada Correctamente",
        alertIcon: "success",
        showConfirmButton: false,
        timer: 1800,
        ruta: "api/vacunas/compra",
        resultado: ["a"],
        resultadoDepo: ["a"],
      });
    } catch (error) {
      res.render("crearVacuna", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Complete todos los campos",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "api/vacunas/crearVacuna",
        resultado: ["a"],
        resultadoDepo: ["a"],
      });
    }
  },
};

function getRandomDate(startDate, endDate) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const randomTime = Math.random() * (end - start) + start;
  return new Date(randomTime);
}
