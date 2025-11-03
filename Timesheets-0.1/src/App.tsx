import { useState, useEffect } from "react";
import { ThemeProvider, Dialog } from "@mui/material";
import Header from "./components/Header";
import FabMenu from "./components/FabMenu";
import CalendarView from "./components/CalendarView";
import AddDataForm from "./components/AddDataForm";
import { theme } from "./theme";
import type { Timesheet } from "./Interfaces/Timesheet";
import { useLocalStorage } from "./Hooks/useLocalStorage";
import { Routes, Route } from "react-router-dom";
import Welcomepage from "./Pages/Welcomepage";
import TableView from "./Pages/TableView";
import EmployeeCards from "./Pages/Employecards";

export default function App() {
  const [data, setData] = useLocalStorage<Timesheet[]>("timesheets", []);
  const [leaves, setLeaves] = useLocalStorage<Timesheet[]>("leaves", []);
  const [formOpen, setFormOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editData, setEditData] = useState<Timesheet | null>(null);

  useEffect(() => {
    localStorage.setItem("timesheets", JSON.stringify(data));
    localStorage.setItem("leaves", JSON.stringify(leaves));
  }, [data, leaves]);

  const handleSave = (entry: Timesheet) => {
    setData((prev) => {
      const exists = prev.find((d) => d.id === entry.id);
      const updated = exists ? prev.map((d) => (d.id === entry.id ? entry : d)) : [...prev, entry];
      localStorage.setItem("timesheets", JSON.stringify(updated));
      return updated;
    });
  };

  const handleSaveLeave = (entry: Timesheet) => {
    setLeaves((prev) => {
      const exists = prev.find((d) => d.id === entry.id);
      const updated = exists ? prev.map((d) => (d.id === entry.id ? entry : d)) : [...prev, entry];
      localStorage.setItem("leaves", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Routes>
        <Route path="/" Component={Welcomepage} />
        <Route path="/TableView" Component={TableView} />
        <Route path="/EmployeeCount" element={<EmployeeCards data={data} leaves={leaves} />} />
      </Routes>
      <FabMenu onAdd={() => { setEditData(null); setFormOpen(true); }} onViewCalendar={() => setCalendarOpen(true)} />
      <AddDataForm open={formOpen} onClose={() => setFormOpen(false)} onSave={handleSave} onSaveLeave={handleSaveLeave} editData={editData} />
      <Dialog open={calendarOpen} onClose={() => setCalendarOpen(false)} maxWidth="xs">
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
