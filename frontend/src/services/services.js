const dataServiceDef = () => {
	const getData = async apiUrl => {
		const res = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});
		const data = await res.json();
		return data;
	};
	const getContractors = async () => {
		const apiUrl = 'http://localhost:3000/api/contractors';
		const res = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		});
		const data = await res.json();

		return data;
	};
	const adminLogIn = async loginData => {
		try {
			const apiUrl = 'http://localhost:3000/api/auth/login';
			const response = await fetch(apiUrl, {
				method: 'POST',
				body: JSON.stringify(loginData),
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			// handle the response
			if (data.status === 'Success') {
				console.log(data);
				localStorage.setItem('token', data.token);
				localStorage.setItem('loggedIn', true);
			} else {
				throw new Error(data.status);
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	};
	const logOut = async () => {
		try {
			const apiUrl = 'http://localhost:3000/api/auth/logout';
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
			});
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			console.log(data);

			localStorage.removeItem('token');
			localStorage.removeItem('loggedIn');
		} catch (err) {
			console.log(err);
			throw err;
		}
	};
	return { getData, getContractors, adminLogIn, logOut };
};

export const dataService = dataServiceDef();
