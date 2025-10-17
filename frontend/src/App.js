// App.js - Router chính
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import DataSensors from './pages/DataSensors';
import ActionHistory from './pages/ActionHistory';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="ml-64 flex-1 min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/data" element={<DataSensors />} />
            <Route path="/actions" element={<ActionHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
