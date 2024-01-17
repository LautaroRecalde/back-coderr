const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
require('./passport-config')(passport); 
const { loginUser } = require('./authController'); 
const User = require('./models/Users');

const app = express();

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de la sesión
app.use(session({
  secret: 'mi-secreto', 
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// Rutas para la página de inicio de sesión y manejo del inicio de sesión
app.get('/login', (req, res) => {
  res.render('login');
});


app.post('/login', loginUser);



const port = 8080;
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
