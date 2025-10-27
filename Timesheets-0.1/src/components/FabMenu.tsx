import React, { useState } from "react";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import type {FabMenuProps} from "../types/Timesheet";

const FabMenu: React.FC<FabMenuProps> = ({ onAdd, onViewCalendar }) => {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: <AddIcon />, name: "Add Entry", action: onAdd },
    { icon: <CalendarMonthIcon />, name: "Calendar", action: onViewCalendar },
  ];

  return (
    <Box sx={{ position: "fixed", bottom: 24, right: 24 }}>
      <SpeedDial ariaLabel="Timesheet Actions" icon={<SpeedDialIcon />} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} direction="left" >
        {actions.map((act) => (
          <SpeedDialAction key={act.name} icon={act.icon} title={act.name}
            onClick={() => {
              act.action();
              setOpen(false);
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default FabMenu;
