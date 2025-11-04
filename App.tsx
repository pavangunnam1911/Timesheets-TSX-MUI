import { Route,Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import Header from "./Components/Navbar";
import WelcomePage from "./Pages/WelcomePage";
import Count from "./Pages/Count";
import TimesheetTable from "./Components/Timesheettable";
import FloatingActionButton from './Components/Fab';
import CollectDataForm from './Components/DataForm/DataForm';
import { useState } from 'react';
function App() {
  const [open,setOpen] = useState(false);
  const [selectedValue,setSelectedValue] = useState('');

  const handleDialogOpen = () =>{
    setOpen(true);
  };

  const handleDialogClose = (value:boolean) =>{
    setOpen(false);
  };

  return (
    <>
    <BrowserRouter>
    <Header></Header>
    <Routes>
      <Route path='/home' element={<WelcomePage/>}></Route>
      <Route path='/progress' element={<TimesheetTable/>}></Route>
      <Route path='/count'element={<Count/>}></Route>
    </Routes>
    <FloatingActionButton onClick={handleDialogOpen}></FloatingActionButton>
    <CollectDataForm open={open} selectedValue={selectedValue} onClose={handleDialogClose}></CollectDataForm>
    </BrowserRouter>
    </>
    
  )
}

export default App;
