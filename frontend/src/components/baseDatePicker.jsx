import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
export const BaseDatePicker = ({ dates, setDates }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
                <DatePicker
                    label='Data OD:'
                    format='DD-MM-YYYY'
                    value={dates.from}
                    onChange={newDate => {
                        const fromDate = dayjs(newDate);
                        const toDate = dayjs(newDate).endOf('year');
                        setDates({ ...dates, from: fromDate, to: toDate });
                    }}
                />
                <DatePicker
                    label='Data DO:'
                    format='DD-MM-YYYY'
                    value={dates.to}
                    onChange={newDate => setDates({
                        ...dates,
                        to: dayjs(newDate),
                    })}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
};
