import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Veiculos from "./components/Veiculos"
import Compra from "./components/Compra"
import Login from "./components/Login"
import Cadastro from "./components/Cadastro"
import Perfil from "./components/Perfil"
import Register from "./components/Register"


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/compra/:id" element={<Compra />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />}/>
        <Route path="perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App