import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./components/Home"
import Veiculos from "./components/Veiculos"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/veiculos" element={<Veiculos />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App