
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import Home from './Views/Home.jsx';
import './App.css';
import BookingComponent from './Components/BookingComponent.jsx';

function App() {
  console.log("✅ App.js está renderizando"); // Verifica si esto aparece en la consola

  return (
    <Router>
      <div className="App">
         <header className="App-header">
          <img src="/images/wellness-logo.png" alt="Wellness Flow logo" className="logo" />
     <div className="header-text">
          <h1>WELLNESS FLOW</h1>
          <p>En construccion (coming soon)</p>
           <p>Un enfoque en el cuidado natural y el equilibrio personal.</p> 
          <h2>Booking site</h2>
          </div>
        </header> 
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<BookingComponent />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
