import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { store } from './redux/store';
import App from './components/app/App';
import './styles/index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <Router>
        <Provider store={store}>
            <App />
        </Provider>
    </Router>
);
