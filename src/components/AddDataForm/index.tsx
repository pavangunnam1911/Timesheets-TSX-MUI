import { Dialog, DialogContent, TextField } from "@mui/material";

interface DataFormprops{
    open:boolean;
}



const AddDataForm:React.FC<DataFormprops> = (props) => {

    

    return(
        <Dialog open={props.open}>
            <DialogContent>
                <TextField>HI</TextField>

            </DialogContent>
        </Dialog>
    );
    
}

export default AddDataForm;