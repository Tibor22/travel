import './Country.css';
import { useState, useEffect } from 'react';
import { TravelDataContext } from '../../context/TravelDataContext.js';
import { useContext } from 'react';
export default function Country({ countryDataCollection }) {
	const [closeSlider, setCloseSlider] = useState(false);
	const { flightDataCollection, dispatch } = useContext(TravelDataContext);
	const from = flightDataCollection.from;
	const to = flightDataCollection.to;
	useEffect(() => {
		setCloseSlider(false);
	}, [countryDataCollection]);
	const sortedData = countryDataCollection.sort((a, b) => a.price - b.price);
	return (
		<>
			{closeSlider && (
				<div
					onClick={() => setCloseSlider(!closeSlider)}
					className='slider-to-open'
				>
					Flights
				</div>
			)}
			<div className={`sliderContainer ${closeSlider ? 'close' : ''}`}>
				<div onClick={() => setCloseSlider(!closeSlider)} className='close'>
					X
				</div>
				<h2>
					Cheapest flights for your date: {from.substring(5, from.length)}{' '}
					/&nbsp;
					{to.substring(5, to.length)}
				</h2>
				<ul className='slider__ul'>
					{sortedData &&
						sortedData.map((country, i) => {
							if (
								country.provider === 'Sorry no flights available for your date'
							) {
								return (
									<li key={i} className='slider__list--item'>
										{country.provider}
									</li>
								);
							} else {
								return (
									<li key={i} className='slider__list--item'>
										<div className='flex-first'>
											<span>{i + 1}</span>
											<span>{country.provider}</span>
										</div>
										<div className='flex-second'>
											<span>P/P: {Math.floor(country.price)} GBP</span>
											<a target='_blank' href={`${country.url}`}>
												Go to website
											</a>
										</div>
									</li>
								);
							}
						})}
				</ul>
			</div>
		</>
	);
}
