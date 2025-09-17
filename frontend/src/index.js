import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Correctly import index.css
import App from './app';
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes,Route} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
     <Routes>
        <Route path='/*' element= {<App />} />
     </Routes>
    </BrowserRouter>
  </React.StrictMode>
);