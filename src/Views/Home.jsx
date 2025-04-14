import  { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Footer from '../Components/Footer';
import { cancelBookedTerapias } from '../Components/BookingFunctions';
import './Home.css';
import DateTimeModal from '../Components/DateTimeModal';
import { API_URL } from './BookingFunctions';
const Home = () => {
  // ESTADOS
  const [open, setOpen] = useState(false);
  const [selectedTerapia, setSelectedTerapia] = useState(null);
  const [terapias, setTerapias] = useState([]);

  // EFECTO para cargar terapias de la BD
  useEffect(() => {
    axios.get(`${API_URL}/terapias`)
      .then(response => {
        console.log("🔍 Terapias recibidas:", response.data);
        setTerapias(response.data);
      })
      .catch(error => console.error("❌ Error al obtener terapias:", error));
  }, []);

  // MANEJADORES DE MODAL
  const handleOpen = (terapia) => {
    setSelectedTerapia(terapia);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTerapia(null);
  };

  // ORDEN PERSONALIZADO DE TERAPIAS
  const desiredOrder = [
    "Quiromasaje",
    "Osteopatía",
    "Entrenamiento personal",
    "Consulta nutricional",
    "Naturopatía",
    "Eventos"
  ];

  // ORDENAR LAS TERAPIAS SEGÚN desiredOrder
  const sortedTherapias = [...terapias].sort((a, b) => {
    return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
  });

  // RENDER
  return (
    <>
      {/* Contenedor con la clase home-container para el fondo difuminado */}
      <Grid container className="home-container" spacing={3}>
        {sortedTherapias.map((terapia) => (
          <Grid item xs={12} sm={6} key={terapia._id}>
            <div className="terapia-section">
              <img
                src={`/images/${
                  terapia.backgroundImage.includes('.')
                    ? terapia.backgroundImage
                    : terapia.backgroundImage + ".jpg"
                }`}
                alt={terapia.name}
                className="background-image"
                onError={(e) => e.target.src = "/images/events.jpeg"}
              />
              <div className="overlay">
                <Typography className="title" variant="h2">
                  {terapia.name}
                </Typography>
                <Typography className="description" variant="body1">
                  {terapia.description || "Descripción no disponible"}
                </Typography>

                {/* Mostrar el tipo de masaje si es Quiromasaje */}
                {terapia.type === "quiromasaje" && terapia.tipoDeMasaje && (
                  <Typography variant="body1">
                    <strong>Tipo de Masaje:</strong> {terapia.tipoDeMasaje}
                  </Typography>
                )}

                {/* Mostrar la zona del cuerpo si es Osteopatía */}
                {terapia.type === "osteopatia" && terapia.zonaDelCuerpo && (
                  <Typography variant="body1">
                    <strong>Zona del Cuerpo a Tratar:</strong> {terapia.zonaDelCuerpo}
                  </Typography>
                )}

                {/* Mostrar comentarios si existen */}
                {terapia.comentarios && terapia.comentarios.length > 0 && (
                  <div>
                    <Typography variant="h6">Comentarios:</Typography>
                    <ul>
                      {terapia.comentarios.map((comentario, index) => (
                        <li key={index}>{comentario}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="actions">
                  <Button variant="contained" onClick={() => handleOpen(terapia)}>
                    {terapia.isBooked ? 'Reservado' : 'Reservar'}
                  </Button>
                  {terapia.isBooked && (
                    <Button variant="contained" onClick={() => cancelBookedTerapias(terapia)}>
                      Cancelar Reserva
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Grid>
        ))}
      </Grid>

      <Footer />

      {/* MODAL PARA FECHA/HORA */}
      <DateTimeModal
        open={open}
        handleClose={handleClose}
        terapia={selectedTerapia} // Se pasa la terapia en singular
      />
    </>
  );
};

export default Home;