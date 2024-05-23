const models = require('../dabase/models/index');


module.exports = {
  agregarDepoNac: async (req, res) => {
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";

    res.render("agregarDepoNac", {
      // userName,
      // loginlogoutLink,
      // loginlogoutName,
    });
  },
  agregarDepoNacPost: async (req, res) => {
    let idLocalidad;
    const provincia = "Buenos Aires";
    const ciudad = req.body.ciudad;
    const direccion = req.body.direccion;
    const telefono = req.body.telefono;

    if (
      provincia !== "-" &&
      ciudad.trim().length !== 0 &&
      direccion.trim().length !== 0 &&
      telefono.trim().length !== 0
    ) {
      try {
        const localidadBusc = await models.Localidad.findOne({
          where: { provincia: provincia, ciudad: ciudad },
        });

        if (!localidadBusc) {
          const localidad = await models.Localidad.create({
            provincia: provincia,
            ciudad: ciudad,
          });
          idLocalidad = localidad.idLocalidad;
        } else {
          idLocalidad = localidadBusc.idLocalidad;
        }
        const depoNacAux = await models.DepositoNacion.findOne({
          where: {
            idLocalidad: idLocalidad,
            direccion: direccion,
            telefono: telefono,
          },
        });
        console.log(depoNacAux);
        if (!depoNacAux) {
          const depoNac = await models.DepositoNacion.create({
            idLocalidad: idLocalidad,
            direccion: direccion,
            telefono: telefono,
          });
        }

        res.render("agregarDepoNac", {
          alert: true,
          alertTitle: "Agregado",
          alertMessage: "Se agregó correctamente el Depósito",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "api/depositosNacion/agregarDepoNacion",
        });
      } catch (error) {
        console.log(error);
        res.render("agregarDepoNac", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "No se pudo agregar el Depósito",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "api/depositosNacion/agregarDepoNacion",
        });
      }
    } else {
      res.render("agregarDepoNac", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Complete los campos obligatorios",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "api/depositosNacion/agregarDepoNacion",
      });
    }
  },
};
