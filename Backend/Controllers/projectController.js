const {v4} = require('uuid')
const mssql = require('mssql')

const { sqlConfig } = require('../Config/config')
const { createProjectsTable } = require('../Database/Tables/createTables')

const createProject = async(req,res)=>{
try {
    const projectId = v4()
    const {projectName,projectDescription,endDate} = req.body

    const pool = await mssql.connect(sqlConfig)
    if(pool.connected){
        const result = await pool.request()
        .input('projectId', mssql.VarChar, projectId)
        .input('projectName', mssql.VarChar, projectName)
        .input('projectDescription', mssql.VarChar, projectDescription)
        .input('endDate', mssql.Date, endDate)
        
        .execute('addProjectPROC')
        
         if(result.rowsAffected==1){  
         return res.json({
             message: "Project created Succesfully",
         })}
         else{
             return res.json({message: "Creation failed"})
         }
 
     }else{
        return res.json({message: "database not connected"})
     }
    
} catch (error) {
    createProjectsTable()
    return res.json({message: "did not find the table click again because the table will be created"})
}   }

const viewallprojects = async(req, res)=>{
    try {
        const pool = await (mssql.connect(sqlConfig))
        const projects = (await pool.request().execute('getAllProjects')).recordset 
        res.json({projects: projects})
    } catch (error) {
        return res.json({error})
    }
}

const getOneProject = async(req, res)=>{
    try {
        const projectId = req.params.projectId
        const pool = await (mssql.connect(sqlConfig))
        const result = (await pool.request()
            .input('projectId', projectId)
            .execute('getOneProject')).recordset
        return res.json({project: result})    
    } catch (error) {
        return res.json({error})
    }
    
    
}

const updateProject = async(req,res)=>{
    try {
        const projectId = req.params.projectId
        const {projectName,projectDescription,startDate,endDate} = req.body

        const pool = await mssql.connect(sqlConfig)
        if(pool.connected){
            const result = await pool.request()
            .input('projectId', mssql.VarChar, projectId)
            .input('projectName', mssql.VarChar, projectName)
            .input('projectDescription', mssql.VarChar, projectDescription)
            .input('startDate',mssql.Date, startDate)
            .input('endDate', mssql.Date, endDate)
            .execute('updateProject')

            
             if(result.rowsAffected==1){  
             return res.json({
                 message: "Project updated Succesfully",
             })}
             else{
                 return res.json({message: "Update failed"})
             }
        }else{
            return res.json({message: "database not connected"})
        }
    } catch (error) {
        return res.json({error})
    }
}

const deleteProject= async(req,res)=>{
    try {
        const projectId = req.params.projectId

        const pool = await (mssql.connect(sqlConfig))

        const result = await pool.request()
        .input('projectId', projectId)
        .execute('deleteProject')

        if (result.rowsAffected==1){
            return res.json({
                message: 'deleted successfully'
            })
        }
        else{
            return res.json({
                message: 'Project not found'
            })
        } 
    } catch (error) {
        
    }
}


module.exports = {
    createProject,
    deleteProject,
    viewallprojects,
    getOneProject,
    updateProject
}