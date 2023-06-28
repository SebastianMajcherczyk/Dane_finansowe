import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import './loginPanel.css';
import { dataService } from '../../services/services';

export const LoginPanel = ({ setLoggedIn }) => {
	const [loginData, setLoginData] = useState({
		login: '',
		password: '',
	});
	const [shakeForm, setShakeForm] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleChange = e => {
		// e.preventDefault();
		const { name, value } = e.target;
		setLoginData({ ...loginData, [name]: value });
	};

	const login = async () => {
		try {
			await dataService.adminLogIn(loginData);
			setLoggedIn(true);
		} catch (err) {
			setShakeForm(true);
			setErrorMessage('Błędne dane logowania');
			setTimeout(() => {
				setErrorMessage('');
				setShakeForm(false)
			}, 1000);
		}
	};
	return (
		<Box
			component='form'
			autoComplete='off'
			sx={{
				width: '100%',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				m: '75px auto 5px auto',
				p: '20px',
			}}>
			<Box
				className={shakeForm ? 'shake' : ''}
				sx={{
					width: '200px',
					minHeight: '150px',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'space-around',
				}}>
				<TextField
					error={errorMessage !== ''}
					id='login'
					label='login'
					variant='outlined'
					type='text'
					name='login'
					color='primary'
					value={loginData.login}
					onChange={handleChange}
				/>
				<TextField
					error={errorMessage !== ''}
					id='password'
					label='password'
					name='password'
					variant='outlined'
					type='password'
					color='primary'
					value={loginData.password}
					onChange={handleChange}
				/>
			</Box>
			<Box variant='h6' sx={{minHeight: '30px', color: 'red' }}>
				{errorMessage}
			</Box>
			<Button onClick={login}>Zaloguj</Button>
		</Box>
	);
};
