import React from "react";
import {DialogTitle,DialogContent,DialogActions,Button,Typography,Badge,} from "@mui/material";
import { PickersDay } from "@mui/x-date-pickers/PickersDay";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import type { ICalendarViewProps } from "./interface"; 

const CalendarView: React.FC<ICalendarViewProps> = (prop) => {
  const counts: Record<string, number> = {};
  prop.data.forEach((entry) => {
    if (entry.date) {
      counts[entry.date] = (counts[entry.date] || 0) + 1;
    }
  });

  const renderDay = (dayProps: any) => {
    const safeDay = dayjs(dayProps.day);
    if (!safeDay.isValid()) return <PickersDay {...dayProps} />;

    const dateStr = safeDay.format("YYYY-MM-DD");
    const count = counts[dateStr] || 0;

    return (
      <Badge key={dateStr} overlap="circular" color={count > 0 ? "primary" : "default"} badgeContent={count > 0 ? count : undefined}>
        <PickersDay {...dayProps} />
      </Badge>
    );
  };

  return (
    <>
      <DialogTitle>Timesheet Calendar</DialogTitle>
      <DialogContent>
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          Click a date to view its timesheet entries.
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            disableFuture
            onChange={(newDate) => {
              if (!newDate) return;
              const safeDate = dayjs.isDayjs(newDate) ? newDate : dayjs(newDate);
              prop.onSelectDate(safeDate.format("YYYY-MM-DD"));
            }}
            slots={{
              day: renderDay,
            }}
          />
        </LocalizationProvider>
      </DialogContent>

      <DialogActions>
        <Button onClick={prop.onCancel}>Close</Button>
      </DialogActions>
    </>
  );
};

export default CalendarView;
