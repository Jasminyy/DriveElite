import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Veiculos from "./components/Veiculos"
import Compra from "./components/Compra"
import Login from "./components/Login"
import Register from "./components/Register"
import Perfil from "./components/Perfil"
import Pagamento from "./components/Pagamento"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/compra/:id" element={<Compra />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/pagamento/:id" element={<Pagamento />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App