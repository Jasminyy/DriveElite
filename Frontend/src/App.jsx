import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Veiculos from "./components/Veiculos"
import Compra from "./components/Compra"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/compra/:id" element={<Compra />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App