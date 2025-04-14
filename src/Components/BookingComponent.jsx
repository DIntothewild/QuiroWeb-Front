import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { cancelBookedTerapias, availabilityTerapias, API_URL } from "./BookingFunctions";
import DateTimeModal from "./DateTimeModal";
import "../App.css";

console.log("API_URL en BookingComponent:", API_URL);

const BookingComponent = ({ terapias }) => {
  const [selectedTerapia, setSelectedTerapia] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleBooking = (type) => {
    const terapiaDisponible = availabilityTerapias(terapias, type);
    if (terapiaDisponible) {
      setSelectedTerapia(terapiaDisponible);
      setModalOpen(true);
      setErrorMessage("");
    } else {
      setErrorMessage(`No hay terapias de tipo ${type} disponibles.`);
    }
  };

  const handleCancel = async (terapia) => {
    try {
      await axios.delete(`${API_URL}/bookings/${terapia._id}`);
      cancelBookedTerapias(terapia);
    } catch (error) {
      console.error("Error al cancelar el terapia:", error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTerapia(null);
  };

  return (
    <div>
      <h2>Gestionar Reservas</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {terapias.map((t) => (
        <div key={t._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <p><strong>{t.name}</strong></p>
          {t.type === "quiromasaje" && t.tipoDeMasaje && (
            <p><strong>Tipo de Masaje:</strong> {t.tipoDeMasaje}</p>
          )}
          {t.type === "osteopatia" && t.zonaDelCuerpo && (
            <p><strong>Zona del Cuerpo:</strong> {t.zonaDelCuerpo}</p>
          )}
          <button onClick={() => handleBooking(t.type)}>Reservar</button>
          {t.isBooked && (
            <button onClick={() => handleCancel(t)}>Cancelar</button>
          )}
        </div>
      ))}

      {/* Modal para reservar */}
      <DateTimeModal
        open={modalOpen}
        handleClose={handleCloseModal}
        terapia={selectedTerapia}
      />
    </div>
  );
};

BookingComponent.propTypes = {
  terapias: PropTypes.array.isRequired,
};

export default BookingComponent;