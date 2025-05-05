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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { bookTerapias, fetchReservedTimes } from './BookingFunctions';
import PropTypes from 'prop-types';
import { CircularProgress } from '@mui/material';


const availableTimes = [
  '08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00'
];

const DateTimeModal = ({ open, handleClose, terapia }) => {
  // ESTADOS PRINCIPALES
  const [selectedDate, setSelectedDate] = useState(null);
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
    // OJO: Quitamos 'open' de la condición, para que aunque open sea false,
    // podamos recargar la fecha si hace falta

    const dateKey = selectedDate.format("YYYY-MM-DD");
    fetchReservedTimes(dateKey, terapia.name)
      .then((bookedHours) => {
        setReservedTimes(prev => ({
          ...prev,
          [dateKey]: bookedHours
        }));
      })
      .catch((err) => console.error(err));
  }, [terapia, selectedDate]);

  // MANEJADOR DE FECHA
  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    setSelectedTime(availableTimes[0]);
  };

  // CONFIRMAR RESERVA
  // Inside your DateTimeModal.jsx

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
    setIsSubmitting(true); // 🔄 Activar spinner

    if (!terapia || !selectedDate) return;

    const formattedDate = selectedDate.format('YYYY-MM-DD');
    const dateTime = `${formattedDate} ${selectedTime}`;

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

    // Validate phone number
    const phoneRegex = /^\+?[0-9\s-]{9,15}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      throw new Error("Invalid phone number format.");
    }

    // Optimistic update
    setReservedTimes(prev => {
      const currentTimes = prev[formattedDate] || [];
      if (!currentTimes.includes(selectedTime)) {
        console.log("⏳ Blocking time locally:", selectedTime);
        return {
          ...prev,
          [formattedDate]: [...currentTimes, selectedTime],
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
    await updateReservedTimes(formattedDate, terapia.name);

    setConfirmationMessage(`${name}, your booking was successful for ${dateTime}`);

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
      const formattedDate = selectedDate.format('YYYY-MM-DD');
      await updateReservedTimes(formattedDate, terapia.name);
    }

    setConfirmationMessage(`Error creating booking: ${error.message}`);
    setConfirmationModalOpen(true);
  } finally {
    setIsSubmitting(false); // ✅ Desactivar spinner al final pase lo que pase
  }
};
  // Filtra horas según reservedTimes
  const filteredTimes = selectedDate
    ? availableTimes.filter(
        time => !(reservedTimes[selectedDate.format('YYYY-MM-DD')] || []).includes(time)
      )
    : availableTimes;

  // RENDER DEL MODAL PRINCIPAL
  // Notamos que *aunque open sea false*, se sigue renderizando
  // para que el modal de confirmación funcione.
  // Pero el <Modal> principal usa open={open}, así que no se ve cuando open=false.
  return (
    <>
      {/* MODAL PRINCIPAL */}
      <Modal
        open={open} // se ve solo si open=true
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginTop: '10%',
          zIndex: 99999
        }}
      >
       <Box
    sx={{
      background: 'linear-gradient(to bottom right, #13547a, #80d0c7)',
      borderRadius: '20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      maxWidth: '450px',
      width: '90%',
      maxHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}
  >
    {/* Contenido con scroll */}
    <Box
      sx={{
        overflowY: 'auto',
        padding: '30px 25px',
        flexGrow: 1,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: 600, color: '#004D40', mb: 2 }}
      >
        Reserva tu sesión de {terapia?.name}
      </Typography>

          <Typography variant="h6">Nombre</Typography>
          <TextField
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Typography variant="h6" sx={{ mt: 2 }}>Correo electrónico (opcional)</Typography>
          <TextField
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
           fullWidth
          />
          <Typography variant="h6" sx={{ mt: 2 }}>Teléfono {/* (solo lo usaremos en caso de necesidad o cancelación) */}</Typography>
          <TextField
          placeholder="Ej: 612345678"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          fullWidth
          />
          {/* Campos específicos */}
          {terapia && terapia.name === "Quiromasaje" && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>Tipo de masaje</Typography>
              <Select
                value={tipoMasaje}
                onChange={(e) => setTipoMasaje(e.target.value)}
                fullWidth
                MenuProps={{
                  sx: { zIndex: 999999 },
                  disablePortal: true
                }}
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
              />
              
              <Typography variant="h6" sx={{ mt: 2 }}>Comentarios</Typography>
              <TextField
                multiline
                rows={3}
                value={osteoComentario}
                onChange={(e) => setosteoComentario(e.target.value)}
                fullWidth
              />
            </>
          )}

          <Typography variant="h6" sx={{ mt: 2 }}>
            Selecciona Fecha
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              disablePortal
              label="Fecha"
              value={selectedDate}
              onChange={handleDateChange}
              slotProps={{
                popper: {
                  sx: { zIndex: 999999 }
                }
              }}
              slots={{
                textField: (params) => <TextField {...params} fullWidth />
              }}
            />
          </LocalizationProvider>

          <Typography variant="h6" sx={{ mt: 2 }}>
            Selecciona Hora
          </Typography>
          <Select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            fullWidth
            MenuProps={{
              sx: { zIndex: 999999 },
              disablePortal: true
            }}
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
  sx={{ mt: 2, mb: 2 }}
>
  {isSubmitting ? (
    <CircularProgress size={24} color="inherit" />
  ) : (
    'Reservar'
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
          marginTop: '10%',
          zIndex: 99999
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(to bottom right, #e0f7fa, #ffffff)',
            borderRadius: '20px',
            padding: '30px 25px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
        <Typography variant="h6" sx={{ fontWeight: 500, color: '#004D40' }}>
          {confirmationMessage}
        </Typography>

          <Button
            onClick={() => setConfirmationModalOpen(false)}
            variant="contained"
            sx={{
              backgroundColor: '#00796B',
              '&:hover': { backgroundColor: '#004D40' },
              alignSelf: 'center'
            }}
          >
            Cerrar
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default DateTimeModal;