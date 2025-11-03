import { useState, useMemo } from "react";
import {Card,Typography,CardContent,CardActions,Button,Dialog,DialogTitle,DialogContent,Table,TableHead,TableRow,TableCell,TableBody,} from "@mui/material";
import Groups2Icon from "@mui/icons-material/Groups2";
import type { Timesheet } from "../Interfaces/Timesheet";
import "./Employeecards.css";

interface IEmployeeCardsProps {
  data: Timesheet[];
  leaves: Timesheet[];
}

const EmployeeCards: React.FC<IEmployeeCardsProps> = ({ data, leaves }) => {
  const [open, setOpen] = useState(false);
  const [viewType, setViewType] = useState<"all" | "office" | "leave" | null>(null);

  const totalEmployees = useMemo(() => {
    const unique = new Set([...data.map((d) => d.name), ...leaves.map((l) => l.name)]);
    return unique.size;
  }, [data, leaves]);

  const peopleOnLeave = useMemo(() => leaves.length, [leaves]);
  const peopleInOffice = useMemo(() => totalEmployees - peopleOnLeave, [totalEmployees, peopleOnLeave]);

  const handleOpen = (type: "all" | "office" | "leave") => {
    setViewType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setViewType(null);
  };

  const getFilteredData = () => {
    if (viewType === "leave") return leaves;
    if (viewType === "office") return data;
    return [...data, ...leaves];
  };

  return (
    <div className="employeeCard">
      <Card>
        <CardContent sx={{ height: 150 }}>
          <Typography variant="h5" color="primary" fontWeight={600}>
            Total Employees
          </Typography>
          <Typography variant="h4" color="text.secondary" fontWeight={700}>
            {totalEmployees}
          </Typography>
          <Groups2Icon color="primary" fontSize="large" />
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => handleOpen("all")}>View</Button>
        </CardActions>
      </Card>

      <Card>
        <CardContent sx={{ height: 150 }}>
          <Typography variant="h5" color="primary" fontWeight={600}>
            People in Office
          </Typography>
          <Typography variant="h4" color="text.secondary" fontWeight={700}>
            {peopleInOffice}
          </Typography>
          <Groups2Icon color="success" fontSize="large" />
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => handleOpen("office")}>View</Button>
        </CardActions>
      </Card>

      <Card>
        <CardContent sx={{ height: 150 }}>
          <Typography variant="h5" color="primary" fontWeight={600}>
            People on Leave
          </Typography>
          <Typography variant="h4" color="text.secondary" fontWeight={700}>
            {peopleOnLeave}
          </Typography>
          <Groups2Icon color="error" fontSize="large" />
        </CardContent>
        <CardActions>
          <Button size="small" onClick={() => handleOpen("leave")}>View</Button>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {viewType === "all" ? "All Employees" : viewType === "office" ? "Employees in Office" : "Employees on Leave"}
        </DialogTitle>
        <DialogContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredData().map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.date}</TableCell>
                  <TableCell>{emp.project}</TableCell>
                  <TableCell>{emp.status}</TableCell>
                </TableRow>
              ))}
              {getFilteredData().length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No records found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeCards;
