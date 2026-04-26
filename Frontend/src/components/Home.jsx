import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"

const navItems = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre nós", href: "#sobre" },
  { label: "Veiculos", to: "/veiculos" },
]

function Home() {
  const imgRef = useRef(null)
  const [menuAberto, setMenuAberto] = useState(false)
  const [veiculos, setVeiculos] = useState([])
  const [busca, setBusca] = useState("")
  const navigate = useNavigate()
  const location = useLocation()

  // BUSCAR CARROS DO BACKEND
  useEffect(() => {

    fetch("http://localhost:3000/carros")
      .then(res => res.json())
      .then(data => {
        console.log("Carros:", data)
        setVeiculos(data)
      })
      .catch(err => console.error(err))

  }, [])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        setMenuAberto(false)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  function handleMouseMove(e) {
    if (window.innerWidth < 1024) return

    const img = imgRef.current
    if (!img) return

    const rect = img.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const rotateY = (x / rect.width - 0.5) * 20
    const rotateX = (y / rect.height - 0.5) * -20

    img.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
  }

  function handleMouseLeave() {
    const img = imgRef.current
    if (!img) return

    img.style.transform = "rotateX(0deg) rotateY(0deg)"
  }

  const [indexAtivo, setIndexAtivo] = useState(0)

  useEffect(() => {
    if (veiculos.length === 0) return

    const interval = setInterval(() => {
      setIndexAtivo((prev) => prev + 1)
    }, 3000)

    return () => clearInterval(interval)
  }, [veiculos])

  useEffect(() => {
    if (indexAtivo >= veiculos.length) {
      setTimeout(() => {
        setIndexAtivo(0)
      }, 700)
    }
  }, [indexAtivo, veiculos.length])

  const outrosCarros = veiculos.filter(c => c.marca !== "Porsche")
  const veiculosLoop = [...outrosCarros, ...outrosCarros]

  useEffect(() => {
    if (outrosCarros.length === 0) return

    if (indexAtivo >= outrosCarros.length) {
      setTimeout(() => {
        setIndexAtivo(0)
      }, 600)
    }
  }, [indexAtivo, outrosCarros.length])


  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-purple-700/30 blur-[120px] sm:h-[500px] sm:w-[500px] sm:blur-[140px]" />
      <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-fuchsia-500/25 blur-[120px] sm:h-[500px] sm:w-[500px] sm:blur-[140px]" />
      <div className="absolute left-1/2 top-1/3 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[140px] sm:h-[560px] sm:w-[560px]" />

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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/veiculos?busca=${busca}`)
                  }
                }}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    navigate(`/veiculos?busca=${busca}`)
                  }
                }}
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

      <div
        id="inicio"
        className="mx-auto flex min-h-screen max-w-7xl flex-col items-center gap-12 px-4 pb-44 pt-28 sm:px-6 md:pt-32 lg:flex-row lg:gap-2 lg:px-4"
      >
        <div className="max-w-2xl text-center lg:text-left">

          <h1 className="font-garamond text-4xl font-semibold leading-tight text-transparent sm:text-5xl lg:text-7x1 bg-gradient-to-b from-purple-300 via-purple-500 to-purple-700 bg-clip-text">
            O luxo não é apenas o que você dirige. É o que você conquista.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/70 sm:text-base">
            Descubra os carros que transformam poder, elegância e tecnologia em uma só experiência.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:justify-start">
            <Link
              to="/veiculos"
              className="rounded-full bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(168,85,247,0.28)] transition hover:scale-[1.02]"	            >
              Ver veículos
            </Link>
            <a
              href="#sobre"
              className="rounded-full border border-white/15 bg-white/7 px-6 py-3 text-sm font-semibold text-white/85 transition hover:border-purple-300/50 hover:text-white"
            >
              Conhecer o Drive Elite
            </a>
          </div>
        </div>

        <div className="relative flex w-full justify-center lg:justify-end">
          <div className="absolute inset-x-10 top-8 h-48 rounded-full bg-purple-500/20 blur-3xl sm:h-72" />
          <img
            ref={imgRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-[760px] will-change-transform [transform-style:preserve-3d] transition-transform duration-200 ease-out"
            src="http://localhost:3000/carros/CarroPoster.png"
            alt="Poster do carro"
          />
        </div>
      </div>

      <div className="text-white flex flex-col justify-center">

        <section className="mx-auto max-w-7xl px-6 py-24 -mt-60">

          {/* PEGAR A PORSCHE */}
          {(() => {
            const porsche = veiculos.find(carro => carro.marca === "Porsche");

            if (!porsche) return <p>Carregando...</p>;

            return (
              <div
                key={porsche.id}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >

                {/* IMAGEM */}
                <div className="relative w-[280px] sm:w-[360px] lg:w-[350px]">
                  <div className="absolute w-[500px] h-[500px] bg-purple-600/30 blur-[160px] rounded-full" />

                  <img
                    src={`http://localhost:3000/carros/${porsche.imagem}`} // 
                    alt={porsche.modelo}
                    className="relative w-[420px] sm:w-[520px] md:w-[620px] lg:w-[350px] mt-[20px] xl:w-[400px]"
                  />
                </div>

                {/* INFORMAÇÕES */}
                <div className="text-white">

                  <h2 className="font-garamond text-3xl lg:text-5xl text-purple-500 mb-8 lg:mb-12">
                    {porsche.marca} {porsche.modelo}
                  </h2>

                  <div className="space-y-6 text-lg">

                    <div className="flex justify-between max-w-[420px]">
                      <span className="font-semibold">Ano:</span>
                      <span>{porsche.ano}</span>
                    </div>

                    <div className="flex justify-between max-w-[420px]">
                      <span className="font-semibold">Quilometragem:</span>
                      <span>{porsche.quilometragem} km</span>
                    </div>

                    <div className="flex justify-between max-w-[420px]">
                      <span className="font-semibold">Motor:</span>
                      <span>{porsche.motor}</span>
                    </div>

                    <div className="flex justify-between max-w-[420px]">
                      <span className="font-semibold">Câmbio:</span>
                      <span>{porsche.cambio}</span>
                    </div>

                    <div className="flex justify-between max-w-[420px]">
                      <span className="font-semibold">Velocidade Máxima:</span>
                      <span>{porsche.velocidade_max} km/h</span>
                    </div>

                  </div>

                  {/* PREÇO E BOTÃO */}
                  <div className="mt-10 flex flex-col sm:flex-row gap-4">

                    <div className="rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-5 text-xl font-semibold text-white shadow-[0_14px_40px_rgba(168,85,247,0.28)] transition hover:scale-[1.02] text-center">
                      R$ {Number(porsche.preco).toLocaleString('pt-BR')}
                    </div>

                    <button className="rounded-full border border-white/15 bg-white/7 px-6 py-3 text-xl font-semibold text-white/85 transition hover:border-purple-300/50 hover:text-white">
                      Saiba mais
                    </button>

                  </div>

                </div>

              </div>
            );
          })()}

        </section>
      </div>

      <div className="overflow-x-auto mt-5 md:overflow-hidden cursor-pointer">
        <h2 className="text-2xl pl-6 lg:text-4xl font-garamond text-white mb-8">
          Confira nossos outros veículos:
        </h2>

        <div className="overflow-hidden mt-5 cursor-pointer">
          <div
            className="flex gap-6 md:transition-transform md:duration-700 md:ease-in-out"
            style={{
              transform: `translateX(-${(indexAtivo % veiculos.length) * 270}px)`
            }}
          >

            {[...outrosCarros, ...outrosCarros].map((carro, index) => {
              const indexReal = index % veiculos.length
              const isAtivo = indexReal === (indexAtivo % veiculos.length)

              return (
                <div
                  key={index}
                  className={`min-w-[250px] rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-500 ${isAtivo ? "scale-110 border-purple-500" : "opacity-60"
                    }`}
                >
                  <img
                    src={`http://localhost:3000/carros/${carro.imagem}`}
                    alt={carro.modelo}
                    className="w-full h-[140px] object-cover rounded-lg mb-3"
                  />

                  <h3 className="text-sm font-semibold text-white mb-2">
                    {carro.marca} {carro.modelo}
                  </h3>

                  <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm py-2 rounded-lg cursor-pointer">
                    Saiba mais
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="absolute left-1 w-82 h-52 bg-purple-900 opacity-30 blur-3xl rounded-full" id="sobre"></div>
      <div className="absolute t-10 right-1 w-72 h-72 bg-purple-800 opacity-30 blur-3xl rounded-full"></div>
      <div className="flex min-h-[500px] w-full items-center justify-center px-4 py-10">
        <section
          className="max-w-6xl w-full rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_10px_60px_rgba(15,23,42,0.35)] backdrop-blur-md flex flex-col items-center text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-purple-200">
            Sobre nós
          </p>

          <h2 className="mt-6 font-garamond text-3xl text-transparent bg-gradient-to-b from-purple-400 to-purple-500 bg-clip-text sm:text-5xl lg:max-w-1xl ">
            Somos uma marca que vai além do carro, oferecendo experiências.
          </h2>

          <p className="mt-6 max-w-1xl text-sm leading-7 text-white/70 sm:text-lg">
            Valorizamos o luxo nos detalhes, na exclusividade e na qualidade, conectando você ao veículo dos seus sonhos com inovação, conforto e excelência.
          </p>
        </section>
      </div>


      <div className="absolute t-70 l-10 w-72 h-70 bg-purple-600 opacity-30 blur-3xl rounded-full"></div>
      <div className="max-w-4xl -mt-10 mx-auto relative h-full overflow-hidden ">
        <video
          autoPlay
          muted
          loop
          className="shadow-[0_10px_60px_rgba(15,23,42,0.35)] md:p-6 gap-6 "
        >
          <source src="http://localhost:3000/carros/Anuncio.mp4" type="video/mp4" />
        </video>
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

    </section>
  )
}
export default Home