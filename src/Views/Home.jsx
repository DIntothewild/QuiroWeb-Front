import { useState, useEffect } from 'react';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
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
    "Osteopatía",
    "Entrenamiento personal",
    "Consulta nutricional",
    "Naturopatía",
    "Eventos"
  ];

  // ICONOS PARA CADA TERAPIA
  const terapiaIcons = {
    "Quiromasaje": "💆‍♀️",
    "Osteopatía": "🦴",
    "Entrenamiento personal": "💪",
    "Consulta nutricional": "🥗",
    "Naturopatía": "🌿",
    "Eventos": "🎯"
  };

  // ORDENAR LAS TERAPIAS SEGÚN desiredOrder
  const sortedTherapias = [...terapias].sort((a, b) => {
    return desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name);
  });

  // RENDER
  return (
    <>
      {/* Contenedor con la clase home-container para el fondo difuminado */}
      <Grid container className="home-container" spacing={1}>
        {sortedTherapias.map((terapia, index) => (
          <Grid item xs={12} key={terapia._id}>
            <div 
              className="terapia-section"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                opacity: 0,
                animation: `slideInUp 0.6s ease-out ${index * 0.1}s forwards`
              }}
            >
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
                {/* Icono decorativo */}
                <div style={{ 
                  fontSize: '2.5rem', 
                  marginBottom: '10px',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
                }}>
                  {terapiaIcons[terapia.name] || "✨"}
                </div>
                
                <Typography className="title" variant="h2" component="h2">
                  {terapia.name}
                </Typography>
                
                <Typography className="description" variant="body1" component="p">
                  {terapia.description || "Descripción no disponible"}
                </Typography>

                {/* Información adicional con chips atractivos */}
                <div style={{ marginBottom: '15px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                  {terapia.type === "quiromasaje" && terapia.tipoDeMasaje && (
                    <span className="info-chip">
                      🔥 {terapia.tipoDeMasaje}
                    </span>
                  )}

                  {terapia.type === "osteopatia" && terapia.zonaDelCuerpo && (
                    <span className="info-chip">
                      🎯 {terapia.zonaDelCuerpo}
                    </span>
                  )}
                </div>

                {/* Comentarios con mejor presentación */}
                {terapia.comentarios && terapia.comentarios.length > 0 && (
                  <div style={{ 
                    marginBottom: '15px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '15px',
                    padding: '10px',
                    backdropFilter: 'blur(5px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <Typography variant="body2" style={{ 
                      color: 'rgba(255, 255, 255, 0.9)',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
                      fontWeight: 'bold',
                      marginBottom: '8px'
                    }}>
                      💬 Comentarios:
                    </Typography>
                    <div style={{ 
                      textAlign: 'left', 
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontSize: '0.9em',
                      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)'
                    }}>
                      {terapia.comentarios.map((comentario, index) => (
                        <div key={index} style={{ 
                          margin: '5px 0',
                          paddingLeft: '15px',
                          position: 'relative'
                        }}>
                          <span style={{ 
                            position: 'absolute',
                            left: '0',
                            color: '#4ecdc4'
                          }}>•</span>
                          {comentario}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="actions">
                  <Button 
                    variant="contained" 
                    onClick={() => handleOpen(terapia)}
                    disabled={terapia.isBooked}
                    style={{
                      background: terapia.isBooked 
                        ? 'linear-gradient(45deg, #757575, #9e9e9e)' 
                        : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {terapia.isBooked ? '✓ Reservado' : '🚀 Reservar Ahora'}
                  </Button>
                  
                  {terapia.isBooked && (
                    <Button 
                      variant="outlined" 
                      onClick={() => cancelBookedTerapias(terapia)}
                      style={{
                        background: 'rgba(255, 82, 82, 0.2)',
                        color: 'white',
                        borderColor: 'rgba(255, 82, 82, 0.5)',
                        backdropFilter: 'blur(5px)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = 'rgba(255, 82, 82, 0.4)';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'rgba(255, 82, 82, 0.2)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      ❌ Cancelar
                    </Button>
                  )}
                </div>

                {/* Badge de estado */}
                {terapia.isBooked && (
                  <div style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    background: 'linear-gradient(45deg, #ff4757, #ff6b6b)',
                    color: 'white',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    animation: 'pulse 2s infinite'
                  }}>
                    🔥 RESERVADO
                  </div>
                )}
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