import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { bookTerapias, fetchReservedTimes } from './BookingFunctions';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';
//import dayjs from 'dayjs';

const availableTimes = [
  '08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00'
];

const embodylabRituales = [
  {
    key: "pazTotal",
    nombre: "Paz Total",
    resumen: "Ansiedad, calma profunda y sueño reparador",
    descripcionLarga: "Ritual enfocado en la relajación del sistema nervioso, favoreciendo un descanso profundo, liberación de tensiones emocionales y mejora del sueño.",
    beneficios: "Reducción de ansiedad, mejora del sueño, calma profunda.",
    duracion: "90 minutos",
    precio: "75€"
  },
  {
    key: "serenidadProfunda",
    nombre: "Serenidad Profunda",
    resumen: "Antiestrés, relajación meditativa",
    descripcionLarga: "Ritual meditativo que combina técnicas manuales con aromaterapia para inducir un estado de serenidad y bienestar general.",
    beneficios: "Relajación mental, reducción de estrés, conexión interior.",
    duracion: "75 minutos",
    precio: "70€"
  },
  {
    key: "relax",
    nombre: "Relax",
    resumen: "Relajación general, descanso mental",
    descripcionLarga: "Diseñado para quienes buscan un momento de desconexión total, este ritual proporciona un descanso físico y mental profundo.",
    beneficios: "Desconexión, descanso mental, relajación física.",
    duracion: "60 minutos",
    precio: "60€"
  },
  {
    key: "oasisEnCalma",
    nombre: "Oasis en Calma",
    resumen: "Estrés físico y mental, descanso profundo",
    descripcionLarga: "Este ritual combate el agotamiento físico y mental mediante técnicas integrativas que regeneran cuerpo y mente.",
    beneficios: "Alivio del agotamiento, descanso profundo, revitalización.",
    duracion: "90 minutos",
    precio: "75€"
  },
  {
    key: "equilibrioSereno",
    nombre: "Equilibrio Sereno",
    resumen: "Sistema nervioso, reducción del estrés",
    descripcionLarga: "Ritual creado para restaurar el equilibrio del sistema nervioso autónomo, ideal para personas con ritmos acelerados.",
    beneficios: "Regulación del sistema nervioso, serenidad interior.",
    duracion: "75 minutos",
    precio: "70€"
  },
  {
    key: "energia",
    nombre: "Energía",
    resumen: "Vitalidad, claridad mental, activación",
    descripcionLarga: "Ritual energizante para activar la circulación, estimular el cuerpo y mejorar el enfoque mental.",
    beneficios: "Aumento de energía, activación del cuerpo y la mente.",
    duracion: "60 minutos",
    precio: "65€"
  },
  {
    key: "renovacionTotal",
    nombre: "Renovación Total",
    resumen: "Detox, recuperación y renovación",
    descripcionLarga: "Enfoque integral para eliminar toxinas y revitalizar el cuerpo con técnicas drenantes y tonificantes.",
    beneficios: "Detox físico, renovación celular, ligereza corporal.",
    duracion: "90 minutos",
    precio: "80€"
  },
  {
    key: "detoxPuraEsencia",
    nombre: "Detox de Pura Esencia",
    resumen: "Drenaje linfático y purificación",
    descripcionLarga: "Basado en técnicas suaves de drenaje linfático para favorecer la eliminación de líquidos y toxinas.",
    beneficios: "Drenaje, reducción de hinchazón, purificación interna.",
    duracion: "75 minutos",
    precio: "70€"
  },
  {
    key: "bellezaCorporal",
    nombre: "Belleza Corporal",
    resumen: "Estética holística, tonificación",
    descripcionLarga: "Tratamiento corporal que combina belleza y bienestar con técnicas reafirmantes y aceites naturales.",
    beneficios: "Tonificación, firmeza de la piel, belleza holística.",
    duracion: "75 minutos",
    precio: "70€"
  },
  {
    key: "formaRadiante",
    nombre: "Forma Radiante",
    resumen: "Tonificación corporal y activación sensorial",
    descripcionLarga: "Ritual diseñado para estimular los sentidos y moldear el cuerpo con técnicas dinámicas.",
    beneficios: "Estímulo sensorial, activación y forma corporal.",
    duracion: "60 minutos",
    precio: "65€"
  },
  {
    key: "luzTotal",
    nombre: "Luz Total",
    resumen: "Rejuvenecimiento facial y energía",
    descripcionLarga: "Ritual facial que estimula la regeneración celular, mejora el tono de la piel y aporta luminosidad.",
    beneficios: "Rejuvenecimiento facial, luminosidad, energía.",
    duracion: "60 minutos",
    precio: "60€"
  },
  {
    key: "recargaProfunda",
    nombre: "Recarga Profunda",
    resumen: "Recuperación muscular y energía vital",
    descripcionLarga: "Ritual físico que combina masaje terapéutico con técnicas energéticas para recargar el cuerpo.",
    beneficios: "Recuperación muscular, recarga energética.",
    duracion: "75 minutos",
    precio: "70€"
  },
  {
    key: "alivioMigrañas",
    nombre: "Alivio de Migrañas",
    resumen: "Dolores de cabeza, desbloqueo craneal",
    descripcionLarga: "Técnicas suaves craneales y cervicales para aliviar tensiones y migrañas persistentes.",
    beneficios: "Alivio del dolor, relajación craneal.",
    duracion: "50 minutos",
    precio: "55€"
  },
  {
    key: "calmaClara",
    nombre: "Calma Clara",
    resumen: "Crisis emocional, claridad interior",
    descripcionLarga: "Acompañamiento terapéutico para estados emocionales intensos con enfoque en la contención y claridad.",
    beneficios: "Claridad mental, alivio emocional.",
    duracion: "75 minutos",
    precio: "70€"
  }
];

const DateTimeModal = ({ open, handleClose, terapia }) => {
  // ESTADOS PRINCIPALES
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(availableTimes[0]);
  const [name, setName] = useState('');
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  
  // Estructura: { "YYYY-MM-DD": ["08:00", "09:00"] }
  const [reservedTimes, setReservedTimes] = useState({});
  // Quiromasaje
  const [tipoMasaje, setTipoMasaje] = useState('relajante');
  const [comentario, setComentario] = useState('');


  // Entrenamiento personal
  const [perderPeso, setPerderPeso] = useState(false);
  const [ganarMusculo, setGanarMusculo] = useState(false);
  const [ponermeEnForma, setPonermeEnForma] = useState(false);
  const [recuperarmeLesion, setRecuperarmeLesion] = useState(false);
  const [comentarioEntrenamiento, setComentarioEntrenamiento] = useState('');

  // Embody Lab
  const [openSubModal, setOpenSubModal] = useState(false);
const [selectedRitual, setSelectedRitual] = useState(null);

const handleOpenSubModal = (ritual) => {
  setSelectedRitual(ritual);
  setOpenSubModal(true);
};

const handleCloseSubModal = () => {
  setOpenSubModal(false);
  setSelectedRitual(null);
};
  // useEffect para cargar reservas POR FECHA
  useEffect(() => {
    if (!terapia || !selectedDate) return; 

    fetchReservedTimes(selectedDate, terapia.name)
      .then((bookedHours) => {
        setReservedTimes(prev => ({
          ...prev,
          [selectedDate]: bookedHours
        }));
      })
      .catch((err) => console.error(err));
  }, [terapia, selectedDate]);

  // MANEJADOR DE FECHA - Ahora maneja string directamente
  const handleDateChange = (e) => {
    const dateValue = e.target.value; // formato YYYY-MM-DD
    setSelectedDate(dateValue);
    setSelectedTime(availableTimes[0]);
  };

  const updateReservedTimes = async (date, therapy) => {
    try {
      const refreshedTimes = await fetchReservedTimes(date, therapy);
      setReservedTimes(prev => ({
        ...prev,
        [date]: refreshedTimes,
      }));
      console.log("✅ Updated reserved times:", refreshedTimes);
    } catch (err) {
      console.error("❌ Error updating reserved times:", err);
    }
  };

  // Updated handleConfirm
  const handleConfirm = async () => {
    try {
      // Validaciones iniciales
      if (!selectedDate || !selectedTime) {
        alert("Please select a date and time before proceeding.");
        return;
      }

      // Validate email only if it's provided
      if (email.trim() !== "") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          alert("Please enter a valid email address.");
          return;
        }
      }

      // Validate phone number
      const phoneRegex = /^\+?[0-9\s-]{9,15}$/;
      if (phoneNumber && !phoneRegex.test(phoneNumber)) {
        alert("Please enter a valid phone number.");
        return;
      }

      if (!terapia) {
        alert("Missing therapy selection.");
        return;
      }

      setIsSubmitting(true);

      const dateTime = `${selectedDate} ${selectedTime}`;

      // Extra info depending on therapy type
      let extra = {};
      if (terapia.name === "Quiromasaje") {
        extra = { tipoMasaje, comentario };
      } else if (terapia.name === "Entrenamiento personal") {
        extra = {
          objetivos: {
            perderPeso,
            ganarMusculo,
            ponermeEnForma,
            recuperarmeLesion,
            comentarioEntrenamiento,
          },
        };
      } else if (terapia.name === "Protocolo Embody Lab") {
  if (!selectedRitual) {
    alert("Por favor selecciona una terapia de Embody Lab antes de reservar.");
    setIsSubmitting(false);
    return;
  }
  extra = {
    ritual: selectedRitual.nombre,
    key: selectedRitual.key,
  };

} else if (
  terapia.name === "Consulta nutricional" ||
  terapia.name === "Naturopatía"
) {
  extra = { comentario };
}
  
// Optimistic update
      setReservedTimes(prev => {
        const currentTimes = prev[selectedDate] || [];
        if (!currentTimes.includes(selectedTime)) {
          console.log("⏳ Blocking time locally:", selectedTime);
          return {
            ...prev,
            [selectedDate]: [...currentTimes, selectedTime],
          };
        }
        return prev;
      });

      console.log("📤 Sending booking to backend...");
      await bookTerapias({
        terapia,
        dateTime,
        name,
        email,
        phoneNumber,
        extra,
      });

      console.log("🔄 Refreshing reserved times from backend...");
      await updateReservedTimes(selectedDate, terapia.name);

      setConfirmationMessage(`✅ ¡Hola ${name}! Tu cita ha sido confirmada para el ${selectedDate} a las ${selectedTime}. ¡Gracias por confiar en Wellness Flow!`);

      // Reset form fields
      setName('');
      setPhoneNumber('');
      setSelectedTime(availableTimes[0]);
      setTipoMasaje('relajante');
      setComentario('');
      setPerderPeso(false);
      setGanarMusculo(false);
      setPonermeEnForma(false);
      setRecuperarmeLesion(false);
      setComentarioEntrenamiento('');
      setConfirmationModalOpen(true);
      handleClose();
    } catch (error) {
      console.error("❌ Error creating booking:", error);

      if (terapia && selectedDate) {
        await updateReservedTimes(selectedDate, terapia.name);
      }

      setConfirmationMessage(`Error creating booking: ${error.message}`);
      setConfirmationModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtra horas según reservedTimes
  const filteredTimes = selectedDate
    ? availableTimes.filter(
        time => !(reservedTimes[selectedDate] || []).includes(time)
      )
    : availableTimes;

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {/* MODAL PRINCIPAL */}
      <Modal
        open={open}
        onClose={handleClose}
       sx={{
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  mt: { xs: '5%', sm: '3%' }, // Subido un poco en escritorio
  zIndex: 99999,
  '& .MuiBox-root': {
    borderRadius: { xs: '20px', sm: '20px' } // Fuerza esquinas redondeadas
  }
}}
      >
        <Box
          sx={{
            background: 'linear-gradient(to bottom right, #dcedf2, #f5fcff)',
            borderRadius: '20px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            maxWidth: '450px',
            width: { xs: '95%', sm: '90%' },
            maxHeight: { xs: '90vh', sm: '85vh' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Contenido con scroll */}
          <Box
            sx={{
              overflowY: 'auto',
              padding: { xs: '20px 15px', sm: '30px 25px' },
              flexGrow: 1,
            }}
          >
            <Typography
              variant="h5"
              align="center"
              sx={{ 
                fontWeight: 600, 
                color: '#004D40', 
                mb: 2,
                fontSize: { xs: '1.2rem', sm: '1.5rem' }
              }}
            >
              Reserva tu sesión de {terapia?.name}
            </Typography>
           
            <Typography variant="h6">Nombre</Typography>
            <TextField
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              size="small"
            />
            
            <Typography variant="h6" sx={{ mt: 2 }}>Correo electrónico </Typography>
            <TextField
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              size="small"
            />
            
            <Typography variant="h6" sx={{ mt: 2 }}>Teléfono</Typography>
            <TextField
              placeholder="Ej: 612345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              size="small"
            />
{terapia?.name === "Protocolo Embody Lab" && (
  <>
    <Typography variant="h6" sx={{ mt: 2 }}>
      Selecciona una terapia de Embody Lab
    </Typography>
    <FormGroup>
      {embodylabRituales.map((ritual) => (
        <Box
          key={ritual.key}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
            gap: 1
          }}
        >
          <FormControlLabel
            control={
              <input
                type="radio"
                name="ritual"
                value={ritual.key}
                checked={selectedRitual?.key === ritual.key}
                onChange={() => setSelectedRitual(ritual)}
              />
            }
            label={ritual.nombre}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleOpenSubModal(ritual)}
          >
            Ver detalles
          </Button>
        </Box>
      ))}
    </FormGroup>
  </>
)}
            {/* Campos específicos */}
            {terapia && terapia.name === "Quiromasaje" && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>Tipo de masaje</Typography>
<select
  value={tipoMasaje}
  onChange={(e) => setTipoMasaje(e.target.value)}
  style={{
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginTop: '8px'
  }}
>
  <option value="relajante">Relajante</option>
  <option value="lesiones">Lesiones</option>
  <option value="espalda">Espalda</option>
  <option value="piernas">Piernas</option>
  <option value="otra">Otra parte del cuerpo</option>
</select>

                <Typography variant="h6" sx={{ mt: 2 }}>Comentarios</Typography>
                <TextField
                  multiline
                  rows={3}
                  value={comentario}
                  onChange={(e) => setComentario(e.target.value)}
                  fullWidth
                  size="small"
                />
              </>
            )}

            {terapia && terapia.name === "Entrenamiento personal" && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  ¿Cuál es tu objetivo con el entrenamiento?
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={perderPeso}
                        onChange={(e) => setPerderPeso(e.target.checked)}
                      />
                    }
                    label="Perder peso"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={ganarMusculo}
                        onChange={(e) => setGanarMusculo(e.target.checked)}
                      />
                    }
                    label="Ganar músculo"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={ponermeEnForma}
                        onChange={(e) => setPonermeEnForma(e.target.checked)}
                      />
                    }
                    label="Ponerme en forma"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={recuperarmeLesion}
                        onChange={(e) => setRecuperarmeLesion(e.target.checked)}
                      />
                    }
                    label="Recuperarme de una lesión"
                  />
                </FormGroup>

                <Typography variant="h6" sx={{ mt: 2 }}>
                  Comentarios
                </Typography>
                <TextField
                  multiline
                  rows={3}
                  value={comentarioEntrenamiento}
                  onChange={(e) => setComentarioEntrenamiento(e.target.value)}
                  fullWidth
                  size="small"
                />
              </>
            )}
            {terapia && (
  (terapia.name === "Consulta nutricional" || terapia.name === "Naturopatía") && (
    <>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Comentarios
      </Typography>
     <TextField
  multiline
  rows={3}
  placeholder={
    terapia.name === "Consulta nutricional"
      ? "Cuéntanos qué te preocupa sobre tu dieta..."
      : terapia.name === "Naturopatía"
      ? "¿Qué te gustaría tratar con naturopatía?"
      : ""
  }
  value={comentario}
  onChange={(e) => setComentario(e.target.value)}
  fullWidth
  size="small"
/>
    </>
  )
)}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Selecciona Fecha
            </Typography>
            {/* NATIVE DATE INPUT - Works perfect on mobile */}
            <TextField
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              fullWidth
              size="small"
              inputProps={{
                min: today, // Prevent past dates
                style: {
                  fontSize: '16px', // Prevents zoom on iOS
                }
              }}
              sx={{
                '& input[type="date"]': {
                  fontSize: { xs: '16px', sm: '14px' }, // Prevent iOS zoom
                  WebkitAppearance: 'none',
                  '&::-webkit-calendar-picker-indicator': {
                    cursor: 'pointer',
                  },
                },
              }}
            />

            <Typography variant="h6" sx={{ mt: 2 }}>
  Selecciona Hora
</Typography>
<select
  value={selectedTime}
  onChange={(e) => setSelectedTime(e.target.value)}
  style={{
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginTop: '8px'
  }}
>
  {filteredTimes.map((time) => (
    <option key={time} value={time}>{time}</option>
  ))}
</select>
          </Box>
          
         <Box sx={{ p: 2, pt: 0, borderTop: '1px solid #ccc' }}>

  {/* BOTÓN RESERVAR */}
  <Button
    onClick={handleConfirm}
    variant="contained"
    disabled={isSubmitting}
    fullWidth
    sx={{
      fontSize: { xs: '16px', sm: '14px' },
      marginBottom: '24px'
    }}
  >
    {isSubmitting ? (
      <CircularProgress size={24} color="inherit" />
    ) : (
      'RESERVAR'
    )}
  </Button>
    {/* BOTÓN CANCELAR */}
    <Button
      onClick={() => {
        handleClose();
        setName('');
        setPhoneNumber('');
        setSelectedTime(availableTimes[0]);
        setEmail('');
        setComentario('');
        setComentarioEntrenamiento('');
        setPerderPeso(false);
        setGanarMusculo(false);
        setPonermeEnForma(false);
        setRecuperarmeLesion(false);
        setTipoMasaje('relajante');
        setSelectedRitual(null);
      }}
      variant="outlined"
      fullWidth
      sx={{
        mb: 4,
        color: '#004D40',
         backgroundColor:  '#ef5350',
        borderColor: '#004D40',
       fontSize: { xs: '16px', sm: '14px' },
    '&:hover': {
      backgroundColor: '#e53935', // hover rojo más fuerte
      borderColor: '#e53935',
      color: '#fff', // asegura que el texto sea blanco al hacer hover
        },
      }}
    >
      CANCELAR
    </Button>
    </Box>
</Box>
      </Modal>

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginTop: { xs: '10%', sm: '10%' },
          zIndex: 99999
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(to bottom right, #e0f7fa, #ffffff)',
            borderRadius: '20px',
            padding: { xs: '20px 15px', sm: '30px 25px' },
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            width: { xs: '95%', sm: '90%' },
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 500, 
              color: '#004D40',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            {confirmationMessage}
          </Typography>

          <Button
            onClick={() => setConfirmationModalOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: '#00796B',
              '&:hover': { backgroundColor: '#004D40' },
              alignSelf: 'center',
              fontSize: { xs: '16px', sm: '14px' }, // Prevent iOS zoom
            }}
          >
            CERRAR
          </Button>
        </Box>
      </Modal>
      {openSubModal && selectedRitual && (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 999999,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  }}>
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      padding: '20px',
       overflow: 'hidden',
      maxWidth: '400px',
      width: '100%',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
    }}>
     <Typography variant="h6" sx={{ color: '#004D40', fontWeight: 600, mb: 1 }}>
  {selectedRitual.nombre}
</Typography>

<Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
  {selectedRitual.descripcionLarga}
</Typography>

<Typography variant="body2" sx={{ mb: 1 }}>
  <strong>Beneficios:</strong> {selectedRitual.beneficios}
</Typography>

<Typography variant="body2" sx={{ mb: 1 }}>
  <strong>Duración:</strong> {selectedRitual.duracion}
</Typography>

<Typography variant="body2" sx={{ mb: 1 }}>
  <strong>Precio:</strong> {selectedRitual.precio}
</Typography>
      <Button 
        variant="contained"
        onClick={handleCloseSubModal}
        sx={{ mt: 2 }}
        fullWidth
      >
        Cerrar
      </Button>
    </div>
  </div>
)}
    </>
  );
};

DateTimeModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    terapia: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  };
export default DateTimeModal;