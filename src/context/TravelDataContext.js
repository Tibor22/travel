import { createContext, useReducer } from 'react';

export const TravelDataContext = createContext();

export const travelDataReducer = (state, action) => {
	switch (action.type) {
		case 'SEARCH_READY':
			return { ...state, flightDataCollection: action.payload };
		case 'COUNTRY_FOUND':
			return { ...state, countryDataCollection: action.payload };
		case 'RESET_SEARCH':
			return {};
		default:
			return state;
	}
};

export const TravelDataProvider = ({ children }) => {
	const [state, dispatch] = useReducer(travelDataReducer, {});
	return (
		<TravelDataContext.Provider value={{ ...state, dispatch }}>
			{children}
		</TravelDataContext.Provider>
	);
};
