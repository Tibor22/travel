import Map from "../../components/map/Map.js";
import { useFetchMultiple } from "../../hooks/useFetchMultiple.js";
import { TravelDataContext } from "../../context/TravelDataContext.js";
import { useContext } from "react";
import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";
import Country from "../../components/Country/Country.js";
import bike from "../../assets/bike.jpg"
import fly from "../../assets/fly.jpg"
import greece from "../../assets/greece.jpg"
import Main from "../../components/Main/Main.js"

export default function Home() {
	const [flightData, setFlightData] = useState(null);
	const { flightDataCollection, countryDataCollection, dispatch } =
		useContext(TravelDataContext);
	let { data, isPending, error } = useFetchMultiple(flightDataCollection);

	console.log("COUNTRYDATA COLLECTIOON IN HOME:", countryDataCollection);

	useEffect(() => {
		if (flightDataCollection === undefined || !data) return;
		console.log("DATA:", data);
		data = data.map((airport) => {
			return {
				price: airport.filters.minPrice.amount,
				arrivalCountry: airport.search.legs[0].arrivalCity.countryCode,
				departureCountry: airport.search.legs[0].departureCity.countryCode,
				iata: airport.filters.destinationAirports[0].code,
			};
		});

		async function fetchFLights() {
			const res = await fetch("http://localhost:3000/flights");
			let jsonData = await res.json();
			jsonData = jsonData.concat(data);

			const priceSum = jsonData.reduce((sum, currVal) => {
				return (sum += currVal.price);
			}, 0);
			const avgTravelCost = Math.floor(priceSum / jsonData.length);
			const newData = jsonData.map((jsonData) => {
				const cheap = avgTravelCost * 0.8;
				const expensive = avgTravelCost * 1.2;
				if (
					jsonData.arrivalCountry === flightDataCollection.airport.countryCode
				) {
					return { ...jsonData, category: "origin" };
				}
				if (jsonData.price <= cheap) {
					return { ...jsonData, category: "cheap" };
				}
				if (jsonData.price >= cheap && jsonData.price <= expensive) {
					return { ...jsonData, category: "normal" };
				}
				if (jsonData.price >= expensive) {
					return { ...jsonData, category: "expensive" };
				}
			});

			setFlightData(newData);
		}

		fetchFLights();
	}, [flightDataCollection, data]);

	console.log(flightData);
	return (
		<div>
			{isPending && (
				<div className="spinner">
					<Spinner variant="info" animation="grow" />
				</div>
			)}
			{!flightData && !isPending && (
				<Main/>
			)}
			{countryDataCollection && (
				<Country countryDataCollection={countryDataCollection} />
			)}
			{flightData && (
				<Map flightData={flightData} setFlightData={setFlightData} />
			)}
		</div>
	);
}
