import { Box, Button, Container, Typography } from "@mui/material";
import TimesheetTable from "../components/TimesheetTable";
import { useState } from "react";
import { useLocalStorage } from "../Hooks/useLocalStorage";
import type { Timesheet } from "../Interfaces/Timesheet";
import AddDataForm from "../components/AddDataForm";

const TableView = () =>{
    
    const [data, setData] = useLocalStorage<Timesheet[]>("timesheets", []);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [editData, setEditData] = useState<Timesheet | null>(null);
    
        
    const handleDelete = (id: string) => {
        setData((prev) => {
        const updated = prev.filter((d) => d.id !== id);
        localStorage.setItem("timesheets", JSON.stringify(updated));
        return updated;
        });
    };
    
    const handleSave = (entry: Timesheet) => {
        setData((prev) => {
        const exists = prev.find((d) => d.id === entry.id);
        const updated = exists? prev.map((d) => (d.id === entry.id ? entry : d)): [...prev, entry];
        localStorage.setItem("timesheets", JSON.stringify(updated));
        return updated;
        });
    };

    const filteredData = selectedDate ? data.filter((d) => d.date === selectedDate): data;
    
    return(
        <>
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

        <AddDataForm
            open={formOpen}
            onClose={() => setFormOpen(false)}
            onSave={handleSave}
            editData={editData}
        />  
        </>
        
    )
};
export default TableView;