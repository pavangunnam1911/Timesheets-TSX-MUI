import React, { useState } from "react";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import type { IFabMenuProps } from "./interface"; 

const FabMenu: React.FC<IFabMenuProps> = (prop) => {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: <AddIcon />, name: "Add Entry", action: prop.onAdd },
    { icon: <CalendarMonthIcon />, name: "Calendar", action: prop.onViewCalendar },
  ];

  return (
    <Box sx={{ position: "fixed", bottom: 24, right: 24 }}>
      <SpeedDial ariaLabel="Timesheet Actions" icon={<SpeedDialIcon />} onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} direction="up" >
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
