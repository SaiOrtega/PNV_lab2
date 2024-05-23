const models = require('../dabase/models/index');


module.exports = {
  agregarCentro: async (req, res) => {
    // userName = req.session.user.correo;
    // loginlogoutName = "Logout";
    // loginlogoutLink = "/logout";
    try {
      const localidades = await models.Localidad.findAll();
      const provincias = Array.from(
        new Set(
          localidades.map((aux) => aux.provincia).sort((a, b) => a.localeCompare(b))
        )
      );

      res.render("agregarCentro", {
        // userName,
        // loginlogoutLink,
        // loginlogoutName,
        provincias,
      });
    } catch (error) {
      console.error("Error al obtener los datos", error);
      res.sendStatus(500);
    }
  },
  agregarCentroPost: async (req, res) => {
    let idLocalidad;
    const provincia = req.body.provinciaSelect;
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
        const centroVacunacionAux = await models.CentroVacunacion.findOne({
          where: {
            idLocalidad: idLocalidad,
            direccion: direccion,
            telefono: telefono,
          }
        })
        if (!centroVacunacionAux) {
          const centroVacunacion = await models.CentroVacunacion.create({
            idLocalidad: idLocalidad,
            direccion: direccion,
            telefono: telefono,
          });
        }


        res.render("agregarCentro", {
          alert: true,
          alertTitle: "Centro Agregado",
          alertMessage: "Se agregó el centro correctamente",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "api/centros/agregarCentro",
          provincias: ["a"]
        });
      } catch (error) {
        console.log(error);
        res.render("agregarCentro", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "No se pudo agregar el Centro ",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "api/centros/agregarCentro",
          provincias: ["a"]
        });
      }
    } else {
      res.render("agregarCentro", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Complete todos los campos",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "api/centros/agregarCentro",
        provincias: ["a"]
      });
    }
  },
};
