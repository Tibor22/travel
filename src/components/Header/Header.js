import './Header.css';
import React, { useState, useEffect } from 'react';
import DatePickerForm from '../DatePicker/DatePicker.js';
import Search from '../Search/Search.js';
import { TravelDataContext } from '../../context/TravelDataContext.js';
import { useContext } from 'react';

export default function Header() {
	const { dispatch } = useContext(TravelDataContext);

	const [range, setRange] = useState(null);
	const [formData, setFormData] = useState({
		search: '',
		range,
	});
	useEffect(() => {
		if (range?.range.length > 1) {
			function createRange() {
				const range2 = range.range.map((time) => {
					const year = time.getFullYear();
					const month = time.getMonth() + 1;
					const day = time.getDate();
					return year + '-' + month + '-' + day;
				});
				const time = {
					from: range2[0],
					to: range2[1],
				};
				console.log(time);
				setFormData({ ...formData, from: time.from, to: time.to });
			}
			createRange();
		}
	}, [range]);
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData?.airport?.airportCode || !formData.from || !formData.to)
			return;
		dispatch({ type: 'SEARCH_READY', payload: formData });
		setRange(null);
		setFormData({
			search: '',
			range,
		});
	};

	const resetSearch = () => {
		dispatch({ type: 'RESET_SEARCH', payload: {} });
	};

	return (
		<div className='header-container'>
			<div className='header'>
				<img
					onClick={resetSearch}
					src='https://www.kindpng.com/picc/m/537-5375857_travel-and-tour-logo-hd-png-download.png'
					style={{ width: '60px', marginLeft: '1rem', cursor: 'pointer' }}
					alt=''
				/>

				<form onSubmit={handleSubmit}>
					<Search formData={formData} setFormData={setFormData} />
					<DatePickerForm
						range={range}
						setRange={setRange}
						formData={formData}
						setFormData={setFormData}
					/>
					<button type='submit'>Search</button>
				</form>
			</div>
		</div>
	);
}
