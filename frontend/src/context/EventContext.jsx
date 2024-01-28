import { createContext, useContext, useState } from "react";
import {
  createEventRequest,
  deleteEventRequest,
  getEventsRequest,
  getEventRequest,
  updateEventRequest,
  toggleEventDoneRequest,
} from "../api/event";

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error("useEvent must be used within a TaskProvider");
  }
  return context;
};

export function TaskProvider({ children }) {
  const [events, setEvents] = useState([]);

  const getEvents = async () => {
    try {
      const res = await getEventsRequest();
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createEvent = async (event) => {
    const res = await createEventRequest(event);
    console.log(res);
  };

  const deleteEvent = async (id) => {
    try {
      const res = await deleteEventRequest(id);
      if (res.status === 204)
        setEvents(events.filter((events) => events.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const getEvent = async (id) => {
    try {
      const res = await getEventRequest(id);
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const updateEvent = async (id, event) => {
    try {
      await updateEventRequest(id, event);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleEventDone = async (id) => {
    try {
      const eventFound = events.find((event) => event.id === id);
      await toggleEventDoneRequest(id, eventFound.done === 0 ? true : false);
      setEvents(
        events.map((event) =>
          event.id === id ? { ...event, done: !event.done } : event
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        createEvent,
        deleteEvent,
        getEvents,
        getEvent,
        updateEvent,
        toggleEventDone,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}
