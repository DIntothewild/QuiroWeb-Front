
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import Home from './Views/Home.jsx';
import TerapiaDetalle from './Views/TerapiaDetalle.jsx';
import './App.css';
import BookingComponent from './Components/BookingComponent.jsx';

function App() {
  console.log("✅ App.js está renderizando"); // Verifica si esto aparece en la consola

  return (
    <Router>
      <div className="App">
        <header className="App-header">
  <img src="/images/logo-transp.svg" alt="Wellness Flow logo" className="logo" />
  <div className="header-text">
    <h1>WELLNESS FLOW</h1>
    {/* <h2 className="subtitle">En construcción (coming soon)</h2> */}
    <h3 className="tagline">Un enfoque en el cuidado natural y el equilibrio personal.</h3>
    <h2>Booking site</h2>
  </div>
</header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<BookingComponent />} />
            <Route path="/terapias/:type" element={<TerapiaDetalle />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
