import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Link } from "react-router-dom"
import axios from "axios"
import {
    Gauge,
    Settings,
    Car,
    Tag,
    Palette,
    Zap
} from "lucide-react"

const navItems = [
    { label: "Início", to: "/" },
    { label: "Sobre nós", to: "/" },
    { label: "Veículos", to: "/veiculos" },
]

function Estrelas({ nota }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n}>
                    {n <= nota ? "⭐" : "☆"}
                </span>
            ))}
        </div>
    )
}

function Compra() {
    const { id } = useParams()
    const [carro, setCarro] = useState(null)
    const [favorito, setFavorito] = useState(false)
    const [menuAberto, setMenuAberto] = useState(false)
    const [busca, setBusca] = useState("")
    const navigate = useNavigate()
    const location = useLocation()
    const [mostrarAlerta, setMostrarAlerta] = useState(false);

    const handleFavorito = () => {
        const novoEstado = !favorito;
        setFavorito(novoEstado);

        if (novoEstado) {
            setMostrarAlerta(true);
            // Esconde o alerta sozinho depois de 3 segundos
            setTimeout(() => setMostrarAlerta(false), 5000);
        }
    };

    const avaliacoes = [
        { id: 1, nota: 5, comentario: "Perfeito!" },
        { id: 2, nota: 4, comentario: "Muito bom" }
    ]

    useEffect(() => {
        async function buscarCarro() {
            const res = await axios.get(`http://localhost:3000/carros/${id}`)
            setCarro(res.data)
        }

        buscarCarro()
    }, [id])

    if (!carro) return <p>Carregando...</p>

    return (
        <div className="relative min-h-screen bg-black text-white overflow-hidden">
            {/* BACKGROUND */}
            <div className="absolute -left-40 -top-40 w-[400px] h-[400px] bg-purple-700/30 blur-[120px] rounded-full" />
            <div className="absolute -right-40 -bottom-40 w-[400px] h-[400px] bg-fuchsia-500/25 blur-[120px] rounded-full" />
            <div className="absolute right-200 top-150 -bottom-30 w-[300px] h-[300px] bg-fuchsia-500/35 blur-[120px] rounded-full" />
            <div className="absolute -left-70 -top-50 w-[400px] h-[400px] bg-purple-500/30 blur-[100px] rounded-full" />
            <div className="absolute -right-50 -bottom-20 w-[400px] h-[400px] bg-fuchsia-400/25 blur-[120px] rounded-full" />
            <div className="absolute left-1/2 top-1/3 w-[500px] h-[500px] -translate-x-1/2 bg-violet-600/20 blur-[140px] rounded-full" />

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
                                <Link
                                    key={item.label}
                                    to={item.to}
                                    onClick={() => setMenuAberto(false)}
                                    className="rounded-2xl border border-white/8 bg-white/6 px-4 py-3 text-sm font-medium text-purple-400/85 transition hover:border-purple-400/50 hover:text-purple-200"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* CONTEÚDO */}
            <div className="pt-32 px-6 max-w-7xl mx-auto relative">

                {/* GLOW EXTRA DIREITA */}
                <div className="pointer-events-none absolute top-10 right-0 w-[300px] h-[300px] bg-purple-600/30 blur-[120px] rounded-full" />

                {/* 🔹 TOPO */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-15 mt-5">

                    {/* IMAGEM */}
                    <div className="max-w-[400px] h-[450px] shrink-0">
                        <img
                            src={`http://localhost:3000/carros/${carro.imagem}`}
                            className="w-full h-full object-cover rounded-2xl shadow-[0_10px_40px_rgba(100,50,148,0.25)]"
                        />
                    </div>

                    <div className="flex flex-col gap-4 pt-4 relative min-w-[300px]"> {/* Adicionei relative aqui para o favorito */}

                        {/* BOTÃO FAVORITO - Posicionado de forma absoluta para ficar no topo à direita do texto */}
                        <button
                            className="absolute top-0 left-150 flex items-center gap-2 text-sm hover:text-purple-400 transition whitespace-nowrap bg-white/5 py-1 px-3 rounded-lg border border-white/10"
                            onClick={handleFavorito}
                        >
                            {favorito ? "💜" : "🤍"}
                            <span className="hidden lg:inline">adicionar como favorito</span>
                            {mostrarAlerta && (
                                <div className="fixed bottom-10 right-10 z-[100] animate-bounce">
                                    <div className="bg-white text-black px-6 py-3 rounded-2xl shadow-2xl border border-purple-700 flex items-center gap-3">
                                        <span className="text-xl">💜</span>
                                        <span className="font-bold">Salvo em favoritos!</span>
                                    </div>
                                </div>
                            )}
                        </button>

                        <h1 className="text-4xl font-bold">
                            {carro.marca}
                        </h1>

                        <div className="space-y-1">
                            <p className="text-white/80 text-xl font-medium">{carro.modelo}</p>
                            <p className="text-white/80">{carro.ano}</p>
                            <p className="text-white/80 max-w-md italic">"{carro.descricao}"</p>
                        </div>

                        {/* LISTA DE ESPECIFICAÇÕES - ÍCONE AO LADO DO TEXTO */}
                        <div className="grid gap-3 mt-2">
                            <div className="flex items-center gap-3">
                                <Gauge className="text-purple-400 w-5 h-5" />
                                <p>Quilometragem: {carro.quilometragem} km</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Settings className="text-purple-400 w-5 h-5" />
                                <p>Motor: {carro.motor}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Car className="text-purple-400 w-5 h-5" />
                                <p>Câmbio: {carro.cambio}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Tag className="text-purple-400 w-5 h-5" />
                                <p>Categoria: {carro.categoria}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Palette className="text-purple-400 w-5 h-5" />
                                <p>Cor: {carro.cor}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <Zap className="text-purple-400 w-5 h-5" />
                                <p>Velocidade Máx: {carro.velocidade_max}</p>
                            </div>
                        </div>

                        {/* PREÇO E BOTÃO COMPRAR */}
                        <div className="flex gap-3 flex-wrap mt-4">
                            <span className="bg-purple-600 px-6 py-2 rounded-full text-sm font-semibold">
                                R$ {Number(carro.preco).toLocaleString("pt-BR")}
                            </span>
                            <span className="bg-purple-500/30 border border-purple-500/50 px-6 py-2 rounded-full text-sm font-semibold">
                                Parcelado
                            </span>
                        </div>

                        <button className="bg-white text-black px-8 py-3 rounded-full w-fit mt-2 hover:scale-105 transition font-bold shadow-lg">
                            Comprar agora
                        </button>


                    </div>
                </div>

                {/* DIREITA */}
                <div>
                    <h2 className="text-xl mb-4">Avaliações</h2>
                    <div className="flex flex-col gap-3">
                        {avaliacoes.map(av => (
                            <div key={av.id} className="bg-white/5 p-4 rounded-xl backdrop-blur-md border border-white/10">
                                <Estrelas nota={av.nota} />
                                <p>{av.comentario}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </div>

    )
}

export default Compra