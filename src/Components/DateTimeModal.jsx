import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { bookTerapias, fetchReservedTimes } from './BookingFunctions';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';
import dayjs from 'dayjs';

const availableTimes = [
  '08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00'
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

  DateTimeModal.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    terapia: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  };
  
  // Estructura: { "YYYY-MM-DD": ["08:00", "09:00"] }
  const [reservedTimes, setReservedTimes] = useState({});
  // Quiromasaje
  const [tipoMasaje, setTipoMasaje] = useState('relajante');
  const [comentario, setComentario] = useState('');

  // Osteopatía
  const [zonaTratar, setZonaTratar] = useState("");
  const [osteoComentario, setosteoComentario] = useState(""); 

  // Entrenamiento personal
  const [perderPeso, setPerderPeso] = useState(false);
  const [ganarMusculo, setGanarMusculo] = useState(false);
  const [ponermeEnForma, setPonermeEnForma] = useState(false);
  const [recuperarmeLesion, setRecuperarmeLesion] = useState(false);
  const [comentarioEntrenamiento, setComentarioEntrenamiento] = useState('');

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
      } else if (terapia.name === "Osteopatía") {
        extra = { zonaTratar, osteoComentario };
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
      setosteoComentario('');
      setZonaTratar('');

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
          marginTop: { xs: '5%', sm: '10%' },
          zIndex: 99999
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
            
            <Typography variant="h6" sx={{ mt: 2 }}>Correo electrónico (opcional)</Typography>
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

            {/* Campos específicos */}
            {terapia && terapia.name === "Quiromasaje" && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>Tipo de masaje</Typography>
                <Select
                  value={tipoMasaje}
                  onChange={(e) => setTipoMasaje(e.target.value)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="relajante">Relajante</MenuItem>
                  <MenuItem value="lesiones">Lesiones</MenuItem>
                  <MenuItem value="espalda">Espalda</MenuItem>
                  <MenuItem value="piernas">Piernas</MenuItem>
                  <MenuItem value="otra">Otra parte del cuerpo</MenuItem>
                </Select>

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

            {terapia && terapia.name === "Osteopatía" && (
              <>
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Zona a tratar
                </Typography>
                <TextField
                  placeholder="Ej: Cervical, lumbar..."
                  value={zonaTratar}
                  onChange={(e) => setZonaTratar(e.target.value)}
                  fullWidth
                  size="small"
                />
                
                <Typography variant="h6" sx={{ mt: 2 }}>Comentarios</Typography>
                <TextField
                  multiline
                  rows={3}
                  value={osteoComentario}
                  onChange={(e) => setosteoComentario(e.target.value)}
                  fullWidth
                  size="small"
                />
              </>
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
            <Select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              fullWidth
              size="small"
            >
              {filteredTimes.map(time => (
                <MenuItem key={time} value={time}>{time}</MenuItem>
              ))}
            </Select>
          </Box>
          
          <Box sx={{ p: 2, pt: 0, borderTop: '1px solid #ccc' }}>
            <Button
              onClick={handleConfirm}
              variant="contained"
              disabled={isSubmitting}
              fullWidth
              sx={{ 
                mt: 1, 
                mb: 1,
                fontSize: { xs: '16px', sm: '14px' }, // Prevent iOS zoom
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'RESERVAR'
              )}
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
    </>
  );
};

export default DateTimeModal;