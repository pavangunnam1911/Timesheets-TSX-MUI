import { Route,Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import Header from "./Components/Navbar";
import WelcomePage from "./Pages/WelcomePage";
import Count from "./Pages/Count";
import TimesheetTable from "./Components/Timesheettable";
import FloatingActionButton from './Components/Fab';
import CollectDataForm from './Components/DataForm/DataForm';
import { useState } from 'react';
import useLocalStorage from './Hooks/useLocalstorage';
import type { Timesheet } from './Interfaces/Timesheet';

function App() {
  const [open,setOpen] = useState(false);
  const [items, setItems] = useLocalStorage<Timesheet[]>("timesheets", []);

  const handleDialogOpen = () =>{
    setOpen(true);
  };

  const handleDialogClose = () =>{
    setOpen(false);
  };
  
  const handleSave = (item: Timesheet) => {
    setItems(prev => [...prev, item]);
    setOpen(false);
  };

  return (
    <>
    <BrowserRouter>
    <Header></Header>
    <Routes>
      <Route path='/home' element={<WelcomePage items={items} setItems={setItems}/>}></Route>
      <Route path='/progress' element={<TimesheetTable items={items} setItems={setItems}/>}></Route>
      <Route path='/count'element={<Count/>}></Route>
    </Routes>
    <FloatingActionButton onClick={handleDialogOpen}></FloatingActionButton>
    <CollectDataForm open={open} onClose={handleDialogClose} onSave={handleSave}></CollectDataForm>
    </BrowserRouter>
    </>
    
  )
}

export default App;
