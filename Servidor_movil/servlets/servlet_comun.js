function comprobacionLogin(req, res, callback) {
  try {
    callback();
  } catch (error) {
    console.error("Usuario no autorizado " + error);
    res.status(400).send("Usuario no autorizado");
  }
}
