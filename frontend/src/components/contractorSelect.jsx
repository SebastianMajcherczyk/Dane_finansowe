import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Box } from '@mui/material';

export const ContractorSelect = ({
	contractors,
	selectedContractor,
	setSelectedContractor,
}) => {
	const [inputValue, setInputValue] = useState(''); // State to store the input value

	// Custom filter function
	const filterOptions = (options, { inputValue }) => {
		if (!inputValue) {
			// If inputValue is undefined or empty, return all options
			return options;
		}
		const lowerCaseInputValue = inputValue.toLowerCase(); // Convert input value to lowercase
		// Filtering by idNumber and contractorName
		return options.filter(
			option =>
				option.NIPW.toLowerCase().includes(lowerCaseInputValue) || // Convert idNumber to lowercase and check if it includes the input value
				option.NAZWADL.toLowerCase().includes(lowerCaseInputValue) // Convert contractorName to lowercase and check if it includes the input value
		);
	};
	// Custom option rendering
	const renderOption = option => (
		<div>
			<span>{option.NIPW}</span> - <span>{option.NAZWADL}</span>
		</div>
	);
	if (!contractors) {
		return <></>;
	}
	return (
		<Box sx={{ maxWidth: 700, marginTop: '30px' }}>
			<Autocomplete
				
				disablePortal
				options={contractors}
				getOptionLabel={option => option.NIPW + ' - ' + option.NAZWADL}
				filterOptions={filterOptions}
				renderOption={renderOption}
				value={selectedContractor}
				inputValue={inputValue} // Set the input value from state
				onInputChange={(event, newInputValue) => setInputValue(newInputValue)} // Update the input value in state
				onChange={(event, value) => setSelectedContractor(value)}
				renderInput={params => (
					<TextField
					
						{...params}
						label='Wybierz konrahenta'
						variant='outlined'
					/>
				)}
			/>
		</Box>
	);
};
