import { MapContainer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { europeData } from '../../Data/europeData.js';
import { useState, useEffect } from 'react';
import { TravelDataContext } from '../../context/TravelDataContext.js';
import { useContext } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Map.css';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import plane2 from '../../assets/plane2.png';
import { getJSON } from '../../utilities/getJSON.js';

export default function Map({ flightData, setFlightData }) {
	const { flightDataCollection, dispatch } = useContext(TravelDataContext);
	const [destination, setDestination] = useState(null);
	const [isPending, setIsPending] = useState(false);

	console.log('STATE IN MAP:', flightDataCollection);
	const from = flightDataCollection.from;
	const to = flightDataCollection.to;
	const origin = flightDataCollection.airport.airportCode;

	let DefaultIcon = L.icon({
		iconUrl: plane2,
		shadowUrl: iconShadow,
		iconSize: [61, 71], // size of the icon
		iconAnchor: [30, 50], // point of the icon which will correspond to marker's location
		popupAnchor: [0, -71], // point from which the popup should open relative to the iconAnchor
	});

	const iataMap = {
		ITA: 'FCO',
		FIN: 'HEL',
	};

	L.Marker.prototype.options.icon = DefaultIcon;

	console.log(destination);
	console.log('FLIGHT DATA:', flightData);

	useEffect(() => {
		if (destination) {
			fetchRoute();
		}
		async function fetchRoute() {
			setIsPending(true);
			console.log('DESTINATION:', destination);

			const data = await getJSON(
				`     http://localhost:4000/v1/flights/flight?origin=${origin}&destination=${destination.iata}&from=${from}&to=${to}`
			);

			console.log('THE MOST IMPORTANT DATA', data);

			const flightData = data.map((flight) => {
				return {
					price: flight.price,
					total: flight.price,
					provider: flight.provider,
					url: `https://www.kayak.co.uk/flights/${origin}-${destination.iata}/${from}/${to}?sort=price_a&fs=stops=0`,
				};
			});
			setIsPending(false);
			console.log('FLIGHT DATA:', flightData);
			dispatch({ type: 'COUNTRY_FOUND', payload: flightData });
		}
	}, [destination]);

	async function chooseCountry(event) {
		console.log(event);
		console.log(event.target.feature.properties.iso_a2);
		event.target.setStyle({
			color: 'green',
			fillOpacity: 1,
		});
		setDestination({
			country_a2: event.target.feature.properties.iso_a2,
			countryName: event.target.feature.properties.admin,
			iata: event.target.feature.iata,
		});
	}
	function onEachCountry(country, layer) {
		console.log('COUNTRY:', country.properties.adm0_a3);
		const currentCheapestFlight = flightData.filter((flight) => {
			if (country.properties.iso_a2 === flight.arrivalCountry) return true;
		});
		console.log('CurrCheapFLight:', currentCheapestFlight[0]);
		country.category = currentCheapestFlight[0]?.category;
		// this is where need to give all IATA
		country.iata =
			currentCheapestFlight[0]?.iata || iataMap[country.properties.adm0_a3];
		const countryName = country.properties.admin;
		layer.bindPopup(countryName);
		layer.on({
			click: chooseCountry,
		});
	}

	const countryStyle = (country) => {
		return {
			fillColor: getColor(country.category),
			fillOpacity: 1,
			color: 'black',
			weight: 2,
		};
	};
	function getColor(category) {
		switch (category) {
			case 'cheap':
				return '#39FF14';
				break;
			case 'normal':
				return '#1e71f6';
				break;
			case 'expensive':
				return '#BD0026';
				break;
			default:
				return '#FFEDA0';
		}
	}

	const position = flightDataCollection && [
		flightDataCollection.airport.lat,
		flightDataCollection.airport.lon,
	];
	return (
		<>
			{isPending && (
				<div className='spinnerMap'>
					<Spinner variant='info' animation='grow' />
				</div>
			)}
			<MapContainer
				style={{ height: 'calc(100vh - 5rem) ' }}
				id={'mapbox/light-v9'}
				center={[53.988337, 13.861923]}
				zoom={3.7}
			>
				{flightDataCollection && (
					<Marker position={position}>
						<Popup>
							A pretty CSS3 popup. <br /> Easily customizable.
						</Popup>
					</Marker>
				)}

				<GeoJSON
					style={countryStyle}
					data={europeData.features}
					onEachFeature={onEachCountry}
				/>
			</MapContainer>
		</>
	);
}

{
	/* <TileLayer
attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
    <Marker position={[51.505, -0.09]}>
        <Popup>
  A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
    </Marker>  */
}
