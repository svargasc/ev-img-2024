import { GoogleGenerativeAI } from "@google/generative-ai";
import { pool } from "../db/db.js";

const API_KEY_GEMINI = "AIzaSyBC2HGD0k0nn3ElSvHd01iI6wdnz8Ri_mM";
const genAI = new GoogleGenerativeAI(API_KEY_GEMINI);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//Config
const GENERATION_CONFIG = {
  stopSequences: ["red"],
  maxOutputTokens: 1000,
  temperature: 0.2,
  topP: 0.1,
  topK: 16,
};
const fechaActual = new Date();
console.log(fechaActual);
// Obtener el día, mes y año
const dia = fechaActual.getDate();
const mes = fechaActual.getMonth() + 1; // Los meses van de 0 a 11, por eso se suma 1
const año = fechaActual.getFullYear();

// Formatear la fecha como string
const fechaFormateada = `${año}-${mes < 10 ? "0" + mes : mes}-${
  dia < 10 ? "0" + dia : dia
}`;

const getEvents = async () => {
  try {
    const [result] = await pool.query(
      "SELECT * FROM events WHERE done = 1 ORDER BY dates ASC"
    );
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const createChatParts = async () => {
  const events = await getEvents();
  let eventInfo = "";
  events.forEach((event, index) => {
    eventInfo += `Evento ${index + 1}:\n`;
    eventInfo += `Título del evento: ${event.title}\n`;
    eventInfo += `Descripción del evento: ${event.description}\n`;
    eventInfo += `Fecha del evento: ${event.dates}\n`;
    eventInfo += `Dirección del evento: ${event.address}\n\n`;
    //   console.log(eventInfo);
  });

  return `Nombre de la Empresa: EventsBrews
  
    Solo responde preguntas acerca o sobre EventsBrews. Si hay preguntas que no tiene que ver con EventsBrews. Responde: No estoy autorizado para responder esas preguntas!.
          
    Hola: Hola, como puedo ayudarte hoy?.

    Informacion de los eventos disponibles: ${eventInfo}.
  
    Fecha o día de hoy: ${fechaFormateada}.
  
    Fecha de Creación: EventsBrews fue desarrollado desde 2023 al 2024 por unos estudiantes de desarrollo de software en el Sena.

    Quienes lo crearon: Juan Guillermo Pantoja Castro, Sergio Díaz Castro y Sergio Vargas Castañeda.
          
    Descripción General:
    EventsBrew es una plataforma donde podras encontrar eventos que se realizan en los cafés, 
    bares o restaurantes, en EventsBrew podras encontrar su información completa como lo es. El nombre, 
    la descripción, su fecha y su dirección. Navega y no te pierdas de ninguno!.
          
    Qué puedo hacer en EvenstBrews:
    En EvenstBrew puedes hacer lo siguiente:
    Podras registrarte, para poder agregar comentarios a los eventos y asi dar tu opinión de estos, podras visualizar y buscarlos.
          
    Seguridad de Datos: 
    Se implementan medidas de seguridad para proteger la información del usuario.
  
    Como puedo agregar mis eventos:
    Para agregar eventos de tu empresa o establecimiento, primero debes ir al final del aplicativo y 
    llenar el formulario de contacto, luego de ello te contactaras con nosotros (EventsBrew) y te diremos 
    como podras tener el acceso para poder crear y añadir tus propios eventos!.
  
    Como puedo registrarme:
    Para registrarte debes ir primero al boton registrar en la parte superior de la derecha, dar clic
    y esto te redireccionara a un formulario, el cual debes llenar. Seguido de esto podras acceder al formulario 
    de inicio se sesión y tendras acceso a los comentarios!.
    `;
};

const START_CHAT = async () => {
  const chatParts = await createChatParts();
  return [
    {
      role: "user",
      parts: chatParts,
    },
    {
      role: "model",
      parts: "Hola!",
    },
  ];
};

//route
export const chat = async (req, res) => {
  try {
    let history = req.body.history;
    let question = req.body.question;
    let historyChat = await START_CHAT();
    const chat = model.startChat({
      history: historyChat.concat(history),
      generationConfig: GENERATION_CONFIG,
    });
    const sendQuestion = await chat.sendMessage(question);
    const response = await sendQuestion.response;
    const text = response.text();
    history.push({ role: "user", parts: question });
    history.push({ role: "model", parts: text });
    return res.status(200).json({ history: history });
  } catch (error) {
    console.log("nooo ", error);
  }
};

