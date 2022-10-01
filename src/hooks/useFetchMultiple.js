import { useState, useEffect } from 'react';
import { API_KEY } from '../config/config.js';
import { TravelDataContext } from '../context/TravelDataContext.js';
import { useContext } from 'react';
import { getJSON } from '../utilities/getJSON.js';

console.log(API_KEY);

export const useFetchMultiple = (travelData, method = 'GET') => {
	const [data, setData] = useState(null);
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState(null);
	const [options, setOptions] = useState(null);

	const airportArr = ['BUD', 'MAD'];

	const postData = (postData) => {
		setOptions({
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
	};

	useEffect(() => {
		if (travelData === undefined) return;
		// const controller = new AbortController();
		console.log('INSIDE USE EFFECT');

		const from = travelData.from;
		const to = travelData.to;

		console.log(from, to);
		const fetchData = async (fetchOptions) => {
			setIsPending(true);

			try {
				let data = await Promise.all(
					airportArr.map((airport) => {
						console.log(airport);
						return getJSON(
							`     https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${travelData.airport.airportCode}&destinationLocationCode=${airport}&departureDate=2022-11-01&returnDate=2022-11-08&adults=1&nonStop=false&max=1`
						);
					})
					// [
					// getJSON(
					// 	`     https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${travelData.airport.airportCode}&destinationLocationCode=BUD&departureDate=2022-11-01&returnDate=2022-11-08&adults=1&nonStop=false&max=10   `
					// ),

					// ]
				);
				console.log('DATA FROM AMADEUS:', data);
				setIsPending(false);
				setData(data);
				setError(null);
			} catch (err) {
				if (err.name === 'AbortError') {
					console.log('the fetch was aborted');
				} else {
					setIsPending(false);
					setError('Could not fetch the data');
				}
			}
		};
		fetchData();
		// if (method === "GET" && options) {

		// }
		// if (method === "POST" && options) {
		//   fetchData(options);
		// }

		// return () => {
		//   controller.abort();
		// };
	}, [travelData, options, method]);

	return { data, isPending, error, postData };
};
