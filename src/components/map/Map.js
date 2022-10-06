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
import { getJSON } from '../../utilities/getJSON.js';

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

	L.Marker.prototype.options.icon = DefaultIcon;
	useEffect(() => {
		if (destination) {
			fetchRoute();
		}
		async function fetchRoute() {
			setIsPending(true);
			let flightData;

			const data = await getJSON(
				`     http://localhost:4000/v1/flights/flight?origin=${origin}&destination=${destination.iata}&from=${from}&to=${to}`
			);
			if (data.length === 0) {
				flightData = [
					{
						provider: 'Sorry no flights available for your date',
					},
				];
			} else {
				flightData = data.map((flight) => {
					return {
						price: flight.price,
						total: flight.price,
						provider: flight.provider,
						url: `https://www.kayak.co.uk/flights/${origin}-${destination.iata}/${from}/${to}?sort=price_a&fs=stops=1`,
					};
				});
			}

			setIsPending(false);
			dispatch({ type: 'COUNTRY_FOUND', payload: flightData });
		}
	}, [destination]);

	async function chooseCountry(event) {
		setDestination({
			country_a2: event.target.feature.properties.iso_a2,
			countryName: event.target.feature.properties.admin,
			iata: event.target.feature.iata,
		});
	}

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
