import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowLeft } from "lucide-react"

function Cadastro() {

    const navigate = useNavigate()

    const [form, setForm] = useState({
        nome: "",
        email: "",
        cpf: "",
        senha: ""
    })

    async function cadastrar(e) {

        e.preventDefault()

        try {

            await axios.post(
                "http://localhost:3000/usuarios/register",
                form
            )

            alert("Conta criada com sucesso!")

            navigate("/login")

        } catch (err) {

            alert(
                err.response?.data?.erro ||
                "Erro ao cadastrar"
            )
        }
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-black text-white">

            {/* GLOWS */}
            <div className="absolute -left-32 top-0 h-[350px] w-[350px] rounded-full bg-purple-700/30 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-fuchsia-600/20 blur-[120px]" />
            <div className="absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[150px]" />
            <div className="absolute left-65 top-50 h-[300px] w-[300px] rounded-full bg-fuchsia-600/25 blur-[120px]" />

             <button
                            onClick={() => navigate(-1)}
                            className="
                                absolute top-6 left-6 z-50
                                flex items-center justify-center
                                w-11 h-11
                                rounded-full
                                cursor-pointer
                                border border-white/10
                                bg-white/5
                                backdrop-blur-xl
                                hover:border-purple-400/40
                                hover:bg-white/10
                                transition
                                "
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </button>

            <section className="relative z-10 flex min-h-screen flex-col lg:flex-row">

                {/* LADO ESQUERDO */}
                <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden">

                    {/* CARRO */}
                    <img
                        src="/Lamborghini.png"
                        className="absolute bottom-0 left-0 w-[700px] opacity-70"
                        alt=""
                    />

                    {/* LOGO */}
                    <div className="flex flex-col items-center z-10">
                        <img
                            src="/DriveEliteLogo.png"
                            className="w-85"
                            alt="Drive Elite"
                        />

                        <p className=" text-white/60 text-base font-semibold">
                            O luxo não é apenas o que você dirige. É o que você conquista.
                        </p>
                    </div>
                </div>

                {/* FORM */}
                <div className="flex flex-1 items-center justify-center px-6 py-10">

                    <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-xl shadow-[0_0_60px_rgba(168,85,247,0.15)]">

                        {/* MOBILE LOGO */}
                        <div className="mb-8 flex flex-col items-center lg:hidden">
                            <img
                                src="/DriveEliteLogo.png"
                                className="w-36"
                                alt=""
                            />
                        </div>
                        <h1 className="text-4xl text-white text-center font-bold mb-2">
                            Criar conta
                        </h1>

                        <p className="text-white/50 text-center mb-8">
                            Entre para o universo DriveElite
                        </p>

                        <form
                            onSubmit={cadastrar}
                            className="flex flex-col gap-4"
                        >

                            <input
                                type="text"
                                placeholder="Nome"
                                value={form.nome}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        nome: e.target.value
                                    })
                                }
                                className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email: e.target.value
                                    })
                                }
                                className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                            />

                            <input
                                type="text"
                                placeholder="CPF"
                                value={form.cpf}
                                onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                                className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                            />

                            <input
                                type="password"
                                placeholder="Senha"
                                value={form.senha}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        senha: e.target.value
                                    })
                                }
                                className="bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500"
                            />

                            <button
                                type="submit"
                                className="
                            mt-3 rounded-2xl
                            bg-gradient-to-r
                            from-purple-500
                            to-purple-600
                            py-3
                            font-semibold
                            text-white
                            transition-all
                            duration-300
                            hover:scale-[1.02]
                            hover:shadow-[0_0_30px_rgba(168,85,247,0.45)]
                            "
                            >
                                Criar conta
                            </button>

                        </form>

                        {/* LINKS CENTRALIZADOS */}
                        <div className="mt-8 flex flex-col items-center gap-2 text-sm">
                            <Link
                                className="text-white/40 hover:text-purple-300 transition">
                                Esqueci minha senha
                            </Link>

                            <div className="h-px w-full bg-white/10 my-2" />
                            <p className="text-white/50">
                                Já possui uma conta?
                            </p>

                            <Link
                                to="/login"
                                className="text-purple-400 hover:text-purple-300 transition"
                            >
                                Entrar
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

            {/* COPYRIGHT */}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/30">
                © DriveElite 2026 • Todos os direitos reservados
            </p>

        </main>
    )
}
export default Cadastro