import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import DateTimeModal from "../Components/DateTimeModal";
import API_URL from "../Config/apiconfig";

export default function TerapiaDetalle() {
  const { type } = useParams();
  const [terapia, setTerapia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/terapias/type/${type}`)
      .then((res) => {
        setTerapia(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar la terapia.");
        setLoading(false);
      });
  }, [type]);

  if (loading) return <p style={{ padding: "2rem" }}>Cargando...</p>;
  if (error) return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;
  if (!terapia) return null;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>

      {/* Cabecera */}
      <h1>{terapia.name}</h1>
      <p style={{ fontSize: "1.1rem", color: "#555" }}>{terapia.description}</p>

      {/* Precio y duración */}
      <div style={{ display: "flex", gap: "2rem", margin: "1rem 0" }}>
        <span><strong>Precio:</strong> {terapia.price}€</span>
        <span><strong>Duración:</strong> {terapia.duration} min</span>
      </div>

      {/* Botón reservar */}
      <button
        onClick={() => setModalOpen(true)}
        style={{
          backgroundColor: "#4caf93",
          color: "white",
          border: "none",
          padding: "0.8rem 2rem",
          fontSize: "1rem",
          borderRadius: "8px",
          cursor: "pointer",
          margin: "1rem 0 2rem",
        }}
      >
        Reservar ahora
      </button>

      {/* Descripción larga */}
      {terapia.descripcionLarga && (
        <section style={{ marginBottom: "2rem" }}>
          <h2>Sobre esta terapia</h2>
          <p style={{ lineHeight: 1.7 }}>{terapia.descripcionLarga}</p>
        </section>
      )}

      {/* Galería */}
      {terapia.galeria && terapia.galeria.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2>Galería</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {terapia.galeria.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`${terapia.name} ${i + 1}`}
                style={{ width: "280px", height: "200px", objectFit: "cover", borderRadius: "8px" }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Bio del profesional */}
      {terapia.profesional?.nombre && (
        <section
          style={{
            background: "#f5f5f5",
            borderRadius: "12px",
            padding: "1.5rem",
            display: "flex",
            gap: "1.5rem",
            alignItems: "flex-start",
          }}
        >
          {terapia.profesional.foto && (
            <img
              src={terapia.profesional.foto}
              alt={terapia.profesional.nombre}
              style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
            />
          )}
          <div>
            <h3 style={{ margin: "0 0 0.5rem" }}>{terapia.profesional.nombre}</h3>
            <p style={{ color: "#555", lineHeight: 1.6 }}>{terapia.profesional.bio}</p>
          </div>
        </section>
      )}

      {/* Modal de reserva */}
      <DateTimeModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        terapia={terapia}
      />
    </div>
  );
}