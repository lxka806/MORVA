import { Routes, Route } from "react-router-dom"

import Home from "./page/Home"
import Learning from "./page/Learning"
import Lesson from "./page/Lesson"
import LiderBoard from "./page/LiderBoard"
import Login from "./page/Login"
import Register from "./page/Register"
import Words from "./page/Words"
import Profile from "./page/Profile"
import Translate from "./page/Translate"
import About from "./page/About"

import NavBar from "./components/NavBar"

function App() {
    return (  
        <>  
            <NavBar/> 
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/learning" element={<Learning />} />
                    <Route path="/learning/lesson/:id" element={<Lesson />} />
                    <Route path="/liderBoard" element={<LiderBoard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/words" element={<Words />} />
                    <Route path="/translate" element={<Translate />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/about" element={<About />} />
                </Routes>
        </>
    );
}

export default App;