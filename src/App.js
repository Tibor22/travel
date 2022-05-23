import Home from './pages/Home/Home.js'
import Header from './components/Header/Header.js'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './App.css';

function App() {
  return (

    <BrowserRouter>
       <Header/>
    <Routes>
      <Route path="/" element={<Home/>}/>
    </Routes>
    </BrowserRouter>

  );
}

export default App;
