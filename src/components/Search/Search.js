import { useEffect, useState } from 'react';

import './Search.css';

export default function Search({ formData, setFormData }) {
	const [airports, setAirports] = useState();

	useEffect(() => {
		if (!formData.search || airports === null) return;
		async function fetchSearch() {
			const res = await fetch(
				`https://autocomplete.travelpayouts.com/places2?locale=en&types[]=airport&types[]=city&term=${formData.search}`
			);
			const searchResult = await res.json();
			const airports = searchResult.map((searchResult) => {
				return {
					type: searchResult.type,
					airportCode: searchResult.code,
					airportName: searchResult.name,
					countryCode: searchResult.country_code,
					countryName: searchResult.country_name,
					lon: searchResult.coordinates.lon,
					lat: searchResult.coordinates.lat,
				};
			});
			setAirports(airports);
		}

		fetchSearch();
	}, [formData]);

	const handleClick = (airport) => {
		setFormData({ ...formData, airport: airport, search: airport.airportName });
		setAirports(null);
	};

	const handleChange = (e) => {
		setFormData({ ...formData, search: e.target.value });
		setAirports('');
	};

	return (
		<>
			<div className='search__container'>
				<label className='search__label'>
					<span className='search__span'>Travel From:</span>
					<input
						onChange={(e) => handleChange(e)}
						className='search__input'
						type='text'
						placeholder='Search Airport'
						value={formData.search}
						required
					/>
				</label>
				{airports && (
					<div className='search_suggestions'>
						<ul>
							{airports.map((airport) => {
								return (
									<li
										onClick={() => handleClick(airport)}
										className='search__list--item'
									>
										<span>{airport.airportCode}</span>
										<span>{airport.airportName}</span>
										<span>{airport.countryCode}</span>
									</li>
								);
							})}
						</ul>
					</div>
				)}
			</div>
		</>
	);
}
