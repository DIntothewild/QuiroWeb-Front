import { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Footer from '../Components/Footer';
import { cancelBookedTerapias } from '../Components/BookingFunctions';
import './Home.css';
import DateTimeModal from '../Components/DateTimeModal';
import API_URL from '../Config/apiconfig';

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
  "Entrenamiento personal",
  "Consulta nutricional",
  "Protocolo Embody Lab",
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
      <Grid container className="home-container" spacing={2}>
        {sortedTherapias.map((terapia) => (
          <Grid item xs={12} sm={6} md={6} lg={6} key={terapia._id}>
            <div className="terapia-section">
             <img
  src={`/images/${
    terapia.backgroundImage && terapia.backgroundImage.includes('.')
      ? terapia.backgroundImage.trim()
      : (terapia.backgroundImage || "missing") + ".jpg"
  }`}
  alt={terapia.name}
  className="background-image"
  onError={(e) => {
    console.log("❌ Imagen fallida:", terapia.backgroundImage);
    e.target.src = "/images/events.jpeg";
  }}
/>
              <div className="overlay">
                <Typography className="title" variant="h2" component="h2">
                  {terapia.name}
                </Typography>
                <Typography className="description" variant="body1" component="p">
                  {terapia.description || "Descripción no disponible"}
                </Typography>

                {/* Información adicional específica por tipo */}
                {terapia.type === "quiromasaje" && terapia.tipoDeMasaje && (
                  <Typography variant="body2" style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    marginBottom: '10px',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
                  }}>
                    <strong>Tipo:</strong> {terapia.tipoDeMasaje}
                  </Typography>
                )}

                {terapia.type === "osteopatia" && terapia.zonaDelCuerpo && (
                  <Typography variant="body2" style={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    marginBottom: '10px',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
                  }}>
                    <strong>Zona:</strong> {terapia.zonaDelCuerpo}
                  </Typography>
                )}

                {/* Comentarios si existen */}
                {terapia.comentarios && terapia.comentarios.length > 0 && (
                  <div style={{ marginBottom: '15px' }}>
                    <Typography variant="body2" style={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
                    }}>
                      <strong>Comentarios:</strong>
                    </Typography>
                    <ul style={{ 
                      textAlign: 'left', 
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.9em',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
                    }}>
                      {terapia.comentarios.map((comentario, index) => (
                        <li key={index}>{comentario}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="actions">
                  <Button 
                    variant="contained" 
                    color={terapia.isBooked ? "secondary" : "primary"}
                    onClick={() => handleOpen(terapia)}
                    disabled={terapia.isBooked}
                  >
                    {terapia.isBooked ? 'Reservado' : 'Reservar'}
                  </Button>
                  {terapia.isBooked && (
                    <Button 
                      variant="outlined" 
                      color="error"
                      onClick={() => cancelBookedTerapias(terapia)}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        borderColor: 'rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      Cancelar
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
        terapia={selectedTerapia}
      />
    </>
  );
};

export default Home;