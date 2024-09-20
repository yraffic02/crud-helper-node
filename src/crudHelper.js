
/**
  * @param {Object} serviceOptions
  * @param {string} serviceOptions.orm
  * @param {object} serviceOptions.dbInstance
  * @param {object} serviceOptions.service
*/

import { nameFunctions, ORMS }  from "./config/constants.js";
import { sequelizeHelper } from "./services/sequelizeHelper.js";
import { catchAsync } from "./utils/catchAsync.js";

export const servicesHelper = (serviceOptions) => {
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

const controllerReturnStatus = {
    findAll: { status: 200 },
    findByPk: { status: 200, notFoundStatus: 404 },
    findOne: { status: 200, notFoundStatus: 404 },
    create: { status: 201 },
    update: { status: 200, notFoundStatus: 404 },
    delete: { status: 200, notFoundStatus: 404 },
};  

export function controllerHelper({ service, controller }) {
    if(!service){
        throw new Error('Objeto service é obrigatorio');
    }

    if(!controller){
        throw new Error('Objeto controller é obrigatorio');
    }

    const newController = { ...controller };

    Object.keys(service).forEach((key) => {
        if (nameFunctions.includes(key)) {
            newController[key] = catchAsync(
                async (req, res) => {
                    const { status, notFoundStatus } = controllerReturnStatus[key];
            
                    const result = await service[key](req);
            
                    if (result === null) {
                        return res.status(notFoundStatus).send();
                    }
            
                    return res.status(status).json(result);
                }
            );
        }
    });

    return newController;
}

export function routesHelper({ controller, router }) {
    Object.keys(controller).forEach((key) => {
      if (nameFunctions.includes(key)) {
        const func = controller[key];
        
        if (typeof func !== 'function') {
            throw new Error(`O método do controlador para ${key} não é uma função`);
        }

        switch (key) {
            case 'findByPk':
                router.get('/:id', func);
                break;
            case 'findAll':
                router.get('/', func);
                break;
            case 'create':
                router.post('/', func);
                break;
            case 'update':
                router.patch('/:id', func);
                break;
            case 'delete':
                router.delete('/:id', func);
                break;
            default:
                break;
        }
      }
    });
  
    return router;
}