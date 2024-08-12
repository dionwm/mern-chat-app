import "./App.css";
import { Route, Routes } from "react-router-dom";

// Components
import Home from "./Pages/Home";
import Chats from "./Pages/Chats";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} exact />
        <Route path="/chats" component={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;
