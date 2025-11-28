const express = require("express");
const axios = require("axios");
const app = express();

// Middleware para entender el JSON que manda WhatsApp
app.use(express.json());

// RUTA 1: VERIFICACIÓN (El "apretón de manos" con Meta)
// Meta te mandará un código secreto para ver si eres tú.
app.get("/webhook", (req, res) => {
  const verify_token = "TU_TOKEN_SECRETO_QUE_INVENTES"; 
  
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// RUTA 2: RECEPCIÓN DE MENSAJES (Aquí ocurre la magia)
app.post("/webhook", async (req, res) => {
  let body = req.body;

  // Verificamos que sea un evento de WhatsApp
  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      // 1. Extraemos datos clave
      let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body.entry[0].changes[0].value.messages[0].from; // Quién escribe
      let msg_body = body.entry[0].changes[0].value.messages[0].text.body; // Qué dice

      console.log(`Mensaje recibido de ${from} en el canal ${phone_number_id}: ${msg_body}`);

      // 2. LÓGICA MULTI-EMPRESA (Aquí va tu negocio)
      // Buscas en TU base de datos: ¿De quién es este phone_number_id?
      // const empresa = await database.findEmpresa(phone_number_id);
      
      // 3. RESPUESTA AUTOMÁTICA (Ejemplo)
      // await enviarMensaje(empresa.token, from, "Hola, gracias por escribirnos");
    }
    res.sendStatus(200); // IMPORTANTE: Responder 200 OK rápido a Meta
  } else {
    res.sendStatus(404);
  }
});

app.listen(3000, () => console.log("Servidor webhook escuchando en puerto 3000"));