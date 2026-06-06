import {
  ArrowLeft,
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  MapPin,
  QrCode,
  ShieldCheck,
  UserRound
} from "lucide-react"
import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api, isAuthenticated } from "../services/api.js"
import UserAvatar from "./UserAvatar"

const initialPayment = {
  metodo: "cartao",
  nomeCartao: "",
  numeroCartao: "",
  validade: "",
  cvv: "",
  parcelas: "1",
  observacao: ""
}

function Pagamento() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [carro, setCarro] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [form, setForm] = useState(initialPayment)
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [finalizando, setFinalizando] = useState(false)

  const valor = Number(carro?.preco || 0)
  const valorParcela = useMemo(() => {
    const parcelas = Number(form.parcelas) || 1
    return valor / parcelas
  }, [valor, form.parcelas])

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true, state: { from: `/pagamento/${id}` } })
      return
    }

    async function carregarDados() {
      setCarregando(true)
      setErro("")

      try {
        const [carroRes, perfilRes] = await Promise.all([
          axios.get(`http://localhost:3000/carros/${id}`),
          api.get("/usuarios/me")
        ])

        setCarro(carroRes.data)
        setPerfil(perfilRes.data)
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/login", { replace: true, state: { from: `/pagamento/${id}` } })
          return
        }

        setErro("Nao foi possivel carregar os dados do pagamento.")
      } finally {
        setCarregando(false)
      }
    }

    carregarDados()
  }, [id, navigate])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function finalizarCompra(event) {
    event.preventDefault()
    setErro("")
    setFinalizando(true)

    try {
      const { data } = await api.post("/vendas", {
        carro_id: Number(id),
        preco_venda: valor
      })

      setSucesso(data)
    } catch (error) {
      setErro(error.response?.data?.erro || "Nao foi possivel finalizar a compra.")
    } finally {
      setFinalizando(false)
    }
  }
  
  if (carregando) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute h-[420px] w-[420px] rounded-full bg-purple-700/30 blur-[130px]" />
        <p className="relative rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm text-purple-100 backdrop-blur-xl">
          Carregando pagamento...
        </p>
      </main>
    )
  }

  if (!carro) {
    return (
      <main className="relative flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <div className="max-w-md rounded-2xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-2xl">
          <p className="text-purple-100">{erro || "Carro nao encontrado."}</p>
          <button
            type="button"
            onClick={() => navigate("/veiculos")}
            className="mt-5 rounded-full bg-purple-600 px-5 py-3 font-semibold"
          >
            Voltar aos veiculos
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-8 text-white">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[460px] w-[460px] rounded-full bg-purple-700/35 blur-[140px]" />
      <div className="pointer-events-none absolute -right-36 top-40 h-[420px] w-[420px] rounded-full bg-fuchsia-500/25 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[150px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(`/compra/${id}`)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur-xl transition hover:border-purple-300/60 hover:bg-white/15"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/perfil")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 transition hover:border-purple-400/50"
            aria-label="Abrir perfil"
          >
            <UserAvatar />
          </button>
        </div>

        <header className="mb-6 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-purple-200">Pagamento</p>
          <h1 className="font-garamond text-4xl font-semibold text-white sm:text-5xl">
            Finalize sua compra
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-white/60">
            Revise o veiculo, confirme os dados e escolha como deseja pagar.
          </p>
        </header>

        {erro && (
          <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100 backdrop-blur-xl">
            {erro}
          </div>
        )}

        {sucesso ? (
          <section className="rounded-[28px] border border-purple-200/20 bg-white/10 p-8 text-center shadow-[0_20px_90px_rgba(88,28,135,0.28)] backdrop-blur-2xl">
            <CheckCircle2 className="mx-auto h-16 w-16 text-purple-200" />
            <h2 className="mt-5 text-3xl font-bold">Pedido realizado com sucesso!</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/60">
              Sua compra de {carro.marca} {carro.modelo} foi registrada. O historico ja pode aparecer no seu perfil.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/perfil")}
                className="rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 px-6 py-3 font-semibold"
              >
                Ver meu perfil
              </button>
              <button
                type="button"
                onClick={() => navigate("/veiculos")}
                className="rounded-full border border-white/10 bg-white/10 px-6 py-3 font-semibold"
              >
                Continuar olhando carros
              </button>
            </div>
          </section>
        ) : (
           <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-[0_20px_90px_rgba(88,28,135,0.22)] backdrop-blur-2xl">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/25">
                <img
                  src={`http://localhost:3000/carros/${carro.imagem}`}
                  alt={`${carro.marca} ${carro.modelo}`}
                  className="h-64 w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-200">{carro.marca}</p>
                  <h2 className="mt-2 text-3xl font-bold">{carro.modelo}</h2>
                  <p className="mt-3 text-sm text-white/60">{carro.ano} | {carro.cambio} | {carro.motor}</p>
                  <p className="mt-5 text-3xl font-bold text-purple-100">
                    R$ {valor.toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>


              <div className="mt-5 grid gap-3">
                <SummaryRow icon={<UserRound className="h-4 w-4" />} label="Cliente" value={perfil?.nome || "Cliente Drive Elite"} />
                <SummaryRow icon={<MapPin className="h-4 w-4" />} label="Endereco" value={formatAddress(perfil)} />
                <SummaryRow icon={<ShieldCheck className="h-4 w-4" />} label="Status" value="Pedido protegido" />
              </div>
            </aside>

            <form onSubmit={finalizarCompra} className="rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-[0_20px_90px_rgba(88,28,135,0.22)] backdrop-blur-2xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-100">
                  <BadgeDollarSign className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-purple-100">Forma de pagamento</h2>
                  <p className="text-sm text-white/55">Escolha uma opcao para registrar o pedido.</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <PaymentOption
                  active={form.metodo === "cartao"}
                  icon={<CreditCard className="h-5 w-5" />}
                  label="Cartao"
                  onClick={() => updateField("metodo", "cartao")}
                />
                <PaymentOption
                  active={form.metodo === "pix"}
                  icon={<QrCode className="h-5 w-5" />}
                  label="Pix"
                  onClick={() => updateField("metodo", "pix")}
                />
                <PaymentOption
                  active={form.metodo === "financiamento"}
                  icon={<CalendarDays className="h-5 w-5" />}
                  label="Financiamento"
                  onClick={() => updateField("metodo", "financiamento")}
                />
              </div>

              {form.metodo === "cartao" && (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Nome no cartao" value={form.nomeCartao} onChange={(value) => updateField("nomeCartao", value)} required />
                  <Field label="Numero do cartao" value={form.numeroCartao} onChange={(value) => updateField("numeroCartao", value)} required />
                  <Field label="Validade" value={form.validade} onChange={(value) => updateField("validade", value)} required />
                  <Field label="CVV" value={form.cvv} onChange={(value) => updateField("cvv", value)} required />
                </div>
              )}

              {form.metodo === "pix" && (
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-5">
                  <QrCode className="h-10 w-10 text-purple-200" />
                  <p className="mt-3 font-semibold">Pix reservado para confirmacao</p>
                  <p className="mt-1 text-sm text-white/60">Depois de finalizar, a equipe Drive Elite entra em contato com a chave e os dados de entrega.</p>
                </div>
              )}

              {form.metodo === "financiamento" && (
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-5">
                  <CalendarDays className="h-10 w-10 text-purple-200" />
                  <p className="mt-3 font-semibold">Solicitacao de financiamento</p>
                  <p className="mt-1 text-sm text-white/60">O pedido sera registrado para analise e contato da equipe.</p>
                </div>
              )}

              <label className="mt-5 block">
                <span className="text-sm text-white/70">Parcelas</span>
                <select
                  value={form.parcelas}
                  onChange={(event) => updateField("parcelas", event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition focus:border-purple-300"
                >
                  {[1, 3, 6, 12, 24].map((parcela) => (
                    <option key={parcela} value={parcela} className="bg-black">
                      {parcela}x de R$ {(valor / parcela).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}
                    </option>
                  ))}
                </select>
              </label>

              <label className="mt-5 block">
                <span className="text-sm text-white/70">Observacao</span>
                <textarea
                  value={form.observacao}
                  onChange={(event) => updateField("observacao", event.target.value)}
                  className="mt-2 min-h-24 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-purple-300"
                   placeholder="Algum detalhe para a equipe?"
                />
              </label>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-4 text-sm text-white/65">
                  <span>Total</span>
                  <span>R$ {valor.toLocaleString("pt-BR")}</span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-4 text-sm text-white/65">
                  <span>Parcelamento</span>
                  <span>{form.parcelas}x de R$ {valorParcela.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={finalizando}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-5 py-3 font-semibold shadow-[0_14px_45px_rgba(168,85,247,0.28)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LockKeyhole className="h-5 w-5" />
                {finalizando ? "Finalizando..." : "Finalizar compra"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}

function formatAddress(perfil) {
  if (!perfil) return "Endereco nao informado"
  const parts = [perfil.rua, perfil.numero, perfil.bairro, perfil.cidade, perfil.estado].filter(Boolean)
  return parts.length ? parts.join(", ") : "Endereco nao informado"
}

function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/20 text-purple-100">{icon}</span>
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-white/40">{label}</p>
        <p className="text-sm text-white/80">{value}</p>
      </div>
    </div>
  )
}

function PaymentOption({ active, icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${active
        ? "border-purple-300/60 bg-purple-500/25 text-white shadow-[0_0_28px_rgba(168,85,247,0.25)]"
        : "border-white/10 bg-black/25 text-white/70 hover:border-purple-300/40 hover:text-white"
        }`}
    >
      {icon}
      {label}
    </button>
  )
}

function Field({ label, value, onChange, required = false }) {
  return (
    <label className="block">
      <span className="text-sm text-white/70">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-purple-300"
        required={required}
      />
    </label>
  )
}

export default Pagamento