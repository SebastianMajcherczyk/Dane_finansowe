import React, { useMemo, useState, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';
import { Box, Button, Stack } from '@mui/material';

export const DataTable = ({ initialData }) => {
	const [data, setData] = useState([]);
	const [rowSelection, setRowSelection] = useState({});
	const [selectedRows, setSelectedRows] = useState([]);
	const [sumKWOTA, setSumKWOTA] = useState(0);
	const [sumKWOTAPLN, setSumKWOTAPLN] = useState(0);
	const [sumKWOTAMAPLN, setSumKWOTAMAPLN] = useState(0);
	const [sumSelectedKWOTA, setSumSelectedKWOTA] = useState(0);
	const [sumSelectedKWOTAPLN, setSumSelectedKWOTAPLN] = useState(0);
	const [sumSelectedKWOTAMAPLN, setSumSelectedKWOTAMAPLN] = useState(0);
	// const [filters, setFilters] = useState([{ id: 'NR_MA', value: '202' }]);
	
	const [filters, setFilters] = useState([{ id: '', value: '' }]);

	const changeFilters = () => {
		const newValue =
			filters.length === 0 ? [{ id: 'NR_MA', value: '202' }] : [];
		console.log(newValue);
		setFilters(newValue);
	};
	useEffect(() => {
		if (initialData) {
			const newData = initialData.map(item => ({
				...item,
				KWOTA:
					typeof item.KWOTA === 'string'
						? parseFloat(item.KWOTA.replace(',', '.'))
						: 0,
				KWOTAPLN:
					typeof item.KWOTAPLN === 'string'
						? parseFloat(item.KWOTAPLN.replace(',', '.'))
						: 0,
				KWOTAMA:
					typeof item.KWOTAMA === 'string'
						? parseFloat(item.KWOTAMA.replace(',', '.'))
						: 0,
				KWOTAMAPLN:
					typeof item.KWOTAMAPLN === 'string'
						? parseFloat(item.KWOTAMAPLN.replace(',', '.'))
						: 0,
			}));

			setData(newData);
		}
	}, [initialData]);

	useEffect(() => {
		if (data) {
			setSumKWOTA(data.reduce((sum, row) => sum + row.KWOTA, 0));
			setSumKWOTAPLN(data.reduce((sum, row) => sum + row.KWOTAPLN, 0));
			setSumKWOTAMAPLN(data.reduce((sum, row) => sum + row.KWOTAMAPLN, 0));
		}
	}, [data]);
	useEffect(() => {
		const selectionIds = Object.keys(rowSelection).map(key => +key);

		const selectedData = data.filter(row =>
			selectionIds.includes(Number(row.ID_POZPK))
		);

		// calculate sums of selected rows
		const sumSelectedKWOTA = selectedData.reduce(
			(sum, row) => sum + row.KWOTA,
			0
		);
		const sumSelectedKWOTAPLN = selectedData.reduce(
			(sum, row) => sum + row.KWOTAPLN,
			0
		);
		const sumSelectedKWOTAMAPLN = selectedData.reduce(
			(sum, row) => sum + row.KWOTAMAPLN,
			0
		);

		setSumSelectedKWOTA(sumSelectedKWOTA);
		setSumSelectedKWOTAPLN(sumSelectedKWOTAPLN);
		setSumSelectedKWOTAMAPLN(sumSelectedKWOTAMAPLN);
	}, [rowSelection, data]);

	const columns = useMemo(
		() => [
			{ accessorKey: 'ID_POZPK', header: 'ID', className: 'invisible-column' },
			{ accessorKey: 'ROKKAL_NAG', header: 'ROK', size: '80' },
			{ accessorKey: 'NAZWADL', header: 'KONTRAHENT' },
			{ accessorKey: 'KONTOWN', header: ' KONTO WN', size: '130' },
			{ accessorKey: 'NR_WN', header: 'NR WN', className: 'invisible-column' },
			{ accessorKey: 'NAZWAWN', header: ' NAZWA WN' },
			{ accessorKey: 'NR_MA', header: 'NR_MA' },
			{ accessorKey: 'KONTOMA', header: 'KONTO MA', size: '130' },
			{ accessorKey: 'NRDOKZEW', header: ' NUMER DOK ZEWN' },
			{ accessorKey: 'OPIS', header: ' OPIS' },
			{
				accessorKey: 'KWOTAPLN',
				header: ' KWOTA WN PLN',
				muiTableBodyCellProps: {
					align: 'right',
				  },
				  size: '140',
				Cell: ({ cell }) => {
					const value = cell.getValue();
					return value 
						? parseFloat(value).toLocaleString('pl-PL', {minimumFractionDigits: 2, useGrouping: true}) 
						: '-';},
				aggregationFn: 'sum',
				AggregatedCell: ({ cell, table }) => {
					return (
						<>
							Suma wg{' '}
							{
								table.getColumn(cell.row.groupingColumnId ?? '').columnDef
									.header
							}
							:{' '}
							<Box
								sx={{
									color: 'info.main',
									display: 'inline',
									fontWeight: 'bold',
								}}>
								{parseFloat(cell.getValue()).toFixed(2)}
							</Box>
						</>
					);
				},
				Footer: () => (
					<Stack>
						KWOTA PLN suma:
						<Box>
							{sumKWOTAPLN.toLocaleString('pl-PL', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</Box>
						<Box>
							KWOTA WN PLN suma wybranych:
							<Box>{sumSelectedKWOTAPLN}</Box>
						</Box>
					</Stack>
				),
			},
			{
				accessorKey: 'KWOTAMAPLN',
				header: ' KWOTA MA PLN',
				align: 'right',
				muiTableBodyCellProps: {
					align: 'right',
				  },
				size: '140',
				Cell: ({ cell }) => {
					const value = cell.getValue();
					return value 
						? parseFloat(value).toLocaleString('pl-PL', {minimumFractionDigits: 2, useGrouping: true}) 
						: '-';},
				aggregationFn: 'sum',
				AggregatedCell: ({ cell, table }) => (
					<>
						Suma wg{' '}
						{table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
						<Box
							sx={{
								color: 'info.main',
								display: 'inline',
								fontWeight: 'bold',
							}}>
							{cell.getValue().toLocaleString('pl-PL', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</Box>
					</>
				),
				Footer: () => (
					<Stack>
						KWOTAMAPLN sum:
						<Box>
							{sumKWOTAMAPLN.toLocaleString('pl-PL', {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</Box>
						<Box>
							KWOTA MA PLN suma wybranych:
							<Box>{sumSelectedKWOTAMAPLN}</Box>
						</Box>
					</Stack>
				),
			},
		],
		[
			data,
			sumKWOTA,
			sumKWOTAPLN,
			sumKWOTAMAPLN,
			sumSelectedKWOTA,
			sumSelectedKWOTAPLN,
			sumSelectedKWOTAMAPLN,
		]
	);

	return (
		<>
			<MaterialReactTable
				data={data}
				columns={columns}
				enableGrouping
				enableColumnDragging={true}
				enableRowSelection
				getRowId={row => row.ID_POZPK}
				onRowSelectionChange={setRowSelection}
				state={{ rowSelection, columnFilters: filters }}
				enableStickyFooter
				enableStickyHeader
				enableColumnOrdering
				enableColumnResizing
				muiTablePaginationProps={{
					rowsPerPageOptions: [50, 100, 200],
					showFirstButton: false,
					showLastButton: false,
				}}
				initialState={{
					pagination: { pageSize: 50 },
					columnVisibility: { ID_POZPK: false, NR_WN: false, NR_MA: false },
				}}
				displayColumnDefOptions={{
					'mrt-row-actions': {
						muiTableHeadCellProps: {
							align: 'center',
						},
						size: 120,
					},
				}}
			/>
			<Button onClick={changeFilters}>Zeruj filtry</Button>
			<Button onClick={() => setFilters([{ id: 'NR_MA', value: '202' }])}>
				Pokaż rozrachunki MA
			</Button>
			
		</>
	);
};
