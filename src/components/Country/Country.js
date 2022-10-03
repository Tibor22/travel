import './Country.css';

export default function Country({ countryDataCollection }) {
	console.log(countryDataCollection);

	const sortedData = countryDataCollection.sort((a, b) => a.price - b.price);
	return (
		<div className='sliderContainer'>
			<div className='close'>X</div>
			<h2>Cheapest flights for your date:</h2>
			<ul className='slider__ul'>
				{sortedData.map((country, i) => {
					return (
						<li className='slider__list--item'>
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
				})}
			</ul>
		</div>
	);
}
