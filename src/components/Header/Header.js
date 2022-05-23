import "./Header.css";
import React, { useState } from "react";
import DatePickerForm from "../DatePicker/DatePicker.js"
import Search from "../Search/Search.js";

export default function Header() {
	const [range, setRange] = useState(null);
	const [formData, setFormData] = useState({
		from: "",
        range,
	});

	return (
		<div className="header">
            <img src="https://www.kindpng.com/picc/m/537-5375857_travel-and-tour-logo-hd-png-download.png" style={{width:"60px",marginLeft:"1rem"}} alt="" />
			<form>
            <Search />
            <DatePickerForm range={range} setRange={setRange}/>
			</form>
		</div>
	);
}
