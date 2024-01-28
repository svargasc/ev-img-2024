import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getEventsClientsRequest } from "../api/event";
import axios from "axios";

function EventsClients() {
  useEffect(() => {
    getEvents();
  }, []);

  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:5000/eventsClients")
      .then((res) => setData(res.data[0]))
      .catch((err) => console.log(err));
  }, []);

  const [events, setEvents] = useState([]);
  const getEvents = async () => {
    try {
      const res = await getEventsClientsRequest();
      setEvents(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  const filteredEvents = events.filter(event => event.done !== false && event.done !== 0);
  if (events.length === 0)
    return (
      <h1 className='h-screen bg-cover bg-center bg-[url("https://i.ibb.co/LQf91TG/fondo-EB.webp")] text-7xl text-center'>
        No se han agregado eventos
      </h1>
    );


  return (
    <>
    <div className="h-screen overflow-auto bg-[url('https://i.ibb.co/LQf91TG/fondo-EB.webp')] bg-cover bg-center flex flex-col justify-center items-center">
      <h1 className="h-[10%] text-7xl text-[#FFEEB3]">Eventos</h1>
      <div className="w-full flex h-full justify-center items-center gap-3 flex-wrap">
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            className="bg-[#000000a4] w-1/4 h-2/3 flex flex-col justify-between rounded-2xl text-[#FFEEB3]"
          >
            <img
              className="h-2/4 border-4 m-4 rounded-2xl border-[#AC703E]"
              src={`http://localhost:5000/uploads/`+event.img_event}
              alt=""
            />
            <h2 className="text-center text-2xl">{event.title}</h2>
            <p className="text-center text-xl">{event.address}</p>
            <p className="text-center text-xl">{event.description}</p>
            <p className="text-center text-xl">
              {dayjs(event.dates).utc().format("YYYY/MM/DD")}
            </p>
          </div>
        ))}
      </div>
    </div>
  </>
  );
}

export default EventsClients;
