let controller = {}
const mysql = require('mysql');
const util = require('util');
const moment = require('moment');

const connection2 = mysql.createConnection({
    host: 'tuvansa-server.dyndns.org',
    user: 'erick',
    password: 'Ag7348pp**',
    database: 'tuvansa'
})

connection2.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection2.threadId);
});

// Peticiones sincronas
const query2 = util.promisify(connection2.query).bind(connection2);

controller.insert = (req, res) => {
    let data = req.body;
    let fechaActual = moment().format('YYYY-MM-DD');

    let inventarios = {
        'ISEQ': data.id,
        'ICOD': data.codigo,
        'IEAN': data.ean,
        'I2DESCR': data.descripcion,
        'IALTA': data.fecha,
        'ALMCANT': data.inventarioProscai,
        'IALTAREAL': fechaActual,
        'ALMCANTREAL': data.value,
    };

    console.log(inventarios);

    /*     (async () => {
    
      
            let busca = await query2(`SELECT * FROM inventarios WHERE ISEQ = ${inventarios.ISEQ}`);
    
            if (busca.length <= 0) {
                let insert = await query2('INSERT INTO inventarios SET ?', inventarios)
            } else {
                let actualiza = await query2('UPDATE inventarios SET ALMCANTREAL = ?, IALTAREAL = ? WHERE ISEQ = ? ', [inventarios.ALMCANTREAL, inventarios.IALTAREAL, inventarios.ISEQ]);
            }
    
    
        })().catch(err => console.log(err)) */
}

controller.agregaInventarioRealDBTuvansaAdataTable = async (output) => {
    const out = await output;

    for (const data of out.aaData) {
        let inventarios = await query2(`SELECT  * FROM inventarios WHERE iseq = ${data[0]}`);
        if (inventarios.length > 0) {
            data[7] = inventarios[0].ALMCANTREAL
        }
    }

    return out;
}



module.exports = controller;