import bike from '../../assets/bike.jpg';
import fly from '../../assets/fly.jpg';
import greece from '../../assets/greece.jpg';

export default function Main() {
	return (
		<main className='main'>
			<div className='landing'>
				<h1>
					Too much fun <br></br>
					<span className='second-line'>
						for just <span className='header-span'>one trip.</span>
					</span>
				</h1>
			</div>

			<div className='cards'>
				<div className='a-box'>
					<div className='img-container'>
						<div className='img-inner'>
							<div className='inner-skew'>
								<img src={fly} />
							</div>
						</div>
					</div>
					<div className='text-container'>
						<h3>Summer Getaways</h3>
						<div>
							Discover all our deals for this summer – it’s time to make it the
							BEST one ever. Search our ABTA and ATOL-protected package
						</div>
					</div>
				</div>
				<div className='a-box'>
					<div className='img-container'>
						<div className='img-inner'>
							<div className='inner-skew'>
								<img src={greece} />
							</div>
						</div>
					</div>
					<div className='text-container'>
						<h3>Winter 22/23 holidays</h3>
						<div>
							Thinking about winter already? Start planning your sunshine
							holiday now and get it ticked off your to-book list.
						</div>
					</div>
				</div>
				<div className='a-box'>
					<div className='img-container'>
						<div className='img-inner'>
							<div className='inner-skew'>
								<img src={bike} />
							</div>
						</div>
					</div>
					<div className='text-container'>
						<h3>Our holiday deals</h3>
						<div>
							Lock in the price of your Summer 2023 holiday today! Secure next
							year’s sunshine with just a £60pp deposit* then sprea
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
