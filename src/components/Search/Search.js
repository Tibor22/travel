import "./Search.css";

export default function Search() {
	return (
		<>
			<div className="search__container">
				<label className="search__label">
					<span className="search__span">Travel From:</span>
					<input className="search__input" type="text" placeholder="Search Airport" />
				</label>
			</div>
		</>
	);
}
