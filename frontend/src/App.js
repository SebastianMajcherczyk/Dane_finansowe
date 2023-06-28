import { useEffect, useState } from 'react';
import './App.css';
import { Box, Button, Typography } from '@mui/material';
import { DataTable } from './components/dataTable';
import dayjs from 'dayjs';
import { dataService } from './services/services';
import { ContractorSelect } from './components/contractorSelect';
import { BaseDatePicker } from './components/baseDatePicker';
import { LoginPanel } from './components/login-panel/loginPanel';
import { LogoutPanel } from './components/logoutPanel';
import { SettlementsTable } from './components/settlementsTable';

function App() {
	const [data, setData] = useState(null);
	const [contractors, setContractors] = useState([]);
	const [selectedContractor, setSelectedContractor] = useState(null);
	const [tableTitle, setTableTitle] = useState('');
	const [columnConfig, setColumnConfig] = useState({});
	// const firstDay = dayjs().startOf('year').format('YYYY-MM-DD');
	const firstDay = dayjs('2016-01-01');
	// const lastDay = dayjs().endOf('year').format('YYYY-MM-DD');
	const [dates, setDates] = useState({
		from: dayjs(firstDay),
		to: dayjs(firstDay).endOf('year'),
	});
	const [loggedIn, setLoggedIn] = useState(
		JSON.parse(localStorage.getItem('loggedIn')) || false
	);
	const [tableType, setTableType] = useState(null);
	useEffect(() => {
		(async () => {
			const tempData = await dataService.getContractors();
			setContractors(tempData);
		})();
	}, []);

	const urlAll = async () => {
		let apiUrl = 'http://localhost:3000/api/data?';
		if (selectedContractor) {
			apiUrl += `NIPW=${selectedContractor.NIPW}&`;
		}
		if (dates !== {}) {
			const dateFrom = dates.from.format('YYYY-MM-DD');
			const dateTo = dates.to.format('YYYY-MM-DD');
			apiUrl += `dateFrom=${dateFrom}&dateTo=${dateTo}`;
		}
		console.log(apiUrl);
		const tempData = await dataService.getData(apiUrl);
		setData(tempData);
	};
	const urlAccReceivableSum = async () => {
		let apiUrl = 'http://localhost:3000/api/data/accReceivableSum?';
		const tempData = await dataService.getData(apiUrl);
		setData(tempData);
	};
	const urlAccReceivable = async () => {
		let apiUrl = 'http://localhost:3000/api/data/accReceivable?';
		const tempData = await dataService.getData(apiUrl);
		setData(tempData);
	};

	if (!contractors) return <></>;
	return (
		<Box>
			{loggedIn && (
				<Box>
					<LogoutPanel setLoggedIn={setLoggedIn} />
					<Box>
						<ContractorSelect
							contractors={contractors}
							selectedContractor={selectedContractor}
							setSelectedContractor={setSelectedContractor}
						/>

						<BaseDatePicker dates={dates} setDates={setDates} />
						<Button
							disabled={!selectedContractor && !dates}
							onClick={() => {
								urlAll();
								setTableType('data');
								setTableTitle('Wszytkie dane');
							}}>
							Pobierz wszystkie dane dla powyższych kryteriów
						</Button>
						<Button
							onClick={() => {
								urlAccReceivableSum();
								setTableType('settlements');
								setColumnConfig({
									KWOTA_WN: 'SUMA WN',
									KWOTA_WN_HEADER: 'SUMA WN',
									KWOTA_MA: 'SUMA MA',
									KWOTA_MA_HEADER: 'SUMA MA',
								});
								setTableTitle('Rozrachunki z odbiorcami - podsumowanie');
							}}
							sx={{ display: 'block' }}>
							Pobierz rozrchunki z odbiorcami - podsumowanie
						</Button>
						<Button
							onClick={() => {
								urlAccReceivable();
								setTableType('settlements');
								setColumnConfig({
									KWOTA_WN: 'KWOTAPLN_WN',
									KWOTA_WN_HEADER: 'KWOTA PLN WN',
									KWOTA_MA: 'KWOTAPLN_MA',
									KWOTA_MA_HEADER: 'KWOTA PLN MA',
									showDetails: true
								});
								setTableTitle('Rozrachunki z odbiorcami - pozycje');
							}}
							sx={{ display: 'block' }}>
							Pobierz rozrchunki z odbiorcami - Pozycje
						</Button>
						<Button
							onClick={() => {
								setData(null);
								setTableTitle('');
							}}>
							Resetuj dane
						</Button>
						<Typography
							sx={{
								textAlign: 'left',
								color: 'primary.main',
								textTransform: 'uppercase',
							}}>
							{tableTitle}
						</Typography>
						{data && tableType === 'data' && <DataTable initialData={data} />}
						{data && tableType === 'settlements' && (
							<SettlementsTable
								initialData={data}
								columnConfig={columnConfig}
							/>
						)}
					</Box>
				</Box>
			)}

			{!loggedIn && <LoginPanel setLoggedIn={setLoggedIn} />}
		</Box>
	);
}

export default App;
