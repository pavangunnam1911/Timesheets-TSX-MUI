import { useState, useEffect } from "react";
import {ThemeProvider,Container,Box,Typography,Button,Dialog,} from "@mui/material";
import Header from "./components/Header/Header";
import FabMenu from "./components/FabMenu/FabMenu";
import CalendarView from "./components/CalendarView/CalendarView";
import AddDataForm from "./components/AddDataForm/AddDataForm";
import TimesheetTable from "./components/TimesheetTable/TimesheetTable";
import { theme } from "./theme";
import type { Timesheet } from "./types/Timesheet";

export default function App() {
  const [data, setData] = useState<Timesheet[]>(() => {
    try {
      const stored = localStorage.getItem("timesheets");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (err) {
      console.error("Failed to parse stored timesheets:", err);
    }
    return [];
  });

  const [formOpen, setFormOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editData, setEditData] = useState<Timesheet | null>(null);

  useEffect(() => { localStorage.setItem("timesheets", JSON.stringify(data)); }, [data]);

  const handleSave = (entry: Timesheet) => {
    setData((prev) => {
      const exists = prev.find((d) => d.id === entry.id);
      const updated = exists? prev.map((d) => (d.id === entry.id ? entry : d)): [...prev, entry];
      localStorage.setItem("timesheets", JSON.stringify(updated));
      return updated;
    });
  };

  const handleDelete = (id: string) => {
    setData((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      localStorage.setItem("timesheets", JSON.stringify(updated));
      return updated;
    });
  };

  const filteredData = selectedDate? data.filter((d) => d.date === selectedDate): data;

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Container maxWidth="lg" sx={{ pt: 3, pb: 10 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>

          <Typography variant="h4" fontWeight={700} color="primary.dark">
            {selectedDate ? `Entries on ${selectedDate}`: "Timesheet Entries"}
          </Typography>

          {selectedDate && (
            <Button variant="outlined" color="secondary" onClick={() => setSelectedDate(null)}>
              Clear Selection
            </Button>
          )}
        </Box>

        <TimesheetTable data={filteredData} onEdit={(item) => {setEditData(item); setFormOpen(true);}} onDelete={handleDelete}/>

      </Container>

      <FabMenu
        onAdd={() => { setEditData(null); setFormOpen(true); }}
        onViewCalendar={() => setCalendarOpen(true)}
      />

      <AddDataForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        editData={editData}
      />

      <Dialog
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        maxWidth="xs"
      >
        <CalendarView
          data={data}
          onCancel={() => setCalendarOpen(false)}
          onSelectDate={(date) => {
            setSelectedDate(date);
            setCalendarOpen(false);
          }}
        />
      </Dialog>
    </ThemeProvider>
  );
}
