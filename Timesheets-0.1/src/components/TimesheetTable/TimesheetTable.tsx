import React, { useState } from "react";
import {Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,IconButton,Dialog,DialogTitle,DialogActions,Button,Box,Checkbox,Menu,MenuItem} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as XLSX from "xlsx";
import type { Timesheet } from "../../types/Timesheet";
import type { ITableProps } from "./ITableProps"; 
import { theme } from "../../theme"; 
import dayjs from "dayjs";

const TimesheetTable: React.FC<ITableProps> = ({ data, onEdit, onDelete }) => {
  const [selected, setSelected] = useState<Timesheet | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [anchor,setanchor] = useState<null|HTMLElement>(null);
  const [menuRow, setMenuRow]= useState<Timesheet|null>(null);

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
      Project: row.project,
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

  const isAllSelected = data.length > 0 && selectedIds.length === data.length;

  const handleSelectAll = (e:React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(data.map((row)=>row.id));
    else setSelectedIds([]);
  };

  const handleSelectedOne = (id:string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev,id]);
  };

  const calculateHours = (login:string , logout:string) => {
    const start = dayjs(login,"HH:mm");
    const end = dayjs(logout, "HH:mm");
    const diff = end.diff(start, "hour" , true);
    return diff > 0 ? diff.toFixed(2) : "0";
  };

  const handleMenuOpen = (event:React.MouseEvent<HTMLElement>,row : Timesheet) =>{
    setanchor(event.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose =()=>{
    setanchor(null);
    setMenuRow(null);
  };

  const handleEdit = () => {
    if(menuRow) onEdit(menuRow);
    handleMenuClose();
  };

  const handleDelete = () =>{
    if(menuRow) onDelete(menuRow.id);
    handleMenuClose();
  }

  if (data.length === 0)
    return (
      <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
        No timesheet entries found. Click the "+" button to add one!
      </Paper>
    );


  return (
    <>
      
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button  variant="contained" color="error" sx={{mr:2}} disabled={selectedIds.length === 0} onClick={() => setShowConfirm(true)}>
          Delete
        </Button>
        <Button variant="contained" color="secondary" startIcon={<FileDownloadIcon />} onClick={handleDownload}>
          Download Excel
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
            <TableRow>
              <TableCell >
                <Checkbox color="default" checked={isAllSelected} indeterminate={selectedIds.length > 0 && selectedIds.length<data.length} onChange={handleSelectAll}/>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Login</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Logout</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Project Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Task</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Hours Spent</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox checked={selectedIds.includes(row.id)} onChange={()=>handleSelectedOne(row.id)}/>
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.loginTime}</TableCell>
                <TableCell>{row.logoutTime}</TableCell>
                <TableCell>{row.project}</TableCell>
                <TableCell>{row.task}</TableCell>
                <TableCell sx={getPriorityColor(row.priority)}>
                  {row.priority}
                </TableCell>
                <TableCell>
                  {calculateHours(row.loginTime,row.logoutTime)}
                </TableCell>
                <TableCell sx={getStatusStyle(row.status)}>
                  {row.status}
                </TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e,row)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchor}
                    open={Boolean(anchor)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleEdit}>
                      <EditIcon fontSize="small" sx={{ mr: 1 }} />
                      Edit
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                      <DeleteIcon fontSize="small" sx={{ mr: 1 }} color="error" />
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selected && (
        <Dialog open={!!selected} onClose={() => setSelected(null)} fullWidth  sx={{}}>
          <DialogTitle sx={{ml:10}}> Employee : {selected.name} <br/>Project : {selected.project}</DialogTitle>
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
            selectedIds.forEach((id) => onDelete(id));
            setSelectedIds([]);
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
