const controller = {};
const tuvansaController = require('./tuvansaController');

const mysql = require('mysql');
const util = require('util');



//---Global vars
let sIndexColumn = '*';
let sTable = 'FINV';
var request = {};
var aColumns = ['FINV.ISEQ', 'ICOD', 'IEAN', 'I2DESCR', ' DATE_FORMAT(IALTA,"%Y-%m-%d")', 'ALMCANT', 'ALMNUM'];


//mysql 
const connection = mysql.createConnection({
    host: 'tuvansa.dyndns.org',
    user: 'consultas',
    password: 'consultas',
    database: 'tuvansa'
});
// Peticiones sincronas
const queryProscai = util.promisify(connection.query).bind(connection);


controller.list = (req, res) => {

    console.log('GET request to /server');
    request = req.query;
    server(res);

}


//------------------------- Functions
function server(res) {
    //Paging
    var sLimit = "";
    if (request['iDisplayStart'] && request['iDisplayLength'] != -1) {
        sLimit = 'LIMIT ' + request['iDisplayStart'] + ', ' + request['iDisplayLength']
    }

    //Ordering
    var sOrder = "";
    if (request['iSortCol_0']) {
        sOrder = 'ORDER BY ';

        for (var i = 0; i < request['iSortingCols']; i++) {
            if (request['bSortable_' + parseInt(request['iSortCol_' + i])] == "true") {
                sOrder += aColumns[parseInt(request['iSortCol_' + i])] + " " + request['sSortDir_' + i] + ", ";
            }
        }

        sOrder = sOrder.substring(0, sOrder.length - 2)
        if (sOrder == 'ORDER BY') {
            console.log("sOrder == ORDER BY");
            sOrder = "";
        }
    }

    //Filtering
    var sWhere = "";
    if (request['sSearch'] && request['sSearch'] != "") {
        let busqueda = request['sSearch'].toUpperCase();
        sWhere = "WHERE (";
        for (var i = 0; i < aColumns.length; i++) {
            sWhere += aColumns[i] + " LIKE " + "\'%" + busqueda + "%\'" + " OR ";
        }

        sWhere = sWhere.substring(0, sWhere.length - 4);
        sWhere += ')';
    }

    //Individual column filtering
    for (var i = 0; i < aColumns.length; i++) {
        if (request['bSearchable_' + i] && request['bSearchable_' + i] == "true" && request['sSearch_' + i] != '') {
            if (sWhere == "") {
                sWhere = "WHERE ";
            }
            else {
                sWhere += " AND ";
            }
            sWhere += " " + aColumns[i] + " LIKE " + request['sSearch_' + i] + " ";
        }
    }

    //Queries
    //var sQuery = "SELECT SQL_CALC_FOUND_ROWS " +aColumns.join(',')+ " FROM " +sTable+" "+sWhere+" "+sOrder+" "+sLimit +" limit 10";
    var sQuery = `SELECT SQL_CALC_FOUND_ROWS  ${aColumns.join(',')} FROM   ${sTable} LEFT JOIN FALM ON FALM.ISEQ=FINV.ISEQ LEFT JOIN FINV2 ON FINV2.I2KEY=FINV.ISEQ ${sWhere} ${sOrder} ${sLimit}  `;

    var rResult = {};
    var rResultFilterTotal = {};
    var aResultFilterTotal = {};
    var iFilteredTotal = {};
    var iTotal = {};
    var rResultTotal = {};
    var aResultTotal = {};

    (async () => {

        let results = await queryProscai(sQuery);
        if (!results) {
            return;
        }

        rResult = results;

        //Data set length after filtering 
        sQuery = "SELECT FOUND_ROWS()";

        results = await queryProscai(sQuery);

        rResultFilterTotal = results;
        aResultFilterTotal = rResultFilterTotal;
        iFilteredTotal = aResultFilterTotal[0]['FOUND_ROWS()'];

        //Total data set length 
        sQuery = "SELECT COUNT(" + sIndexColumn + ") FROM " + sTable;

        results = await queryProscai(sQuery);

        rResultTotal = results;
        aResultTotal = rResultTotal;
        iTotal = aResultTotal[0]['COUNT(*)'];

        //Output
        var output = {};
        var temp = [];

        output.sEcho = parseInt(request['sEcho']);
        output.iTotalRecords = iTotal;
        output.iTotalDisplayRecords = iFilteredTotal;
        output.aaData = [];

        var aRow = rResult;
        var row = [];

        for (var i in aRow) {
            for (Field in aRow[i]) {
                if (!aRow[i].hasOwnProperty(Field)) continue;
                temp.push(aRow[i][Field]);
            }
            output.aaData.push(temp);
            temp = [];
        }

       /*   tuvansaController.agregaInventarioRealDBTuvansaAdataTable(output)
            .then( resp => sendJSON(res, 200, resp));  */

        
            sendJSON(res, 200, output);

    })();

}

function sendJSON(res, httpCode, body) {
    var response = JSON.stringify(body);
    res.status(httpCode).send(response)

}



module.exports = controller;