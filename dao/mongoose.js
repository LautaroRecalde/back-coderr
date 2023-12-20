const mongoose = require('mongoose');

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

module.exports = mongoose;