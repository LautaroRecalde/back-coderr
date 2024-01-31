const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./authRoutes');
const initializePassport = require('./passport-config'); 
const mongoose = require('mongoose');
const { loginUser } = require('./authController'); 

const app = express();

// Configuración de Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración de conexión a MongoDB
mongoose.connect('tu_url_de_conexion_a_MongoDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
}).then(() => {
  console.log('Conexión exitosa a MongoDB');
}).catch((error) => {
  console.error('Error de conexión a MongoDB:', error);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de la sesión
app.use(session({
  secret: 'mi-secreto', 
  resave: false,
  saveUninitialized: false,
}));

// Configuración de Passport y uso de las rutas
initializePassport(passport); // Inicializa passport
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/sessions', authRoutes);

// Rutas para la página de inicio de sesión y manejo del inicio de sesión
app.get('/login', (req, res) => {
  res.render('login');
});

// Utiliza la función loginUser del authController para el inicio de sesión
app.post('/login', loginUser);

const port = 8080;
app.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
