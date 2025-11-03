import React, { useState, useMemo } from "react";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,IconButton, Dialog, DialogTitle, DialogActions, Button, Box, Checkbox, Menu,MenuItem, Card, CardActions, CardContent, Typography, DialogContent,List, ListItemButton} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import InsightsIcon from "@mui/icons-material/Insights";
import type { Timesheet } from "../../Interfaces/Timesheet";
import type { ITableProps } from "./interface";
import { theme } from "../../theme";
import "./styles.module.css";

const TimesheetTable: React.FC<ITableProps> = (prop) => {
  const [selected, setSelected] = useState<Timesheet | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [menuRow, setMenuRow] = useState<Timesheet | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Timesheet | null>(null);
  const [openSummary, setOpenSummary] = useState(false);
  const [summaryTitle, setSummaryTitle] = useState("");
  const [summaryData, setSummaryData] = useState<Record<string, number>>({});
  const [summaryType, setSummaryType] = useState<"year" | "month" | "day" | null>(null);
  const [filterKey, setFilterKey] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"year" | "month" | "day" | null>(null);

  const filteredData = useMemo(() => {
    if (!filterKey || !filterType) return prop.data;
    return prop.data.filter((row) => {
      const date = dayjs(row.date);
      if (filterType === "year") return date.year().toString() === filterKey;
      if (filterType === "month") return date.format("MMM YYYY") === filterKey;
      if (filterType === "day") return date.format("DD MMM YYYY") === filterKey;
      return true;
    });
  }, [prop.data, filterKey, filterType]);

  const getPriorityColor = (priority: Timesheet["priority"]) => {
    switch (priority) {
      case "High": return { color: "red", fontWeight: 600 };
      case "Medium": return { color: "orange" };
      case "Low": return { color: "green" };
      default: return {};
    }
  };

  const getStatusStyle = (status: Timesheet["status"]) => {
    switch (status) {
      case "Completed": return { color: "green", fontWeight: 600 };
      case "Pending": return { color: "gray", fontStyle: "italic" };
      default: return {};
    }
  };
  
  const handleDownload = () => {
    if (filteredData.length === 0) {
      alert("No data to export.");
      return;
    }
    const exportData = filteredData.map((row) => ({
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

  const isAllSelected = filteredData.length > 0 && selectedIds.length === filteredData.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedIds(filteredData.map((row) => row.id));
    else setSelectedIds([]);
  };

  const handleSelectedOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const calculateHours = (login: string, logout: string) => {
    const start = dayjs(`1970-01-01T${login}`);
    const end = dayjs(`1970-01-01T${logout}`);
    const diff = end.diff(start, "minute") / 60;
    return diff > 0 ? diff.toFixed(1) : "0.00";
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, row: Timesheet) => {
    setAnchor(e.currentTarget);
    setMenuRow(row);
  };

  const handleMenuClose = () => {
    setAnchor(null);
    setMenuRow(null);
  };

  const handleEdit = () => {
    if (menuRow) prop.onEdit(menuRow);
    handleMenuClose();
  };

  const handleDelete = () => {
    if (menuRow) {
      setDeleteTarget(menuRow);
      setShowConfirm(true);
    }
    handleMenuClose();
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      prop.onDelete(deleteTarget.id);
      setDeleteTarget(null);
    } else if (selectedIds.length > 0) {
      selectedIds.forEach((id) => prop.onDelete(id));
      setSelectedIds([]);
    }
    setShowConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setDeleteTarget(null);
  };

  const openSummaryDialog = (
    title: string,
    data: Record<string, number>,
    type: "year" | "month" | "day"
  ) => {
    setSummaryTitle(title);
    setSummaryData(data);
    setSummaryType(type);
    setOpenSummary(true);
  };

  const handleYearWise = () => {
    const grouped = prop.data.reduce((acc, curr) => {
      const year = dayjs(curr.date).year();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    openSummaryDialog("Year-wise Projects", grouped, "year");
  };

  const handleMonthWise = () => {
    const grouped = prop.data.reduce((acc, curr) => {
      const month = dayjs(curr.date).format("MMM YYYY");
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    openSummaryDialog("Month-wise Projects", grouped, "month");
  };

  const handleDaywise = () => {
    const grouped = prop.data.reduce((acc, curr) => {
      const day = dayjs(curr.date).format("DD MMM YYYY");
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    openSummaryDialog("Day-wise Projects", grouped, "day");
  };

  const handleFilterFromSummary = (key: string) => {
    setFilterKey(key);
    setFilterType(summaryType);
    setOpenSummary(false);
  };

  const clearFilter = () => {
    setFilterKey(null);
    setFilterType(null);
  };

  if (prop.data.length === 0)
    return (
      <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
        No timesheet entries found. Click the "+" button to add one!
      </Paper>
    );

  return (
    <>
      {filterKey && (
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography sx={{ ml: 2 }}>
            Showing records for {filterType}: <b>{filterKey}</b>
          </Typography>
          <Button color="secondary" onClick={clearFilter} sx={{ mr: 2 }}>
            Clear Filter
          </Button>
        </Box>
      )}

      <Card sx={{ display: "flex", justifyContent: "space-around", mb: 2, p: 2 }}>
        <Card onClick={handleYearWise} sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ color: "text.secondary", fontSize: 14, fontFamily: "fantasy", mr: 2 }}>
                Year Wise Projects
              </Typography>
              <InsightsIcon />
            </Box>
          </CardContent>
          <CardActions><Button size="small">View</Button></CardActions>
        </Card>

        <Card onClick={handleMonthWise} sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ color: "text.secondary", fontSize: 14, fontFamily: "fantasy", mr: 2 }}>
                Month Wise Projects
              </Typography>
              <InsightsIcon />
            </Box>
          </CardContent>
          <CardActions><Button size="small">View</Button></CardActions>
        </Card>

        <Card onClick={handleDaywise} sx={{ cursor: "pointer", "&:hover": { backgroundColor: "#f5f5f5" } }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography sx={{ color: "text.secondary", fontSize: 14, fontFamily: "fantasy", mr: 2 }}>
                Day Wise Projects
              </Typography>
              <InsightsIcon />
            </Box>
          </CardContent>
          <CardActions><Button size="small">View</Button></CardActions>
        </Card>
      </Card>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" color="error" sx={{ mr: 2 }} disabled={selectedIds.length === 0} onClick={() => setShowConfirm(true)}>
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
              <TableCell>
                <Checkbox color="default" checked={isAllSelected} indeterminate={selectedIds.length > 0 && selectedIds.length < filteredData.length} onChange={handleSelectAll} />
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Login</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Logout</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Project</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Task</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Hours</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox checked={selectedIds.includes(row.id)} onChange={() => handleSelectedOne(row.id)} />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{dayjs(row.date).format("DD MMM YYYY")}</TableCell>
                <TableCell>{row.loginTime}</TableCell>
                <TableCell>{row.logoutTime}</TableCell>
                <TableCell>{row.project}</TableCell>
                <TableCell>{row.task}</TableCell>
                <TableCell sx={getPriorityColor(row.priority)}>{row.priority}</TableCell>
                <TableCell>{calculateHours(row.loginTime, row.logoutTime)} Hrs</TableCell>
                <TableCell sx={getStatusStyle(row.status)}>{row.status}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={handleMenuClose}>
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

      <Dialog open={showConfirm} onClose={handleCancelDelete}>
        <DialogTitle>{deleteTarget ? `Confirm to delete "${deleteTarget.name}"?` : "Confirm Delete?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSummary} onClose={() => setOpenSummary(false)} fullWidth maxWidth="sm">
        <DialogTitle>{summaryTitle}</DialogTitle>
        <DialogContent>
          {Object.keys(summaryData).length === 0 ? (
            <Typography>No records available.</Typography>
          ) : (
            Object.entries(summaryData).map(([key, value]) => (
              <ListItemButton key={key} onClick={() => handleFilterFromSummary(key)}>
                <Typography sx={{ flexGrow: 1 }}>{key}</Typography>
                <Typography color="primary" fontWeight={600}>{value}</Typography>
              </ListItemButton>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSummary(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TimesheetTable;
