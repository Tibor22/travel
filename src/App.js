import Home from './pages/Home/Home.js'
import Main from './components/Main/Main.js'
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
      <Route path="/main" element={<Main/>} />
    </Routes>
    </BrowserRouter>

  );
}

export default App;
