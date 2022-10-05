import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { TravelDataProvider } from './context/TravelDataContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<TravelDataProvider>
			<App />
		</TravelDataProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
