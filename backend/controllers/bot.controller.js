import { GoogleGenerativeAI } from '@google/generative-ai'


const API_KEY_GEMINI = "AIzaSyBC2HGD0k0nn3ElSvHd01iI6wdnz8Ri_mM";
const genAI = new GoogleGenerativeAI(API_KEY_GEMINI)
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//Config
const GENERATION_CONFIG = {
    stopSequences: ["red"],
    maxOutputTokens: 1000,
    temperature: 0.9,
    topP: 0.1,
    topK: 16,
};

    const START_CHAT = [
    {
        role: "user",
        parts: `Nombre de la Empresa: EventsBrews
  
        Fecha de Creación: EventsBrews fue desarrollado desde 2023 al 2024 por unos estudiantes de desarrollo de software en el Sena.
        
        Descripción General:
        Los cafés y bares se han convertido en espacios vibrantes 
        que albergan una amplia gama de eventos, desde actuaciones en vivo y exposiciones artísticas hasta noches temáticas y charlas educativas. Sin embargo, a menudo, 
        las personas no tienen acceso fácil a información actualizada sobre estos eventos o pueden perderse oportunidades únicas debido a la falta de visibilidad.
        EventsBrew es una aplicación innovadora diseñada para transformar la experiencia de los clientes 
        en cafés y bares, proporcionando un método efectivo para mantener a las personas informadas sobre los eventos y actividades que se llevan a cabo en estos lugares.
        
        Qué puedo hacer en EvenstBrews:
        En EvenstBrews puedes hacer lo siguiente:
        Registro de Usuarios: 
        Permite a los usuarios crear cuentas con información de perfil.
        Iniciar Sesión: 
        Los usuarios pueden iniciar sesión en sus cuentas de forma segura.
        Exploración de Eventos: 
        Los usuarios pueden navegar y buscar eventos.
        Detalles de Eventos: 
        Los usuarios pueden ver información detallada sobre eventos, incluyendo título, descripción, fecha, hora, ubicación, precio y más.
        Comentarios y Calificaciones: 
        Los usuarios pueden dejar comentarios y calificaciones sobre eventos y establecimientos.
        Edición de Perfil: 
        Los usuarios pueden editar su información de perfil, incluyendo nombre, foto de perfil, etc.
        Seguridad de Datos: 
        Se implementan medidas de seguridad para proteger la información del usuario.
        Administración de Eventos: 
        Los organizadores pueden crear y administrar eventos a través de una interfaz de administración.
        Documentación y Ayuda: Se proporciona información de ayuda y documentación para guiar a los usuarios.

        Como puedo agregar mis eventos:
        Para agregar eventos de tu empresa o establecimiento, primero debes ir al final del aplicativo y 
        llenar el formulario de contacto, luego de ello te contactaras con nosotros (EventsBrews) y te diremos 
        como podras tener el acceso para poder crear y añadir tus propios eventos!

        Como puedo registrarme:
        Para registrarte debes ir primero al boton registrar en la parte superior de la derecha, dar click 
        y esto te redireccionara a un formulario, el cual debes llenar. Seguido de esto podras acceder al formulario 
        de inicio se sesión y tendras acceso a los comentarios!
        `,
    },
    {
        role: "model",
        parts: "Hola!",
    }
]

//route
export const chat = async (req, res) => {
    let history = req.body.history;
    let question = req.body.question;
    let historyChat = START_CHAT.concat(history)
    const chat = model.startChat({
        history: historyChat,
        generationConfig: GENERATION_CONFIG
    });
    const sendQuestion = await chat.sendMessage(question);
    const response = await sendQuestion.response;
    const text = response.text();
    history.push({ role: "user", parts: question })
    history.push({ role: "model", parts: text })
    return res.status(200).json({ history: history });
}