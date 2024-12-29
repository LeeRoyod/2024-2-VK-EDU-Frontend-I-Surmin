import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import { store } from './app/store';

import { BrowserRouter } from 'react-router-dom';

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter basename="/2024-2-VK-EDU-Frontend-I-Surmin">
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
