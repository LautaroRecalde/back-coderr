// ... (Importaciones necesarias)

app.post('/login', passport.authenticate('local', {
    // ... (Configuración de ruta de login)
  }));
  
  app.post('/register', (req, res) => {
    // ... (Configuración de ruta de registro)
  });
  
  app.get('/auth/github', passport.authenticate('github'));
  
  app.get('/auth/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      // ... (Manejador de callback de GitHub)
    });
  
  