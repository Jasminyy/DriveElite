import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import axios from "axios";

const initialForm = {
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    telefone: "",
    pais: "Brasil",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    complemento: "",
    cep: "",
}

const camposEndereco = [
    { name: "pais", label: "País", autoComplete: "country-name" },
    { name: "estado", label: "Estado", autoComplete: "address-level1" },
    { name: "cidade", label: "Cidade", autoComplete: "address-level2" },
    { name: "bairro", label: "Bairro", autoComplete: "address-level3" },
    { name: "rua", label: "Rua", autoComplete: "address-line1" },
    { name: "numero", label: "Número", autoComplete: "address-line2" },
    { name: "complemento", label: "Complemento", autoComplete: "address-line3", optional: true },
    { name: "cep", label: "CEP", autoComplete: "postal-code" },
]

function Register() {
    const [form, setform] = useState(initialForm)
    const [erro, setErro] = useState("")
    const [sucesso, setSucesso] = useState("")
    const [carregando, setCarregando] = useState(false)
    const navigate = useNavigate()

    function handleChange(event) {
        const { name, value } = event.target
        setform((prev) => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setErro("")
        setSucesso("")

        if (form.senha !== form.confirmarSenha) {
            setErro("As senhas estão incorretas!")
            return
        }

        const payload = { ...form }
        delete payload.confirmarSenha

        try {
            setCarregando(true)
            const response = await axios.post("http://localhost:3000/usuarios/register", payload)
            setSucesso(response.data?.mensagem || "Cadastro realizado com sucesso!")
            setform(initialForm)

            setTimeout(() => {
                navigate("/")
            }, 1200)
        } catch (error) {
            const mensagem = error.response?.erro || error.response?.data?.detalhes || "Não foi possível concluir o cadastro. Tente novamente."
            setErro(mensagem)
        } finally {
            setCarregando(false)
        }
    }
    return (
        <main className="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
            <div className="absolute -left-40 -top-40 h-[400px] w-[400px] rounded-full bg-purple-700/30 blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-fuchsia-500/25 blur-[120px]" />
            <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[140px]" />

            <section className="relative z-10 mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_0_70px_rgba(126,34,206,0.25)] backdrop-blur-xl sm:p-8 lg:p-10">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-300 transition hover:text-purple-100">
                            ← Voltar para a home
                        </Link>
                        <h1 className="mt-4 font-garamond text-4xl font-semibold text-transparent bg-gradient-to-b from-purple-200 via-purple-500 to-purple-700 bg-clip-text sm:text-5xl">
                            Criar conta DriveElite
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                            Preencha seus dados para favoritar veículos e avançar nas compras com segurança.
                        </p>
                    </div>

                    <img className="w-28 self-start sm:w-36" src="/DriveEliteLogo.png" alt="Drive Elite" />
                </div>

                <form className="grid gap-5" onSubmit={handleSubmit}>
                    <div className="grid gap-5 md:grid-cols-2">
                        <label className="grid gap-2 text-sm font-medium text-white/80">
                            Nome completo
                            <input
                                required
                                name="nome"
                                value={form.nome}
                                onChange={handleChange}
                                autoComplete="name"
                                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-purple-400"
                                placeholder="Seu nome"
                            />
                        </label>

                        <label className="grid gap-2 text-sm font-medium text-white/80">
                            E-mail
                            <input
                                required
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-purple-400"
                                placeholder="voce@email.com"
                            />
                        </label>

                        <label className="grid gap-2 text-sm font-medium text-white/80">
                            CPF
                            <input
                                required
                                name="cpf"
                                value={form.cpf}
                                onChange={handleChange}
                                autoComplete="off"
                                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-purple-400"
                                placeholder="000.000.000-00"
                            />
                        </label>

                        <label className="grid gap-2 text-sm font-medium text-white/80">
                            Telefone
                            <input
                                name="telefone"
                                value={form.telefone}
                                onChange={handleChange}
                                autoComplete="tel"
                                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-purple-400"
                                placeholder="(00) 00000-0000"
                            />
                        </label>

                        <label className="grid gap-2 text-sm font-medium text-white/80">
                            Senha
                            <input
                                required
                                minLength={6}
                                type="password"
                                name="senha"
                                value={form.senha}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-purple-400"
                                placeholder="Mínimo 6 caracteres"
                            />
                        </label>

                        <label className="grid gap-2 text-sm font-medium text-white/80">
                            Confirmar senha
                            <input
                                required
                                minLength={6}
                                type="password"
                                name="confirmarSenha"
                                value={form.confirmarSenha}
                                onChange={handleChange}
                                autoComplete="new-password"
                                className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-purple-400"
                                placeholder="Repita a senha"
                            />
                        </label>
                    </div>

                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-purple-200">Endereço</h2>
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                            {camposEndereco.map((campo) => (
                                <label key={campo.name} className="grid gap-2 text-sm font-medium text-white/80">
                                    {campo.label}{campo.optional ? " (opcional)" : ""}
                                    <input
                                        required={!campo.optional}
                                        name={campo.name}
                                        value={form[campo.name]}
                                        onChange={handleChange}
                                        autoComplete={campo.autoComplete}
                                        className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-purple-400"
                                        placeholder={campo.label}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>

                    {erro && (
                        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                            {erro}
                        </div>
                    )}

                    {sucesso && (
                        <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                            {sucesso}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={carregando}
                        className="rounded-full bg-gradient-to-r from-purple-500 to-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_40px_rgba(168,85,247,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                    >
                        {carregando ? "Cadastrando..." : "Finalizar cadastro"}
                    </button>
                </form>
            </section>
        </main>
    )
}
export default Register

