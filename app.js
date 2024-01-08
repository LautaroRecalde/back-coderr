const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const { loginUser } = require('./authController'); // Importa la función de autenticación
const User = require('./models/user'); // Importa el modelo de usuario

const app = express();

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de la sesión
app.use(session({
  secret: 'mi-secreto', // Cambia esto a una cadena segura en producción
  resave: false,
  saveUninitialized: false,
}));

// Rutas para la página de inicio de sesión y manejo del inicio de sesión
app.get('/login', (req, res) => {
  res.render('login');
});

// Utiliza la función loginUser del authController para el inicio de sesión
app.post('/login', loginUser);

// ... Resto de tus rutas existentes ...

const port = 8080;
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
