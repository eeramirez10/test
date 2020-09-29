const controller = {};

const mysql = require('mysql');
//mysql 
const connection = mysql.createConnection({
    host: 'tuvansa.dyndns.org',
    user: 'consultas',
    password: 'consultas',
    database: 'tuvansa'
});

controller.list = (req,res)=>{
    const consulta = `
    SELECT FINV.ISEQ,ICOD, I2DESCR, DATE_FORMAT(IALTA,"%Y-%m-%d") AS IALTA, ALMCANT, ALMNUM 
    FROM FINV LEFT JOIN FALM ON FALM.ISEQ=FINV.ISEQ LEFT JOIN FINV2 ON FINV2.I2KEY=FINV.ISEQ 
    LIMIT 0,10`
    
    connection.query(consulta,(err,result)=>{
        if (err) throw err;
        res.json({
            data: result
        })
    })
}



module.exports = controller;