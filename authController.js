const bcrypt = require('bcrypt');
const User = require('./models/user');

async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('login', { error: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      req.session.user = {
        email: user.email,
        role: user.role,
      };
      res.redirect('/products');
    } else {
      res.render('login', { error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).render('login', { error: 'Error interno del servidor' });
  }
}

async function registerUser(req, res) {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.render('register', { error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Genera el hash de la contraseña

    const newUser = new User({
      email,
      password: hashedPassword, // Almacena el hash en la base de datos
    });

    await newUser.save();
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.status(500).render('register', { error: 'Error interno del servidor' });
  }
}

function logoutUser(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
}

function requireLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  requireLogin,
};
