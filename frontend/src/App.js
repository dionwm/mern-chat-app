import "./App.css";
import { Route, Routes } from "react-router-dom";

// Components
import Home from "./Pages/Home";
import Chats from "./Pages/Chats";
import NavBar from "./components/NavBar/NavBar";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;
