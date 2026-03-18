import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <img
        src="/images/logo-transp.svg"
        alt="Wellness Flow logo"
        className="footer-logo"
      />

      <div className="footer-container">
        <div className="footer-section">
          <h2>Sobre Nosotros</h2>
          <p>Somos un centro de terapias dedicado a brindar bienestar y relajación.</p>
        </div>

        <div className="footer-section">
          <h2>Contacto</h2>
          <p>Email: <a href="mailto:wellssflow@gmail.com">wellssflow@gmail.com</a></p>
          <p>Teléfono: +34 642 32 35 69</p>
        </div>

        <div className="footer-section">
          <h2>Síguenos</h2>
          <div className="social-icons">
            <a 
              href="https://www.facebook.com/profile.php?id=61576035110721" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a 
              href="https://www.instagram.com/wellnessflowitw" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a 
              href="https://wa.me/34642323569" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2024 Mi Empresa de Terapias. Todos los derechos reservados.
      </div>
      <div className="footer-financiacion">
  <img
    src="/images/financiacion.png"
    alt="Cofinanciado por la Unión Europea - Junta de Andalucía"
    className="footer-financiacion-img"
  />
</div>
    </footer>
  );
};

export default Footer;