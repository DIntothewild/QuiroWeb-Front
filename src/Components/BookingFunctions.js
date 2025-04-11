// BookingFunctions.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // ✅ Usamos variable de entorno

// No se toca, salvo que quieras almacenar más campos
export function createTerapias(
  name,
  type,
  description,
  backgroundImage = null,
  precios = null
) {
  return {
    name,
    type,
    description,
    backgroundImage,
    precios,
    isBooked: false,
  };
}

export async function bookTerapias({
  terapia,
  dateTime,
  name,
  extra = {},
  email = "",
  phoneNumber = "",
}) {
  try {
    if (!terapia || !terapia.name) {
      throw new Error(
        "El objeto 'terapia' no está definido o falta el nombre."
      );
    }

    if (!dateTime) {
      throw new Error("No se ha proporcionado dateTime.");
    }

    const requestBody = {
      customerName: name,
      terapiasType: terapia.name,
      dateTime,
      status: "booked",
      email,
      phoneNumber,
      extra,
    };

    console.log("Datos enviados a backend:", requestBody);

    const response = await axios.post(`${API_URL}/bookings`, requestBody);
    console.log("Reserva realizada con éxito:", response.data);
  } catch (error) {
    console.error("Error al reservar el terapia:", error);
  }
}

// Cancelar reserva
export async function cancelBookedTerapias(terapia) {
  if (terapia.isBooked && terapia._id) {
    try {
      await axios.delete(`${API_URL}/bookings/${terapia._id}`);
      terapia.isBooked = false;
      console.log(`El terapia ${terapia.name} ha sido cancelado con éxito`);
    } catch (error) {
      console.error(`Error al cancelar el terapia ${terapia.name}:`, error);
    }
  } else {
    console.log(
      `El terapia ${terapia.name} no está reservado o no tiene un ID válido`
    );
  }
}

// Filtrado (opcional)
export function availabilityTerapias(terapiass, type) {
  return terapiass.find((t) => !t.isBooked && t.type === type) || null;
}

// Filtrado de horas reservadas por fecha y tipo
export async function fetchReservedTimes(date, therapyName) {
  try {
    const url = `${API_URL}/bookings?date=${date}&terapiasType=${encodeURIComponent(
      therapyName
    )}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Error al obtener las horas reservadas");
    }
    const data = await response.json();
    return data.map((booking) => booking.time);
  } catch (error) {
    console.error("Error al obtener las horas reservadas:", error);
    return [];
  }
}
