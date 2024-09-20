import { nameFunctions } from "../config/constants.js";

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
      findOne: async(query) => {
        try {
          return await dbInstance.findOne({ where: query });
        } catch (error) {
          throw new Error(`Erro ao buscar registro: ${error.message}`);
        }
      },
      findByPk: async(req) => {
        try {
          const { id } = req.params;
          return await dbInstance.findByPk(id);
        } catch (error) {
          throw new Error(`Erro ao buscar registro: ${error.message}`);
        }
      },
      findAll: async (req, query = {}) => {
        try {
          const limit = Number(req.query.pageLimit) || 20;
          const page = Number(req.query.page) || 1;
          const offset = (page - 1) * limit;

          const results = await dbInstance.findAndCountAll({
            ...query,
            limit: limit, 
            offset: offset,
          });
      
          return {
            rows: results.rows,
            currentPage: page,
            totalItems: results.count,
            totalPages: Math.ceil(results.count / limit)
          };
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
      update: async (req, query = {}, data)=>{
        try {
          const [updated] = await dbInstance.update(
            data, 
            {...query}
          );
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
    