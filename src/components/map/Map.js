import {
	MapContainer,
	TileLayer,
	useMap,
	Marker,
	Popup,
	GeoJSON,
} from "react-leaflet";
import { europeData } from "../../Data/europeData.js";
import { useState, useEffect } from "react";
import { TravelDataContext } from "../../context/TravelDataContext.js";
import { useContext } from "react";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";



import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import plane from '../../assets/plane.png'
import plane2 from '../../assets/plane2.png'


export default function Map() {
	const { flightDataCollection, dispatch } = useContext(TravelDataContext);

	console.log("STATE IN MAP:", flightDataCollection);

	const [flightData, setFlightData] = useState([
		{ arrivalCountry: "HU", departureCountry: "GB", price: 555 },
		{ arrivalCountry: "DE", departureCountry: "GB", price: 300 },
		{ arrivalCountry: "FR", departureCountry: "GB", price: 45 },
	]);

	let DefaultIcon = L.icon({
		iconUrl: plane2,
		shadowUrl: iconShadow,
		// iconUrl: 'https://img.lovepik.com/element/45001/7431.png_300.png',
		iconSize: [61, 71], // size of the icon
		iconAnchor: [30, 50], // point of the icon which will correspond to marker's location
		popupAnchor: [0, -71] // point from which the popup should open relative to the iconAnchor                          
	});
	
	L.Marker.prototype.options.icon = DefaultIcon;
	
	

	useEffect(() => {
		const priceSum = flightData.reduce((sum, currVal) => {
			return (sum += currVal.price);
		}, 0);
		const avgTravelCost = Math.floor(priceSum / flightData.length);
		setFlightData((prevData) =>
			prevData.map((data) => {
				const cheap = avgTravelCost * 0.8;
				const expensive = avgTravelCost * 1.2;
				console.log("CHEAP", cheap, "EXPENSIVE", expensive);
				if (data.price <= cheap) {
					return { ...data, category: "cheap" };
				}
				if (data.price >= cheap && data.price <= expensive) {
					return { ...data, category: "normal" };
				}
				if (data.price >= expensive) {
					return { ...data, category: "expensive" };
				}
			})
		);
	}, []);

	console.log(flightData);

	const changeCountryColor = (event) => {
		event.target.setStyle({
			color: "green",
			//   fillColor: this.state.color,
			fillOpacity: 1,
		});
	};
	// Math.floor(Math.random() * 1000);
	function onEachCountry(country, layer) {
		// console.log('CURRENT COUNTRY ISO:', country.properties.iso_a2);
		const currentCheapestFlight = flightData.filter((flight) => {
			if (country.properties.iso_a2 === flight.arrivalCountry) return true;
		});
		// console.log(currentCheapestFlight);
		country.category = currentCheapestFlight[0]?.category;
		const countryName = country.properties.admin;
		// console.log("ON EACH COUNTRY:", countryName);
		layer.bindPopup(countryName);

		// layer.options.fillOpacity = Math.random(); //0-1 (0.1, 0.2, 0.3)
		// const colorIndex = Math.floor(Math.random() * this.colors.length);
		// layer.options.fillColor = this.colors[colorIndex]; //0

		// console.log("LAYER", layer);
		layer.on({
			click: changeCountryColor,
		});
	}

	const countryStyle = (country) => {
		return {
			fillColor: getColor(country.category),
			fillOpacity: 1,
			color: "black",
			weight: 2,
		};
	};
	function getColor(category) {
		switch (category) {
			case "cheap":
				return "#39FF14";
				break;
			case "normal":
				return "#1e71f6";
				break;
			case "expensive":
				return "#BD0026";
				break;
			default:
				return "#FFEDA0";
		}
	}

	function handleClick(e) {
		console.log("click");
		onEachCountry();
	}

	const position = flightDataCollection && [
		flightDataCollection.airport.lat,
		flightDataCollection.airport.lon,
	];
	console.log(position);
	return (
		<MapContainer
			onClick={handleClick}
			style={{ height: "calc(100vh - 5rem) " }}
			id={"mapbox/light-v9"}
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
