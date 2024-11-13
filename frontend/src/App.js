import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import '../src/css/main.css';
import '../src/css/logIn.css';

import AddClient from './Pages/Add_Client';
import AddProject from './Pages/Add_Project';
import AddContract from './Pages/Add_Contract';
import Dashboard from './Pages/Dashboard';
import PaymentProcessing from './Pages/Payment_Processing'

import LogIn from './Pages/LogIn';
import SignUp from './Pages/SignUp';
import Entity from './Pages/Entity';
import PrivateRouter from './PrivateRoute';
import Clients from './List/Clients';
import Projects from './List/Projects';
import Contracts from './List/Contracts';
import Payments from './List/Payments';
import ItemCategories from './List/Item_Categories';
import AddItemType from './Pages/Add_Item_Type';
import ItemTypes from './List/Item_Types';
import ItemZones from './List/Item_Zones';
import AddItemZone from './Pages/Add_Item_Zone';
import AddItemCategory from './Pages/Add_Item_Category';
import AddItemUnit from './Pages/Add_Item_Unit';
import ItemUnits from './List/Item_Units';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<LogIn />} />
        
        <Route element={<PrivateRouter />}>
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/entity" element={<Entity/>} />
          <Route path="/dashboard/add_client" element={<AddClient />} />
          <Route path="/dashboard/add_project" element={<AddProject />} />
          <Route path="/dashboard/add_contract" element={<AddContract />} />
          <Route path="/dashboard/payment_processing" element={<PaymentProcessing />} />
          <Route path='/dashboard/add_item_category' element={<AddItemCategory/>}/>
          <Route path='/dashboard/add_item_type' element={<AddItemType/>}/>
          <Route path='/dashboard/add_item_zone' element={<AddItemZone/>}/>
          <Route path='/dashboard/add_item_unit' element={<AddItemUnit/>}/>

          <Route path="/dashboard/clients" element={<Clients />} />
          <Route path="/dashboard/projects" element={<Projects />} />
          <Route path='/dashboard/contracts' element={<Contracts/>} />
          <Route path='/dashboard/payments' element={<Payments/>} />
          <Route path='/dashboard/item_categories' element={<ItemCategories/>} />
          <Route path='/dashboard/item_types' element={<ItemTypes/>} />
          <Route path='/dashboard/item_zones' element={<ItemZones/>} />
          <Route path='/dashboard/item_units' element={<ItemUnits/>} />

        </Route>
      </Routes>
    </Router>

  );
}

export default App;
