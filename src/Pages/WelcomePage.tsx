import { Typography, Box } from "@mui/material";
import { blue } from "@mui/material/colors";
import React from "react";
import TimesheetTable from "../Components/Timesheettable";
import dayjs from "dayjs";

import type { Timesheet } from "../Interfaces/Timesheet";

interface WelcomePageProps {
  items?: Timesheet[];
  setItems?: (v: Timesheet[] | ((prev: Timesheet[]) => Timesheet[])) => void;
}

const WelcomePage:React.FC<WelcomePageProps> = ({ items, setItems }) =>{

    const welcomeStyle = {fontSize:'48px', fontFamily:"Arial, sans-serif",fontWeight:'bold', textAlign:'center', marginTop:'20px',color: blue[600]};
    const today = dayjs().format("YYYY-MM-DD");
    return(
        <Box>
            <Typography sx={welcomeStyle} >Welcome To Timesheets</Typography>
            <Box sx={{ mt: 4, mx: 2 }}>
                <TimesheetTable hideFilters onlyDate={today} items={items} setItems={setItems} />
            </Box>
        </Box>
    );

};

export default WelcomePage; 