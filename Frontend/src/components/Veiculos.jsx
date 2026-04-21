import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import axios from "axios"

const navItems = [
  { label: "Início", to: "/" },
  { label: "Sobre nós", to: "/" },
  { label: "Veículos", to: "/veiculos" },
]

function Veiculos() {
  const [carros, setCarros] = useState([])
  const [menuAberto, setMenuAberto] = useState(false)
  const location = useLocation()
  const [filtrosMobile, setFiltrosMobile] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const buscaURL = params.get("busca")

    if (buscaURL) {
      setBusca(buscaURL)
    }
  }, [location.search])

  const [filtros, setFiltros] = useState({
    ordem: "",
    categoria: ""
  })

  const [busca, setBusca] = useState("")

  useEffect(() => {
    buscarCarros()
  }, [filtros, busca])

  async function buscarCarros() {
    try {
      const res = await axios.get("http://localhost:3000/carros", {
        params: {
          ...filtros,
          busca: busca || undefined
        }
      })

      setCarros(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* FUNDO GLOW */}
      <div className="pointer-events-none absolute z-0 -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-purple-700/30 blur-[120px]" />
      <div className="pointer-events-none absolute z-0 -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-fuchsia-500/25 blur-[120px]" />
      <div className="pointer-events-none absolute z-0 left-1/2 top-1/3 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[140px]" />

      {/* NAVBAR */}

      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-850/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#inicio" className="shrink-0">
            <img className="w-[102px] sm:w-[125px] lg:w-[146px]" src="/DriveEliteLogo.png" alt="Drive Elite" />
          </a>

          <div className="hidden md:flex md:flex-1 md:items-center md:justify-center md:gap-8 font-poppins">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-base font-semibold tracking-wide text-purple-400/75 transition hover:text-purple-400"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-2 shadow-[0_0_30px_rgba(88,28,135,0.18)] sm:flex">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 text-purple-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                placeholder="Buscar veículos"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-28 bg-transparent text-sm text-white outline-none placeholder:text-white/40 md:w-40 lg:w-56"
              />
            </div>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 transition hover:border-purple-400/50 hover:bg-white/12"
              aria-label="Abrir perfil"
            >
              <img className="h-5 w-5 object-contain" src="/ProfileUser.svg" alt="Perfil" />
            </button>

            <button
              type="button"
              className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-full border border-white/10 bg-white/8 md:hidden"
              aria-label="Abrir menu"
              aria-expanded={menuAberto}
              onClick={() => setMenuAberto((prev) => !prev)}
            >
              <span className={`h-0.5 w-5 rounded-full bg-white transition ${menuAberto ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`h-0.5 w-5 rounded-full bg-white transition ${menuAberto ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-5 rounded-full bg-white transition ${menuAberto ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {menuAberto && (
          <div className="border-t border-white/10 bg-slate-900/40 px-4 py-4 md:hidden">
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-3 py-2">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 text-purple-200"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <input
                type="search"
                placeholder="Buscar veículos"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-28 bg-transparent text-sm text-white outline-none placeholder:text-white/40 md:w-40 lg:w-56"
              />
            </div>

            <div className="flex flex-col gap-2 font-poppins">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuAberto(false)}
                  className="rounded-2xl border border-white/8 bg-white/6 px-4 py-3 text-sm font-medium text-purple-400/85 transition hover:border-purple-400/50 hover:text-purple-200"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* CONTEÚDO */}
      <div className="pt-28 flex flex-col md:flex-row">

        {/* HEADER MOBILE */}
        <div className="md:hidden flex justify-between items-center px-4">
          <button
            onClick={() => setFiltrosMobile(true)}
            className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg"
          >
            ☰ Filtros
          </button>

          <span className="text-sm text-gray-400">
            {carros.length} resultados
          </span>
        </div>

        {/* SIDEBAR DESKTOP */}
        <div className="hidden md:block w-64 p-5 border-r border-white/10">

          <h2 className="font-bold mb-4">Filtros</h2>

          {/* PREÇO */}
          <p className="text-purple-300 mb-2">Preço</p>

          {["maior_preco", "menor_preco"].map(tipo => {
            const ativo = filtros.ordem === tipo

            return (
              <div
                key={tipo}
                onClick={() =>
                  setFiltros(prev => ({
                    ...prev,
                    ordem: prev.ordem === tipo ? "" : tipo
                  }))
                }
                className="flex items-center gap-2 cursor-pointer mb-2"
              >
                <div className={`w-4 h-4 border rounded-sm flex items-center justify-center
                ${ativo ? "border-purple-500 bg-purple-500/20" : "border-white"}`}>

                  {ativo && <div className="w-2 h-2 bg-purple-500"></div>}
                </div>

                {tipo === "maior_preco"
                  ? "Maior para menor"
                  : "Menor para maior"}
              </div>
            )
          })}

          {/* CATEGORIA */}
          <p className="text-purple-300 mt-6 mb-2">Categorias</p>

          {["SUV", "Coupe", "Familia", "Eletrico", "Esportivo", "Formula 1"].map(cat => {
            const ativo = filtros.categoria === cat

            return (
              <div
                key={cat}
                onClick={() =>
                  setFiltros(prev => ({
                    ...prev,
                    categoria: ativo ? "" : cat
                  }))
                }
                className="flex items-center gap-2 cursor-pointer mb-2"
              >
                <div className={`w-4 h-4 border rounded-sm flex items-center justify-center
                ${ativo ? "border-purple-500 bg-purple-500/20" : "border-white"}`}>

                  {ativo && <div className="w-2 h-2 bg-purple-500"></div>}
                </div>

                {cat}
              </div>
            )
          })}
        </div>

        {/* MENU MOBILE (FULLSCREEN) */}
        {filtrosMobile && (
          <div className="fixed inset-0 z-50 p-6 overflow-y-auto backdrop-blur-xl bg-black/60">

            {/* GLOW ROXO */}
            <div className="absolute -top-32 -left-32 w-[300px] h-[300px] bg-purple-600/30 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-fuchsia-500/20 blur-[120px] rounded-full" />

            {/* CONTEÚDO */}
            <div className="relative z-10">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filtros</h2>
                <button onClick={() => setFiltrosMobile(false)}>✕</button>
              </div>

              {/* PREÇO */}
              <p className="text-purple-300 mb-2">Preço</p>

              {["maior_preco", "menor_preco"].map(tipo => {
                const ativo = filtros.ordem === tipo

                return (
                  <div
                    key={tipo}
                    onClick={() =>
                      setFiltros(prev => ({
                        ...prev,
                        ordem: prev.ordem === tipo ? "" : tipo
                      }))
                    }
                    className="flex items-center gap-2 cursor-pointer mb-2"
                  >
                    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center
                  ${ativo ? "border-purple-500 bg-purple-500/20" : "border-white"}`}>

                      {ativo && <div className="w-2 h-2 bg-purple-500"></div>}
                    </div>

                    {tipo === "maior_preco"
                      ? "Maior para menor"
                      : "Menor para maior"}
                  </div>
                )
              })}

              {/* CATEGORIAS */}
              <p className="text-purple-300 mt-6 mb-2">Categorias</p>

              {["SUV", "Coupe", "Familia", "Eletrico", "Esportivo", "Formula 1"].map(cat => {
                const ativo = filtros.categoria === cat

                return (
                  <div
                    key={cat}
                    onClick={() =>
                      setFiltros(prev => ({
                        ...prev,
                        categoria: ativo ? "" : cat
                      }))
                    }
                    className="flex items-center gap-2 cursor-pointer mb-2"
                  >
                    <div className={`w-4 h-4 border rounded-sm flex items-center justify-center
                  ${ativo ? "border-purple-500 bg-purple-500/20" : "border-white"}`}>

                      {ativo && <div className="w-2 h-2 bg-purple-500"></div>}
                    </div>

                    {cat}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      {/* LISTA DE CARROS */}
      <div className="flex-1 p-6">

        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">

          {/* RESULTADOS (mobile já tem lá em cima, aqui é mais desktop) */}
          <span className="hidden sm:block text-sm text-gray-400">
            {carros.length} resultados
          </span>

          {/* AÇÕES */}
          <div className="flex gap-6 text-sm text-gray-300 justify-end">
            <button className="hover:text-white font-semibold">
              Localizar Compra
            </button>

            <button className="hover:text-white font-semibold">
              Favoritos
            </button>
          </div>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {carros.map(carro => (
            <div
              key={carro.id}
              className="bg-white/10 p-4 rounded-xl hover:scale-105 transition"
            >
              <img
                src={`/carros/${carro.imagem}`}
                className="w-full h-48 object-cover rounded"
              />

              <h3 className="mt-2 font-bold">
                {carro.marca} {carro.modelo}
              </h3>

              <p className="text-purple-400">
                R$ {Number(carro.preco).toLocaleString("pt-BR")}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
    </div >
      )
}
export default Veiculos