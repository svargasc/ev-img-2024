import { pool } from "../db/db.js";

export const likeEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const clientId = req.client;

        // Verificar si el cliente ya ha interactuado con el evento
        const [existingInteraction] = await pool.query(
            "SELECT * FROM event_interactions WHERE event_id = ? AND client_id = ?",
            [eventId, clientId]
        );

        if (existingInteraction.length > 0) {
            // Si ya existe una interacción, actualiza el like a 1
            await pool.query("UPDATE event_interactions SET `like` = 1, `dislike` = 0 WHERE event_id = ? AND client_id = ?", [eventId, clientId]);
            return res.json({ message: "Event liked successfully" });
        } else {
            // Inserta la interacción del cliente (like) en la tabla event_interactions
            await pool.query("INSERT INTO event_interactions (event_id, client_id, `like`, `dislike`) VALUES (?, ?, 1, 0)", [eventId, clientId]);
            return res.json({ message: "Event liked successfully" });
        }
    } catch (error) {
        console.error("Error liking event:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const dislikeEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const clientId = req.client;

        // Verificar si el cliente ya ha interactuado con el evento
        const [existingInteraction] = await pool.query(
            "SELECT * FROM event_interactions WHERE event_id = ? AND client_id = ?",
            [eventId, clientId]
        );

        if (existingInteraction.length > 0) {
            // Si ya existe una interacción, actualiza el dislike a 1
            await pool.query("UPDATE event_interactions SET `like` = 0, `dislike` = 1 WHERE event_id = ? AND client_id = ?", [eventId, clientId]);
            return res.json({ message: "Event disliked successfully" });
        } else {
            // Inserta la interacción del cliente (dislike) en la tabla event_interactions
            await pool.query("INSERT INTO event_interactions (event_id, client_id, `like`, `dislike`) VALUES (?, ?, 0, 1)", [eventId, clientId]);
            return res.json({ message: "Event disliked successfully" });
        }
    } catch (error) {
        console.error("Error disliking event:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getTotalLikesDislikes = async (req, res) => {
    try {
        const eventId = req.params.eventId;

        // Consulta para obtener la suma total de likes y dislikes para el evento dado
        const [totalLikesDislikes] = await pool.query(
            "SELECT SUM(`like`) AS total_likes, SUM(`dislike`) AS total_dislikes FROM event_interactions WHERE event_id = ?",
            [eventId]
        );

        // Extraer los totales de likes y dislikes del resultado de la consulta
        const { total_likes, total_dislikes } = totalLikesDislikes[0];

        // Enviar la respuesta con los totales de likes y dislikes
        return res.json({ total_likes, total_dislikes });
    } catch (error) {
        console.error("Error getting total likes and dislikes:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
