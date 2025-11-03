import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
 import Tooltip from '@mui/material/Tooltip';


const FloatingActionButton=()=>{
    
    const AddfabStyle ={mt:28,ml:2,position : "sticky"}

    return(
        <Tooltip title="Add Data">
            <Fab color="primary" aria-label="add" sx={AddfabStyle}>
                <AddIcon />
            </Fab>
        </Tooltip>
    )
}

export default FloatingActionButton;

