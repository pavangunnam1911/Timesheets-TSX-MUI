import {Typography } from "@mui/material";

const Welcomepage = () =>{
    const welcomeMessageStyle={ mt:30,textAlign:"center", flexGrow: 1, fontWeight: 600, };

    return(
    <Typography variant="h3" color="error" sx={welcomeMessageStyle}>
        Welcome To Employee Time Sheets
    </Typography>
    )
}

export default Welcomepage;