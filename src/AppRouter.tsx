import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import ErrorPage from './ErrorPage';
import MiningPage from './pages/MiningPage'; // Импортируйте компонент MiningPage

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<App />} errorElement={<ErrorPage />} />
                <Route path="/mining" element={<MiningPage />} errorElement={<ErrorPage />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
