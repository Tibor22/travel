import { DatePicker } from 'react-rainbow-components';
import './DatePicker.css';
export default function DatePickerForm({ range, setRange }) {
	return (
<<<<<<< HEAD
		<div className='rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto date-container'>
=======
		<div className='rainbow-align-content_center rainbow-m-vertical_large rainbow-p-horizontal_small rainbow-m_auto date-container '>
>>>>>>> rehook_with_amadeus
			<label className='date-picker'>
				<span className='span__header'>Choose your dates:</span>
				<DatePicker
					id='datePicker-15'
					placeholder='Select range of dates'
					selectionType='range'
					formatStyle='large'
					variant='single'
					value={range ? range.range : ''}
					onChange={(value) => setRange({ range: value })}
				/>
			</label>
		</div>
	);
}
