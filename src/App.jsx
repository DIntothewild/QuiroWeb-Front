import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Views/Home.jsx';
import './App.css';
import BookingComponent from './Components/BookingComponent.jsx';

function App() {
  console.log("✅ App.js está renderizando"); // Verifica si esto aparece en la consola

  return (
    <Router>
      <div className="App">
         <header className="App-header">
          <h1>TOTEM SALUD (Wellness Flow)</h1>
           <h2>Un enfoque en el cuidado natural y el equilibrio personal.</h2> 
          <h1>Booking site</h1>
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
