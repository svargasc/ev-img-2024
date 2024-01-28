import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useEvents } from "../context/EventContext";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import axios from "axios";
import Navbar from "../components/Navbar";
dayjs.extend(utc);

function EventsFormPage() {
  const { register, handleSubmit, setValue } = useForm();
  const { createEvent, getEvent, updateEvent } = useEvents();
  const navigate = useNavigate();
  const params = useParams();

  //imagen upload
  const [file, setFile] = useState();
  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!params.id || isNaN(params.id)) {
      console.error("ID del evento no proporcionado o no válido");
      return;
    }

    const formdata = new FormData();
    formdata.append("eventId", params.id);
    formdata.append("image", file);

    axios
      .post("http://localhost:5000/upload", formdata)
      .then((res) => {
        if (res.data.Status === "Success") {
          console.log("Succeeded");
        } else {
          console.log("Failed");
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    async function loadEvent() {
      if (params.id) {
        const event = await getEvent(params.id);
        console.log(event);
        setValue("title", event.title);
        setValue("address", event.address);
        setValue("description", event.description);
        setValue("dates", event.dates);
      }
    }
    loadEvent();
  }, []);

  const onSubmit = handleSubmit((data) => {
    if (params.id) {
      updateEvent(params.id, {
        ...data,
        dates: dayjs.utc(data.dates).format(),
      });
    } else {
      createEvent({
        ...data,
        dates: dayjs.utc(data.dates).format(),
      });
    }
    navigate("/events");
  });

  return (
    <>
    <Navbar></Navbar>
      <div className="h-screen bg-[url('https://i.ibb.co/LQf91TG/fondo-EB.webp')] bg-cover bg-center flex flex-col justify-center items-center">
        <div className="flex justify-around items-center bg-[#0000007c] w-4/5 h-3/4 rounded-2xl border-4 border-[#AC703E]">
          <form
            className="flex flex-col h-full w-1/2 justify-center items-center mx-5"
            onSubmit={onSubmit}
          >
            <label
              className="text-left w-full text-xl text-[#FFEEB3]"
              htmlFor="name"
            >
              Nombre del local:
            </label>
            <input
              className="h-[10%] w-full my-2 pl-2 bg-[#FFEEB3] text-[#AC703E] placeholder:text-[#AC703E] font-bold"
              type="text"
              name="title"
              placeholder="Nombre:"
              {...register("title")}
              autoFocus
            />
            <label
              className="text-left w-full text-xl text-[#FFEEB3]"
              htmlFor="address"
            >
              Dirección:
            </label>
            <input
              className="h-[10%] w-full my-2 pl-2 bg-[#FFEEB3] text-[#AC703E] placeholder:text-[#AC703E]  font-bold"
              type="text"
              name="address"
              placeholder="Direccion:"
              {...register("address")}
            />

            <label
              className="text-left w-full text-xl text-[#FFEEB3]"
              htmlFor="firstDate"
            >
              Fecha:
            </label>

            <input
              className="h-[10%] w-full my-2 pl-2 bg-[#FFEEB3] text-[#AC703E] placeholder:text-[#AC703E] placeholder:pl-2 font-bold"
              type="date"
              name="firstDate"
              {...register("dates")}
            />

            <label
              className="text-left w-full text-xl text-[#FFEEB3]"
              htmlFor="description"
            >
              Descripción del evento:
            </label>
            <textarea
              className=" w-full my-2 bg-[#FFEEB3] text-[#AC703E] placeholder:text-[#AC703E] pl-2 font-bold"
              name="description"
              id=""
              cols=""
              rows="5"
              placeholder="Descripción del evento"
              {...register("description")}
            ></textarea>
            <div className="flex flex-col items-center">
              <input
                onChange={handleFile}
                className="border-4 border-[#AC703E] w-[360px] h-2/5 rounded-full hover:cursor-pointer"
                type="file"
              />
              <button
                onClick={handleUpload}
                onSubmit={onSubmit}
                className="bg-[#FFEEB3] text-[#AC703E] text-xl m-2 font-bold h-12 w-1/3 rounded-full mt-2 hover:bg-[#AC703E] hover:text-[#FFEEB3] duration-300"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default EventsFormPage;
