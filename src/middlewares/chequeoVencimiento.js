const models = require('../dabase/models/index');
const { Op } = require('sequelize');

// const chequeoVencimiento = async (req, res, next) => {
//     try {
//         if (!models) {
//             throw new Error("Missing models object");
//         }
//         const currentDate = new Date();
//         if (!currentDate) {
//             throw new Error("Failed to get current date");
//         }

//         const [numUpdated, updatedRows] = await models.LoteProveedor.update(
//             { vencida: true },
//             {
//                 where: {
//                     fechaVencimiento: {
//                         [Op.lt]: currentDate,
//                     },
//                 },
//             }
//         ).catch((error) => {
//             throw new Error(`Failed to update vencida: ${error}`);
//         });
//         if (!numUpdated) {
//             throw new Error("numUpdated is null or undefined");
//         }
//         if (!updatedRows) {
//             throw new Error("updatedRows is null or undefined");
//         }

//         console.log(`${numUpdated} elementos actualizados correctamente`);
//     } catch (error) {
//         console.error("Error al cambiar el estado de vencida:", error);
//     }
//     next();
// };

const chequeoVencimiento = async (req, res, next) => {
    try {
        const currentDate = new Date();

        // Find all LoteProveedor objects whose fechaVencimiento is less than currentDate
        const lotesProveedor = await models.LoteProveedor.findAll({
            where: {
                fecha_Vencimiento: {
                    [Op.lt]: currentDate
                }
            }
        });
        console.log("lotesVencidos: ", lotesProveedor);
        // Update the vencida status of each LoteProveedor object
        for (const loteProveedor of lotesProveedor) {
            await loteProveedor.update({ vencida: true });
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = chequeoVencimiento;
