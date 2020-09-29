const express = require('express');
const morgan = require('morgan');



const app = express();


//settings 
app.set('port', process.env.PORT || 3000);

//Importando rutas 
const proscaiRutas = require('./routes/proscai');

//routes 
app.use('/', proscaiRutas);

//middlewares 
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));


app.listen(app.get('port'),()=>{
    console.log(`Servidor en linea con el puerto ${app.get('port')}`)
})