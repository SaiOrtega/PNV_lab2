const models = require('../dabase/models/index');


module.exports = {
  agregarDepoProv: async (req, res) => {
    const provincias = await models.Localidad.findAll({
      attributes: ["provincia"],
      group: ["provincia"],
      order: [["provincia", "ASC"]],
    })
      .then((localidades) => localidades.map(({ provincia }) => provincia))
      .catch((error) => {
        console.error("Error al obtener las provincias:", error);
        throw error;
      });

    const provinciasARegistrar = [
      "Buenos Aires",
      "Catamarca",
      "Chaco",
      "Chubut",
      "Córdoba",
      "Corrientes",
      "Entre Ríos",
      "Formosa",
      "Jujuy",
      "La Pampa",
      "La Rioja",
      "Mendoza",
      "Misiones",
      "Neuquén",
      "Río Negro",
      "Salta",
      "San Juan",
      "San Luis",
      "Santa Cruz",
      "Santa Fe",
      "Santiago del Estero",
      "Tierra del Fuego",
      "Tucumán",
    ].filter((provincia) => !provincias.includes(provincia));

    for (const provincia of provinciasARegistrar) {
      await models.Localidad.create({ provincia }).catch((error) => {
        console.error("Error al crear la provincia", error);
        throw error;
      });
    }
    res.render("agregarDepoProv", { provincias });
  },

  agregarDepoProvPost: async (req, res) => {
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
        console.log("localidadBusc, ", localidadBusc);// revisarrrrrrr

        if (localidadBusc && localidadBusc.Localidad) {
          idLocalidad = localidadBusc.idLocalidad;
        } else {
          const localidad = await models.Localidad.create({
            provincia: provincia,
            ciudad: ciudad,
          });

          idLocalidad = localidad.idLocalidad;
        }
        if (idLocalidad) {
          const depoProvAux = await models.DepositoProv.findOne({
            where: {
              idLocalidad: idLocalidad,
              direccion: direccion,
              telefono: telefono,
            }
          });

          if (!depoProvAux) {
            const depoProv = await models.DepositoProv.create({
              idLocalidad: idLocalidad,
              direccion: direccion,
              telefono: telefono,
            });
          }
        } else {
          console.log("localidadBusc------, ", localidadBusc);
        }

        res.render("agregarDepoProv", {
          alert: true,
          alertTitle: "Agregado",
          alertMessage: "Se agregó correctamente el Depósito",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: "api/depositosProvincias/agregarDepoProvincia",
          provincias: ["a"],
        });
      } catch (error) {
        console.log(error);
        res.render("agregarDepoProv", {
          alert: true,
          alertTitle: "Error",
          alertMessage: "No se pudo agregar el Depósito",
          alertIcon: "error",
          showConfirmButton: true,
          timer: false,
          ruta: "api/depositosProvincias/agregarDepoProvincia",
          provincias: ["a"],
        });
      }
    } else {
      res.render("agregarDepoProv", {
        alert: true,
        alertTitle: "Error",
        alertMessage: "Complete todos los campos obligatorios",
        alertIcon: "error",
        showConfirmButton: true,
        timer: false,
        ruta: "api/depositosProvincias/agregarDepoProvincia",
        provincias: ["a"],
      });
    }
  },
};


