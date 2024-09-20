import { nameFunctions } from "../config/constants";

export function sequelizeHelper({ 
    dbInstance,
    service
  }) {
    if(!service){
      throw new Error('Db instance é obrigatorio');
    }
  
    if(!service){
      throw new Error('Objeto service é obrigatorio');
    }
    
    const functions = {
      findOne: async(query, unscoped = false) => {
        try {
          if(unscoped){
            return await dbInstance.unscoped().findOne({ where: query });
          } else {
            return await dbInstance.findOne({ where: query });
          }
        } catch (error) {
          throw new Error(`Erro ao buscar registro: ${error.message}`);
        }
      },
      findByPk: async(primaryKey) => {
        try {
          return await dbInstance.findByPk(primaryKey);
        } catch (error) {
          throw new Error(`Erro ao buscar registro: ${error.message}`);
        }
      },
      findAll: async (query = {}, unscoped = false) => {
        try {
          if(unscoped){
            return await dbInstance.unscoped().findAll({ where: query });
          } else {
            return await dbInstance.findAll({ where: query });
          }
        } catch (error) {
          throw new Error(`Erro ao buscar todos os registros: ${error.message}`);
        }
      },
      create: async (data) => {
        try {
          return await dbInstance.create(data);
        } catch (error) {
          throw new Error(`Erro ao criar o registro: ${error.message}`);
        }
      },
      update: async (query, data)=>{
        try {
          const [updated] = await dbInstance.update(data, { where: query });
          if (!updated) {
            throw new Error('Registro não encontrado ou dados não alterados');
          }
          return await updated;
        } catch (error) {
          throw new Error(`Erro ao atualizar o registro: ${error.message}`);
        }
      },
      delete: async (query) => {
        try {
          const deleted = await dbInstance.destroy({ where: query });
          if (!deleted) {
            throw new Error('Registro não encontrado');
          }
          return deleted;
        } catch (error) {
          throw new Error(`Erro ao deletar o registro: ${error.message}`);
        }
      }
    }
    
    const returnedService = { ...service } 
  
    Object.keys(functions).forEach((key) => {
      if (nameFunctions.includes(key)) {
        const crudHelper = functions[key];
  
        if (returnedService[key]) {
          returnedService[key] = (req, res) => service[key](req, res, crudHelper);
        } else {
          returnedService[key] = crudHelper;
        }
      }
    });
    
    return returnedService;
  }
    