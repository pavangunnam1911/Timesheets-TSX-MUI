import { Box, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField, Typography} from "@mui/material";
import React from "react";

interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value:boolean) => void;
}


const CollectDataForm:React.FC<SimpleDialogProps> = (prop) => {
    
    return(
        <>
        <Dialog open={prop.open}>
            <DialogTitle>
            Add Your Entry
            </DialogTitle>
            <DialogContent>
                <Stack direction={"row"} gap={3} sx={{mt:2}}>
                    <TextField required variant="outlined" label="Name" name="name"></TextField>
                    <FormControlLabel control={<Switch />} label="Leave" />
                </Stack>
                <Stack  sx={{mt:2}}>
                    <TextField required variant="outlined"  name="date" type="date"></TextField>
                </Stack>
                    
                <Stack direction={"row"} gap={3} sx={{mt:2}}>
                    <Box>
                        <Typography>Login Time</Typography>
                        <TextField variant="outlined"  name="loginTime" type="time"></TextField>
                    </Box>
                    <Box>
                        <Typography>Login Out</Typography>
                        <TextField variant="outlined"  name="logoutTime" type="time"></TextField>
                    </Box>
                </Stack>
                <Stack direction={"row"} gap={3} sx={{mt:2}}>
                    <TextField variant="outlined" label="Project" name="project"></TextField>
                    <TextField variant="outlined" label="Task" name="task"></TextField>
                </Stack>
                <Stack  gap={3} sx={{mt:2}}>
                    <TextField required variant="outlined" label="Description" name="description" multiline rows={4} ></TextField>
                </Stack>
                <Stack direction={"row"} gap={3} sx={{mt:2}}>
                    <TextField variant="outlined" label="Priority" name="priority"></TextField>
                    <TextField variant="outlined" label="Status" name="status"></TextField>
                </Stack>
                <Stack gap={3} sx={{mt:2}}>
                    <TextField variant="outlined" label="Leaves" name="Leaves" type="number"></TextField>
                </Stack>
                
            </DialogContent>
            <DialogActions>
                <button>Submit</button>
                <button>Cancel</button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default CollectDataForm;