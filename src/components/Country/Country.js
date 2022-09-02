import './Country.css'

export default function Country({countryDataCollection}) {

    console.log(countryDataCollection);
    return (
        <div className="sliderContainer">
            <div className="close">X</div>
             <h2>Cheapest flights for your date:</h2>
            <ul className="slider__ul">
                {countryDataCollection.map((country,i) => {
                return (<li className="slider__list--item">
                    <span>{i + 1}</span><span>{country.provider.padEnd(130,' ')}</span><span>P/P: {Math.floor(country.price)} GBP</span>
                    <a target="_blank" href={`${country.url}`}>Go to website</a>
                </li>)
                })}
            </ul>
        </div>
    )
}