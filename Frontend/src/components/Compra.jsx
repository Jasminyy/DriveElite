import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Heart } from "lucide-react"
import { addFavorito } from "../services/favoritos"
import axios from "axios"

import UserAvatar from "./UserAvatar"
import { isAuthenticated } from "../services/api.js"

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
    const navigate = useNavigate()
    const [carro, setCarro] = useState(null)
    const [favorito, setFavorito] = useState(false)
    const [menuAberto, setMenuAberto] = useState(false)
    const [busca, setBusca] = useState("")
    const [mostrarAlerta, setMostrarAlerta] = useState(false);
    const [popupFavoritoCarro, setPopupFavoritoCarro] = useState(null);

    const getCarImageUrl = (imagem) =>
      imagem?.startsWith("http")
        ? imagem
        : `http://localhost:3000/carros/${imagem}`
    const avaliacoes = [
        {
            id: 1,
            nome: "Lucas",
            nota: 5,
            comentario: "Perfeito! Melhor carro que já dirigi.",
            foto: "https://i.pravatar.cc/150?img=11"
        },
        {
            id: 2,
            nome: "Mariana",
            nota: 4,
            comentario: "Muito bom, acabamento impecável.",
            foto: "https://i.pravatar.cc/150?img=32"
        },
        {
            id: 3,
            nome: "Pedro",
            nota: 5,
            comentario: "Experiência absurda, recomendo.",
            foto: "https://i.pravatar.cc/150?img=15"
        },
        {
            id: 4,
            nome: "Fernanda",
            nota: 5,
            comentario: "Luxo e potência em outro nível.",
            foto: "https://i.pravatar.cc/150?img=45"
        }
    ]

    /* ===============================
       4️⃣ STATES DAS AVALIAÇÕES
    =============================== */
    const [listaAvaliacoes, setListaAvaliacoes] =
        useState(avaliacoes)

    const [indexAtual, setIndexAtual] =
        useState(0)

    const [novaAvaliacao, setNovaAvaliacao] = useState({
        nome: "",
        comentario: "",
        nota: "5",
        foto: ""
    })

    /* ===============================
       5️⃣ FUNÇÕES
    =============================== */

    async function handleFavorito() {

    if (!isAuthenticated()) {
        navigate("/login")
        return
    }

    try {

        await addFavorito(carro.id)

        setFavorito(true)
        setPopupFavoritoCarro(carro)

        setMostrarAlerta(true)

        setTimeout(() => {
            setMostrarAlerta(false)
        }, 4000)

    } catch (error) {
        console.error(error)
        if (error.response && error.response.status === 401) {
            // Token inválido ou expirado - redirecionar para login
            navigate('/login')
            return
        }
    }
}

    function adicionarComentario() {
        if (!novaAvaliacao.nome.trim()) return
        if (!novaAvaliacao.comentario.trim()) return

        const nova = {
            id: Date.now(),
            nome: novaAvaliacao.nome,
            comentario: novaAvaliacao.comentario,
            foto: novaAvaliacao.foto || "https://i.pravatar.cc/150?img=12",
            nota: Number(novaAvaliacao.nota)
        }

        setListaAvaliacoes(prev => [...prev, nova])

        setNovaAvaliacao({
            nome: "",
            comentario: "",
            foto: "",
            nota: "5"
        })
    }

    /* ===============================
       6️⃣ EFFECTS
    =============================== */

    /* buscar carro */
    useEffect(() => {

        async function buscarCarro() {

            const res = await axios.get(
                `http://localhost:3000/carros/${id}`
            )

            setCarro(res.data)
        }

        buscarCarro()

    }, [id])



    /* autoplay carrossel */
    useEffect(() => {

        const timer = setInterval(() => {

            setIndexAtual((prev) =>
                prev === listaAvaliacoes.length - 1
                    ? 0
                    : prev + 1
            )

        }, 2500)

        return () => clearInterval(timer)

    }, [listaAvaliacoes])

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
                            onClick={() => navigate("/perfil")}
                        >
                            <UserAvatar />
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
                <div className="flex flex-col xl:flex-row gap-10 mt-5">

                    {/* IMAGEM */}
                    <div className="max-w-[300px] h-[55 0px] shrink-0">
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
                                    <div className="bg-white text-black p-4 rounded-3xl shadow-2xl border border-purple-700 flex items-center gap-3 max-w-xs">
                                        <img
                                          src={getCarImageUrl(popupFavoritoCarro?.imagem)}
                                          alt={popupFavoritoCarro ? `${popupFavoritoCarro.marca} ${popupFavoritoCarro.modelo}` : "Favorito"}
                                          className="h-14 w-14 rounded-3xl object-cover"
                                        />
                                        <div>
                                          <p className="font-bold">Salvo em favoritos!</p>
                                          <p className="text-sm text-black/70">
                                            {popupFavoritoCarro ? `${popupFavoritoCarro.marca} ${popupFavoritoCarro.modelo}` : "Carro adicionado."}
                                          </p>
                                        </div>
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
                        <div className="grid gap-3 ">

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
                        <div className="flex  gap-3 flex-wrap mt-4">
                            <span className="rounded-full border border-white/15 bg-white/7 px-6 py-3 text-sm font-semibold text-white/85 transition hover:border-purple-300/50 hover:text-white">
                                R$ {Number(carro.preco).toLocaleString("pt-BR")}
                            </span>
                            <span className="rounded-full border border-white/15 bg-purple-500/30 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-500/50">
                                Parcelado
                            </span>
                        </div>

                         <button
                            type="button"
                            onClick={() => {
                                if (!isAuthenticated()) {
                                    navigate("/login", { state: { from: `/pagamento/${id}` } })
                                    return
                                }

                                navigate(`/pagamento/${id}`)
                            }}
                            className="bg-white text-black px-8 py-3 rounded-full w-fit mt-2 hover:scale-105 transition font-bold shadow-lg"
                        >
                            Comprar agora
                        </button>

                    </div>
                </div>

                {/* DIREITA */}
                <div className="w-full xl:w-[420px] xl:ml-auto xl:-mt-80 mt-10">

                    <h2 className="text-2xl mb-2  font-bold">
                        Avaliações
                    </h2>

                    <div className="relative h-[200px] flex items-start justify-center overflow-hidden pt-4">

                        {listaAvaliacoes.map((av, i) => {

                            const total = listaAvaliacoes.length

                            const anterior =
                                i === (indexAtual === 0 ? total - 1 : indexAtual - 1)

                            const atual = i === indexAtual

                            const proximo =
                                i === (indexAtual === total - 1 ? 0 : indexAtual + 1)

                            if (!anterior && !atual && !proximo) return null

                            return (
                                <div
                                    key={av.id}
                                    className={`
                        absolute transition-all duration-700 ease-in-out
                        rounded-2xl border border-white/10
                        bg-white/5 backdrop-blur-xl p-5
                        
                        ${atual
                                            ? "scale-110 opacity-100 z-30 w-[270px] translate-x-0 border-purple-500/40"
                                            : ""
                                        }

                        ${anterior
                                            ? "scale-90 opacity-35 z-10 w-[220px] -translate-x-52"
                                            : ""
                                        }

                        ${proximo
                                            ? "scale-90 opacity-35 z-10 w-[220px] translate-x-52"
                                            : ""
                                        }
                    `}
                                >

                                    <div className="flex items-center gap-3 mb-4">

                                        <img
                                            src={av.foto}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />

                                        <div>
                                            <p className="font-semibold">
                                                {av.nome}
                                            </p>

                                            <Estrelas nota={av.nota} />
                                        </div>
                                    </div>

                                    <p className="text-sm text-white/80 leading-relaxed">
                                        {av.comentario}
                                    </p>

                                </div>
                            )
                        })}

                    </div>

                    <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-xl">
                        <h3 className="text-lg font-semibold mb-4">
                            Deixe sua avaliação
                        </h3>

                        <input type="text"
                            placeholder="Seu nome"
                            value={novaAvaliacao.nome}
                            onChange={(e) =>
                                setNovaAvaliacao({
                                    ...novaAvaliacao,
                                    nome: e.target.value
                                })
                            }

                            className="w-full mb-3 px-4 py-3 rounded-xl bg-black/30 outline-none border border-white/10"
                        />

                        <textarea
                            placeholder="Comentário"
                            value={novaAvaliacao.comentario}
                            onChange={(e) =>
                                setNovaAvaliacao({
                                    ...novaAvaliacao,
                                    comentario: e.target.value
                                })
                            }
                            className="w-full mb-3 px-4 py-3 rounded-xl bg-black/30 outline-none border border-white/10 h-[120px]"
                        />

                        <select
                            value={novaAvaliacao.nota}
                            onChange={(e) =>
                                setNovaAvaliacao({
                                    ...novaAvaliacao,
                                    nota: e.target.value
                                })
                            }
                            className="w-full mb-4 px-4 py-3 rounded-xl bg-black/30 outline-none border border-white/10"
                        >
                            <option value="5">5 estrelas</option>
                            <option value="4">4 estrelas</option>
                            <option value="3">3 estrelas</option>
                            <option value="2">2 estrelas</option>
                            <option value="1">1 estrela</option>
                        </select>

                        <button
                            onClick={adicionarComentario}
                            className="w-full rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 py-3 font-semibold hover:scale-[1.03] transition"
                        >
                            Enviar avaliação
                        </button>

                    </div>
                </div>
            </div>


            <footer className="bg-black text-gray-300 mt-2 ">
                {/* Conteúdo principal */}
                <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 ">

                    <div>
                        <h4 className="text-white font-semibold mb-2">Quem Somos</h4>
                        <p className="text-sm">
                            Conheça nossa história, valores e propósito.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-2">Carros</h4>
                        <p className="text-sm">
                            Conheça nossos carros de luxo e descubra um novo mundo.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-2">Trabalhe Conosco</h4>
                        <p className="text-sm">
                            Faça parte do nosso time e cresça junto com a gente.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-2">Sustentabilidade</h4>
                        <p className="text-sm">
                            Compromisso com o meio ambiente e impacto social positivo.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-2">Descubra</h4>
                        <p className="text-sm">
                            Novidades, lançamentos e promoções exclusivas dos nossos veículos.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-2">Contato</h4>
                        <p className="text-sm">
                            <a href="#" className="hover:text-white">TikTok</a> |{" "}
                            <a href="#" className="hover:text-white">Instagram</a> |{" "}
                            <a href="#" className="hover:text-white">WhatsApp</a>
                        </p>
                    </div>
                </div>

                {/* Rodapé inferior */}
                <div className="bg-black text-center py-1 text-sm">
                    <p>&copy; 2025 - Drive Elite. Todos os direitos reservados</p>
                </div>
            </footer>

        </div>

    )
}

export default Compra