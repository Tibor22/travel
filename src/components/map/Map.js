import {
	MapContainer,
	TileLayer,
	useMap,
	Marker,
	Popup,
	GeoJSON,
} from 'react-leaflet';
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
import axios from 'axios';

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

	L.Marker.prototype.options.icon = DefaultIcon;

	console.log(destination);
	console.log('FLIGHT DATA:', flightData);
	const iataMap = {
		ITA: 'FCO',
		FIN: 'HEL',
		BEL: 'BRU',
		BIH: 'SJJ',
		BLR: 'MSQ',
		CZE: 'PRG',
		BGR: 'SOF',
		ALB: 'TIA',
		AUT: 'VIE',
		CHE: 'ZRH',
		DNK: 'CPH',
		DEU: 'FRA',
		HUN: 'BUD',
		FRA: 'CDG',
		ESP: 'MAD',
		GBR: 'LHR',
		EST: 'TLL',
		ISL: 'KEF',
		GRC: 'ATH',
		HRV: 'ZAG',
		IRL: 'DUB',
		KOS: 'PRN',
		LTU: 'VNO',
		LUX: 'LUX',
		LVA: 'RIX',
		MDA: 'KIV',
		MKD: 'SKP',
		MNE: 'TGD',
		NLD: 'AMS',
		NOR: 'OSL',
		SVK: 'BTS',
		POL: 'WAW',
		PRT: 'LIS',
		ROU: 'OTP',
		RUS: 'SVO',
		SRB: 'BEG',
		SVN: 'LJU',
		SWE: 'ARN',
		UKR: 'KBP',
	};

	useEffect(() => {
		if (destination) {
			fetchRoute();
		}
		async function fetchRoute() {
			setIsPending(true);
			console.log('DESTINATION:', destination);
			// const data = await getJSON(
			// 	`https://api.flightapi.io/roundtrip/${API_KEY}/${origin}/${destination.iata}/${from}/${to}/2/0/0/Economy/GBP`
			// );
			const data = await axios.get(
				`     https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination.iata}&departureDate=${from}&returnDate=${to}&adults=1&nonStop=false&max=10`,
				{
					headers: {
						Authorization: `Bearer rxJ3qce1BjsGFWNUH8vOTnGWK6m7`,
					},
				}
			);
			console.log('DATA', data);

			console.log('THE MOST IMPORTANT DATA', data.data.dictionaries);

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

				return {
					price: fare.price.total,
					total: fare.price.total,
					provider: Object.values(data.dictionaries.carriers)[0],
					url: `https://www.skyscanner.net/transport/flights/${origin}/${
						destination.iata
					}/${dateFormatted(from)}/${dateFormatted(
						to
					)}/?adults=2&adultsv2=2&cabinclass=economy&children=0&childrenv2=&destinationentityid=27544850&inboundaltsenabled=false&infants=0&originentityid=27544008&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1`,
					tripId: 3,
				};
			});
			setIsPending(false);
			console.log('FLIGHT DATA:', flightData);
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
		layer.bindPopup('Hungary');
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
