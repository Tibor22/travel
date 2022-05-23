import "./Header.css";
import React, { useState,useEffect } from "react";
import DatePickerForm from "../DatePicker/DatePicker.js";
import Search from "../Search/Search.js";

export default function Header() {
	const [range, setRange] = useState(null);
	const [formData, setFormData] = useState({
		search: "",
		range,
	});
	useEffect(() => {
		if (range?.range.length > 1) {
			function createRange() {
				const range2 = range.range.map((time) => {
					const year = time.getFullYear();
					const month = time.getMonth();
					const day = time.getDate();
					return year + '/' + month + '/' + day
				});
				const time = {
					from: range2[0],
					to: range2[1],
				}
				console.log(time)
				setFormData({...formData,from:time.from,to:time.to})
			}
			createRange();
		}
	},[range])


	const handleSubmit = (e) => {
		e.preventDefault()
		console.log(formData);
	}

	console.log(formData, range,range?.range.length);
	return (
		<div className="header">
			<img
				src="https://www.kindpng.com/picc/m/537-5375857_travel-and-tour-logo-hd-png-download.png"
				style={{ width: "60px", marginLeft: "1rem" }}
				alt=""
			/>
			<form onSubmit={handleSubmit}>
				<Search formData={formData} setFormData={setFormData} />
				<DatePickerForm range={range} setRange={setRange} formData={formData} setFormData={setFormData}/>
				<button type="submit">Search</button>
			</form>
		</div>
	);
}
