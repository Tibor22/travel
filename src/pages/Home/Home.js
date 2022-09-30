import Map from '../../components/map/Map.js';
import { useFetchMultiple } from '../../hooks/useFetchMultiple.js';
import { TravelDataContext } from '../../context/TravelDataContext.js';
import { useContext } from 'react';
import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';
import Country from '../../components/Country/Country.js';
import bike from '../../assets/bike.jpg';
import fly from '../../assets/fly.jpg';
import greece from '../../assets/greece.jpg';
import Main from '../../components/Main/Main.js';

export default function Home() {
	const [flightData, setFlightData] = useState(null);
	const { flightDataCollection, countryDataCollection, dispatch } =
		useContext(TravelDataContext);
	let { data, isPending, error } = useFetchMultiple(flightDataCollection);

	console.log('COUNTRYDATA COLLECTIOON IN HOME:', countryDataCollection);

	useEffect(() => {
		if (flightDataCollection === undefined || !data) return;
		console.log('DATA:', data);
		data = data.map((data) => {
			console.log('DATA IN MAP:', data.data);
			return (data = data.data.map((offer) => {
				console.log('OFFER:', offer);
				return {
					price: offer.price.total,
					arrivalCountry: Object.values(data.dictionaries.locations)[0]
						.countryCode,
					departureCountry: Object.values(data.dictionaries.locations)[1]
						.countryCode,
					iata: offer.itineraries[0].segments[
						offer.itineraries[0].segments.length - 1
					].arrival.iataCode,
				};
			}));
		});
		data = data.flat();
		console.log('NEW DATA:', data);

		async function fetchFLights() {
			const priceSum = data.reduce((sum, currVal) => {
				console.log('SUM:', sum, 'CURRENT PRICE:', +currVal.price);
				return (sum += +currVal.price);
			}, 0);
			console.log('PRICE SUM:', priceSum);
			const avgTravelCost = Math.floor(priceSum / data.length);
			console.log('AVG TRAVEL COST: ', avgTravelCost);
			const newData = data.map((jsonData) => {
				console.log('NEWDATA MAP:', jsonData);
				const cheap = avgTravelCost * 0.8;
				const expensive = avgTravelCost * 1.2;
				if (
					jsonData.arrivalCountry === flightDataCollection.airport.countryCode
				) {
					return { ...jsonData, category: 'origin' };
				}
				if (jsonData.price <= cheap) {
					return { ...jsonData, category: 'cheap' };
				}
				if (jsonData.price >= cheap && jsonData.price <= expensive) {
					return { ...jsonData, category: 'normal' };
				}
				if (jsonData.price >= expensive) {
					return { ...jsonData, category: 'expensive' };
				}
			});
			console.log('BRAND NEW DATA:', newData);
			setFlightData(newData);
		}

		fetchFLights();
	}, [flightDataCollection, data]);

	console.log(flightData);
	return (
		<div>
			{isPending && (
				<div className='spinner'>
					<Spinner variant='info' animation='grow' />
				</div>
			)}
			{!flightData && !isPending && <Main />}
			{countryDataCollection && (
				<Country countryDataCollection={countryDataCollection} />
			)}
			{flightData && (
				<Map flightData={flightData} setFlightData={setFlightData} />
			)}
		</div>
	);
}
