
/**
  * @param {Object} serviceOptions
  * @param {string} serviceOptions.orm
  * @param {object} serviceOptions.dbInstance
  * @param {object} serviceOptions.service
*/

import { ORMS }  from "./config/constants.js";
import { sequelizeHelper } from "./services/sequelizeHelper.js";

export const genereteServices = (serviceOptions) => {
    const ormName = serviceOptions.orm;

    switch (ormName) {
    case ORMS.SEQUELIZE:
        return  sequelizeHelper({
            dbInstance: serviceOptions.dbInstance,
            service: serviceOptions.service
        });
    default:
        throw new Error('Orm não suportado');
    }
}
