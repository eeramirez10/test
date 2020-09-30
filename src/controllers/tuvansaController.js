let controller = {}
const mysql = require('mysql');
const util = require('util');
const moment = require('moment');

const connection = mysql.createConnection({
    host: 'tuvansa-server.dyndns.org',
    user: 'erick',
    password: 'Ag7348pp**',
    database: 'tuvansa'
})

// Peticiones sincronas
const query = util.promisify(connection.query).bind(connection);

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

    (async () => {


        let busca = await query(`SELECT * FROM inventarios WHERE ISEQ = ${inventarios.ISEQ}`);

        if (busca.length <= 0) {
            let insert = await query('INSERT INTO inventarios SET ?', inventarios)
        } else {
            let actualiza = await query('UPDATE inventarios SET ALMCANTREAL = ?, IALTAREAL = ? WHERE ISEQ = ? ', [inventarios.ALMCANTREAL, inventarios.IALTAREAL, inventarios.ISEQ]);
        }


    })();
}

 controller.agregaInventarioRealDBTuvansaAdataTable = async (output)=>{
    const out = await output;

    for (const data of out.aaData) {
      let inventarios = await query(`SELECT  * FROM inventarios WHERE iseq = ${data[0]}`);
      if (inventarios.length > 0) {
        data[7] = inventarios[0].ALMCANTREAL
      }
    }
  
    return out;
}



module.exports = controller;