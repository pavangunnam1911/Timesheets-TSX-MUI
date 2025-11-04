import  {  Fab, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

interface FabProps {
    onClick?: () => void;
}

const FloatingActionButton:React.FC<FabProps> = (prop) =>{

    const FabStyle = {position:"fixed",bottom:16,left:16}
    return(
        <Tooltip title="Add Data">
            <Fab color="primary" sx={FabStyle} onClick={prop.onClick}>
                <AddIcon/>
            </Fab>
        </Tooltip>

    );

};

export default FloatingActionButton;