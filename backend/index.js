import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import clientRoutes from './routes/client.routes.js';
import cors from "cors";
import { PORT } from './config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);

// Configuración manual para las solicitudes OPTIONS
app.options('/upload', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).send();
});

app.put('/upload', (req, res) => {
  // Implementa lógica de actualización aquí
  res.status(200).send('Actualización exitosa');
});

app.use(express.static('public'));
app.use(cookieParser());
app.use(userRoutes);
app.use(clientRoutes);
app.use(eventsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
