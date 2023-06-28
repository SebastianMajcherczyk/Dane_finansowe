import { Button } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { dataService } from '../services/services';

export const LogoutPanel = ({ setLoggedIn }) => {
	const logOut = async () => {
		try {
			await dataService.logOut();
			setLoggedIn(false);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Box>
			<Box>Użytkownik zalogowany</Box>
			<Button onClick={logOut}>Wyloguj</Button>
		</Box>
	);
};
