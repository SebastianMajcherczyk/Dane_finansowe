import React, { useMemo, useState, useEffect } from 'react';
import MaterialReactTable from 'material-react-table';
import { Box, Button, Stack, Typography } from '@mui/material';

export const SettlementsTable = ({ initialData, columnConfig }) => {
	const [data, setData] = useState([]);
	useEffect(() => {
		if (initialData) {
			const newData = initialData.map(item => ({
				...item,

				KWOTAPLN:
					typeof item.KWOTAPLN === 'string'
						? parseFloat(item.KWOTAPLN.replace(',', '.'))
						: 0,

				KWOTAMAPLN:
					typeof item.KWOTAMAPLN === 'string'
						? parseFloat(item.KWOTAMAPLN.replace(',', '.'))
						: 0,

				[columnConfig.KWOTA_WN]:
					typeof item[columnConfig.KWOTA_WN] === 'string'
						? parseFloat(item[columnConfig.KWOTA_WN].replace(',', '.'))
						: 0,

				[columnConfig.KWOTA_MA]:
					typeof item[columnConfig.KWOTA_MA] === 'string'
						? parseFloat(item[columnConfig.KWOTA_MA].replace(',', '.'))
						: 0,
			}));

			setData(newData);
		}
	}, [initialData, columnConfig]);
	const columns = useMemo(() => {
		let ColumnsArray = [
			{
				accessorKey: 'KONTOWN',
				header: 'Konto WN',
				size: '80',
				muiTableBodyCellProps: {
					align: 'left',
				},
				muiTableHeadCellProps: {
					align: 'left',
				},
			},

			{
				accessorKey: 'NAZWADL',
				header: 'NAZWADL',
				size: '80',
				muiTableBodyCellProps: {
					align: 'left',
				},
				muiTableHeadCellProps: {
					align: 'left',
				},
				aggregationFn: values => values[values.length - 1], // Return the last value
				AggregatedCell: ({ cell }) => {
					console.log(cell);
					return <>{cell.row.original.NAZWADL}</>;
				},
			},
			{
				accessorKey: columnConfig.KWOTA_WN,
				header: columnConfig.KWOTA_WN_HEADER,
				enableGrouping: false,
				muiTableBodyCellProps: {
					align: 'right',
				},
				muiTableHeadCellProps: {
					align: 'right',
				},
				size: '80',
				Cell: ({ cell }) => {
					const value = cell.getValue();
					return value
						? parseFloat(value).toLocaleString('pl-PL', {
								minimumFractionDigits: 2,
								useGrouping: true,
						  })
						: '-';
				},
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
								{parseFloat(cell.getValue()).toLocaleString('pl-PL', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</Box>
						</>
					);
				},
			},
			{
				accessorKey: columnConfig.KWOTA_MA,
				header: columnConfig.KWOTA_MA_HEADER,
				enableGrouping: false,
				muiTableBodyCellProps: {
					align: 'right',
				},
				muiTableHeadCellProps: {
					align: 'right',
				},
				size: '80',
				Cell: ({ cell }) => {
					const value = cell.getValue();
					return value
						? parseFloat(value).toLocaleString('pl-PL', {
								minimumFractionDigits: 2,
								useGrouping: true,
						  })
						: '-';
				},
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
								{parseFloat(cell.getValue()).toLocaleString('pl-PL', {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</Box>
						</>
					);
				},
			},
		];

		if (columnConfig.showDetails) {
			const dateColumn = {
				accessorKey: 'DATA_ZAKS',
				header: 'Data zaks.',
				size: '100',
				Cell: ({ cell }) => {
					const date = new Date(cell.getValue());
					return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
						2,
						'0'
					)}-${String(date.getDate()).padStart(2, '0')}`;
				},
			};
			const descriptionColumn = {
				accessorKey: 'OPIS',
				header: 'Opis',
			};
			ColumnsArray.splice(2, 0, dateColumn);
			ColumnsArray.splice(2, 0, descriptionColumn);
		}
		return ColumnsArray;
	}, [columnConfig]);
	return (
		<Box sx={{ width: '95%' }}>
			<MaterialReactTable
				data={data}
				columns={columns}
				enableGrouping
				enableStickyFooter
				enableStickyHeader
				enableColumnOrdering
				enableColumnResizing
			/>
		</Box>
	);
};
