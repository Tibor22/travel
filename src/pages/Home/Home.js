import Map from '../../components/map/Map.js';
import { TravelDataContext } from '../../context/TravelDataContext.js';
import { useContext } from 'react';
import './Home.css';
import Country from '../../components/Country/Country.js';
import Main from '../../components/Main/Main.js';

export default function Home() {
	const { flightDataCollection, countryDataCollection, dispatch } =
		useContext(TravelDataContext);

	return (
		<div>
			{!flightDataCollection && <Main />}
			{countryDataCollection && (
				<Country countryDataCollection={countryDataCollection} />
			)}
			{flightDataCollection && <Map />}
		</div>
	);
}
