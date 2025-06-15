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

const availableTimes = [
  '08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00'
];

const DateTimeModal = ({ open, handleClose, terapia }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState(availableTimes[0]);
  const [name, setName] = useState('');
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservedTimes, setReservedTimes] = useState({});

  const [tipoMasaje, setTipoMasaje] = useState('relajante');
  const [comentario, setComentario] = useState('');
  const [perderPeso, setPerderPeso] = useState(false);
  const [ganarMusculo, setGanarMusculo] = useState(false);
  const [ponermeEnForma, setPonermeEnForma] = useState(false);
  const [recuperarmeLesion, setRecuperarmeLesion] = useState(false);
  const [comentarioEntrenamiento, setComentarioEntrenamiento] = useState('');
  const [openSubModal, setOpenSubModal] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState(null);

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

  const handleDateChange = (e) => {
    const dateValue = e.target.value;
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
    } catch (err) {
      console.error("Error updating reserved times:", err);
    }
  };

  const handleOpenSubModal = (ritual) => {
    setSelectedRitual(ritual);
    setOpenSubModal(true);
  };

  const handleCloseSubModal = () => {
    setOpenSubModal(false);
    setSelectedRitual(null);
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Selecciona una fecha y hora antes de continuar.");
      return;
    }

    if (email.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Introduce un correo válido.");
        return;
      }
    }

    const phoneRegex = /^\+?[0-9\s-]{9,15}$/;
    if (phoneNumber && !phoneRegex.test(phoneNumber)) {
      alert("Introduce un número válido.");
      return;
    }

    setIsSubmitting(true);
    const dateTime = `${selectedDate} ${selectedTime}`;

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

    try {
      await bookTerapias({
        terapia,
        dateTime,
        name,
        email,
        phoneNumber,
        extra,
      });

      await updateReservedTimes(selectedDate, terapia.name);

      setConfirmationMessage(`✅ ¡Hola ${name}! Tu cita ha sido confirmada para el ${selectedDate} a las ${selectedTime}. ¡Gracias por confiar en Wellness Flow!`);

      setName('');
      setPhoneNumber('');
      setEmail('');
      setSelectedTime(availableTimes[0]);
      setTipoMasaje('relajante');
      setComentario('');
      setPerderPeso(false);
      setGanarMusculo(false);
      setPonermeEnForma(false);
      setRecuperarmeLesion(false);
      setComentarioEntrenamiento('');
      setSelectedRitual(null);

      setConfirmationModalOpen(true);
      handleClose();
    } catch (error) {
      console.error("❌ Error creating booking:", error);
      setConfirmationMessage(`Error al crear la reserva: ${error.message}`);
      setConfirmationModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTimes = selectedDate
    ? availableTimes.filter(time => !(reservedTimes[selectedDate] || []).includes(time))
    : availableTimes;

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {open && (
        <div className="custom-modal-backdrop" onClick={handleClose}>
          <div
            className="custom-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ borderRadius: '20px' }}
          >
            <Box
              sx={{
                overflowY: 'auto',
                padding: { xs: '20px 15px', sm: '30px 25px' },
                flexGrow: 1,
              }}
            >
              {/* ... aquí incluirías todos los campos que ya tienes definidos */}

              <Typography variant="h6" sx={{ mt: 2 }}>
                Selecciona Fecha
              </Typography>
              <TextField
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                fullWidth
                size="small"
                inputProps={{
                  min: today,
                  style: { fontSize: '16px' },
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
                  marginTop: '8px',
                }}
              >
                {filteredTimes.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </Box>

            <Box sx={{ p: 2, pt: 0, borderTop: '1px solid #ccc' }}>
              <Button
                onClick={() => {
                  handleClose();
                  setName('');
                  setPhoneNumber('');
                  setEmail('');
                  setSelectedTime(availableTimes[0]);
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
                sx={{ mb: 1 }}
              >
                CANCELAR
              </Button>
              <Button
                onClick={handleConfirm}
                variant="contained"
                disabled={isSubmitting}
                fullWidth
                sx={{ mt: 1 }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'RESERVAR'}
              </Button>
            </Box>
          </div>
        </div>
      )}

      <Modal
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginTop: { xs: '10%', sm: '10%' },
          zIndex: 99999,
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
            gap: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              color: '#004D40',
              fontSize: { xs: '1rem', sm: '1.25rem' },
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
              fontSize: { xs: '16px', sm: '14px' },
            }}
          >
            CERRAR
          </Button>
        </Box>
      </Modal>

      {openSubModal && selectedRitual && (
        <div
          style={{
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
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '400px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: '#004D40', fontWeight: 600, mb: 1 }}
            >
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
