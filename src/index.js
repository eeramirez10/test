const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');


const app = express();


//settings 
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')

//Importando rutas 
const proscaiRutas = require('./routes/proscai');




//middlewares 
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(cors())

//routes 

app.use('/', proscaiRutas);
//app.use('/', tuvansaRutas);




app.listen(app.get('port'),()=>{
    console.log(`Servidor en linea con el puerto ${app.get('port')}`)
})