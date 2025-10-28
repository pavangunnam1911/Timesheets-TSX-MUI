import React, { useState } from "react";
import {Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,Dialog,DialogTitle,DialogActions,Button,Box,} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import * as XLSX from "xlsx";
import type { Timesheet } from "../../types/Timesheet";
import type { ITableProps } from "./ITableProps"; 
import { theme } from "../../theme"; 

const TimesheetTable: React.FC<ITableProps> = ({ data, onEdit, onDelete }) => {
  const [selected, setSelected] = useState<Timesheet | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const getPriorityColor = (priority: Timesheet["priority"]) => {
    switch (priority) {
      case "High":
        return { color: "red", fontWeight: 600 };
      case "Medium":
        return { color: "orange" };
      case "Low":
        return { color: "green" };
      default:
        return {};
    }
  };

  const getStatusStyle = (status: Timesheet["status"]) => {
    switch (status) {
      case "Completed":
        return { color: "green", fontWeight: 600 };
      case "Pending":
        return { color: "gray", fontStyle: "italic" };
      default:
        return {};
    }
  };

  const handleDownload = () => {
    if (data.length === 0) {
      alert("No data to export.");
      return;
    }

    const exportData = data.map((row) => ({
      Date: row.date,
      Name: row.name,
      Task: row.task,
      "Login Time": row.loginTime,
      "Logout Time": row.logoutTime,
      Priority: row.priority,
      Status: row.status,
      Description: row.description || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Timesheets");
    XLSX.writeFile(workbook, "Timesheets.xlsx");
  };

  if (data.length === 0)
    return (
      <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
        No timesheet entries found. Click the "+" button to add one!
      </Paper>
    );

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" color="secondary" startIcon={<FileDownloadIcon />} onClick={handleDownload}>
          Download Excel
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Actions</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Task</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Login</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Logout</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <IconButton onClick={() => setSelected(row)}>
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.task}</TableCell>
                <TableCell>{row.loginTime}</TableCell>
                <TableCell>{row.logoutTime}</TableCell>
                <TableCell sx={getPriorityColor(row.priority)}>
                  {row.priority}
                </TableCell>
                <TableCell sx={getStatusStyle(row.status)}>
                  {row.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selected && (
        <Dialog open={!!selected} onClose={() => setSelected(null)}>
          <DialogTitle> Employee : {selected.name} <br/>Task : {selected.task}</DialogTitle>
          <DialogActions>
            <Button onClick={() => { onEdit(selected); setSelected(null); }}>Edit</Button>
            <Button color="error" variant="contained" onClick={() => { setSelected(null); setShowConfirm(true);}}> Delete </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={showConfirm} onClose={() => setShowConfirm(false)}>
        <DialogTitle>Confirm Delete?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowConfirm(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => {
              if (selected) onDelete(selected.id);
              setShowConfirm(false);
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TimesheetTable;
