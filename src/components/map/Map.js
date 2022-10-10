import { MapContainer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { europeData } from '../../Data/europeData.js';
import { useState, useEffect } from 'react';
import { TravelDataContext } from '../../context/TravelDataContext.js';
import { useContext } from 'react';
import L, { geoJSON } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Map.css';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import plane2 from '../../assets/plane2.png';
import axios from 'axios';
import qs from 'qs';
import { iataMap } from '../../Data/countriesIATA.js';

export default function Map() {
	const { flightDataCollection, dispatch } = useContext(TravelDataContext);
	const [destination, setDestination] = useState(null);
	const [isPending, setIsPending] = useState(false);

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

	L.Marker.prototype.options.icon = DefaultIcon;

	useEffect(() => {
		if (destination) {
			fetchRoute();
		}
		async function fetchRoute() {
			setIsPending(true);
			const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';
			const secretData = {
				grant_type: 'client_credentials',
				client_id: process.env.REACT_APP_CLIENT_ID,
				client_secret: process.env.REACT_APP_CLIENT_SECRET,
			};
			const options = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				data: qs.stringify(secretData),
				url,
			};
			const api_key = await axios(options);
			const data = await axios.get(
				`     https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination.iata}&departureDate=${from}&returnDate=${to}&adults=1&nonStop=false&max=5`,
				{
					headers: {
						Authorization: `Bearer ${api_key.data.access_token}`,
					},
				}
			);

			const flightData = data.data.data.map((fare) => {
				// from 2022-10-14 to 221014
				const dateFormatted = (date) => {
					const newDate = date.split('-');
					const lastLetter = newDate[0].charAt(newDate[0].length - 1);
					const firstLetter = newDate[0].charAt(0);
					newDate[0] = firstLetter + lastLetter;
					console.log(newDate.join(''));
					return newDate.join('');
				};
				console.log(
					'PROVIDER:',
					Object.values(data.data.dictionaries.carriers)[0]
				);
				return {
					price: fare.price.total,
					total: fare.price.total,
					provider: Object.values(data.data.dictionaries.carriers)[0],
					url: `https://www.skyscanner.net/transport/flights/${origin}/${
						destination.iata
					}/${dateFormatted(from)}/${dateFormatted(
						to
					)}/?adults=2&adultsv2=2&cabinclass=economy&children=0&childrenv2=&destinationentityid=27544850&inboundaltsenabled=false&infants=0&originentityid=27544008&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1`,
					tripId: 3,
				};
			});
			setIsPending(false);
			dispatch({ type: 'COUNTRY_FOUND', payload: flightData });
		}
	}, [destination]);
	const highlightFeature = (e) => {
		let layer = e.target;
		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7,
		});

		layer.bringToFront();
	};

	const resetHighlight = (e) => {
		let layer = e.target;

		layer.setStyle({
			fillOpacity: 1,
			color: 'black',
			weight: 2,
		});
	};

	async function chooseCountry(event) {
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
		if (
			country.properties.iso_a2 === flightDataCollection.airport.countryCode
		) {
			country.category = 'origin';
		} else if (country.properties.iso_a2 === destination?.country_a2) {
			country.category = 'destination';
		} else country.category = 'rest';
		country.iata = iataMap[country.properties.adm0_a3] || null;
		const countryName = country.properties.admin;
		layer.bindPopup(countryName);
		layer.on({
			click: chooseCountry,
			mouseover: highlightFeature,
			mouseout: resetHighlight,
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
			case 'origin':
				return '#39FF14';
				break;
			case 'rest':
				return '#add8e6';
				break;
			case 'destination':
				return '#fd3';
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
					Loading data may take a little while..
				</div>
			)}
			{!isPending && (
				<div className='info-container'>
					Click on the Map to choose your Destination
				</div>
			)}
			{!isPending && (
				<div className='info-container'>
					Click on the Map to choose your Destination
				</div>
			)}
			{!isPending && (
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
			)}
		</>
	);
}
