import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router';
import Home from './pages/Home';
import RootLayout from './layout/RootLayout';

import "primereact/resources/themes/saga-blue/theme.css"; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import Conversation from './pages/Conversation';
import Person from './pages/Person';
import Login from './pages/Login';




const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route path='/' element={<Home/>}/>
        <Route path='/agents' element={<Conversation/>}/>
        <Route path='/report/:id' element={<Person/>}/>
      </Route>
      <Route path='/login' element={<Login/>}/>
    </>
  )
);

function App() {
  return (
    <>
        <RouterProvider router={router} />
    </>
  );
}

export default App
