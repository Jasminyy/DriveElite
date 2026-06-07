import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

import { updateEndereco } from "../services/usuario"
import UserAvatar from "../components/UserAvatar"

import { getStoredUser, saveSession, getToken } from "../services/api.js"
import { getFavoritos, removeFavorito } from "../services/favoritos"

import {
  Heart,
  History,
  MapPin,
  Shield,
  Star,
  User,
  LogOut
} from "lucide-react"


function Perfil() {

  const [endereco, setEndereco] = useState({
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: ""
  })

  const navigate = useNavigate()

  const token = localStorage.getItem("token")

  const user = token
    ? jwtDecode(token)
    : null

  const [tab, setTab] = useState("perfil")
  const [favoritos, setFavoritos] = useState([])
  const [photoPreview, setPhotoPreview] = useState(null)

  const getCarImageUrl = (imagem) =>
    imagem?.startsWith("http")
      ? imagem
      : `http://localhost:3000/carros/${imagem}`

  function logout() {
    localStorage.removeItem("token")
    navigate("/login")
  }
  useEffect(() => {
  loadFavoritos()
}, [])

async function loadFavoritos() {
  try {

    const data = await getFavoritos()

    setFavoritos(data)

  } catch (error) {
    console.error(error)
  }
}

async function handleRemove(id) {

  try {

    await removeFavorito(id)

    setFavoritos((prev) =>
      prev.filter((fav) => fav.favorito_id !== id)
    )

  } catch (error) {
    console.error(error)
  }

}

useEffect(() => {

  if (!user) {
    navigate("/login")
    return
  }

  setEndereco({
    rua: user.rua || "",
    numero: user.numero || "",
    bairro: user.bairro || "",
    cidade: user.cidade || "",
    estado: user.estado || "",
    cep: user.cep || ""
  })

}, [])

useEffect(() => {
  const stored = getStoredUser()
  setPhotoPreview(stored?.imagem || null)
}, [])

async function handlePhotoChange(e) {
  const file = e.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result

    const stored = getStoredUser() || {}
    stored.imagem = dataUrl

    // Keep token if exists
    const token = localStorage.getItem("token")
    if (token) {
      localStorage.setItem("driveelite_user", JSON.stringify(stored))
    } else {
      localStorage.setItem("driveelite_user", JSON.stringify(stored))
    }

    setPhotoPreview(dataUrl)
  }
  reader.readAsDataURL(file)
}

function handleRemovePhoto() {
  const stored = getStoredUser() || {}
  delete stored.imagem
  localStorage.setItem("driveelite_user", JSON.stringify(stored))
  setPhotoPreview(null)
}

useEffect(() => {

  setEndereco({
    rua: user.rua || "",
    numero: user.numero || "",
    bairro: user.bairro || "",
    cidade: user.cidade || "",
    estado: user.estado || "",
    cep: user.cep || ""
  })

}, [])

async function salvarEndereco() {

  try {

    await updateEndereco(endereco)

    alert("Endereço salvo!")

  } catch (error) {

    console.error(error)

  }

}

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-purple-700/20 blur-[140px] rounded-full" />

      <div className="relative max-w-7xl mx-auto p-10">

        <h1 className="text-5xl font-black mb-10">
          Meu Perfil
        </h1>

        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setTab("favoritos")}
            className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Favoritos ({favoritos.length})
          </button>
          <button
            onClick={() => setTab("compras")}
            className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Compras
          </button>
        </div>

        <div className="grid grid-cols-[320px_1fr] gap-8">

          {/* SIDEBAR */}

          <aside className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-6
          backdrop-blur-xl
          h-fit
          ">

            <div className="flex flex-col items-center text-center">

              <UserAvatar
                name={user.nome}
                className="w-28 h-28 text-4xl"
              />

              <h2 className="mt-5 text-2xl font-bold">
                {user.nome}
              </h2>

              <p className="text-white/60">
                Conta autenticada
              </p>

            </div>

            <div className="mt-10 flex flex-col gap-3">

              <button
                onClick={() => setTab("perfil")}
                className="profile-button cursor-pointer"
              >
                <User size={18} />
                Perfil
              </button>

              <button
                onClick={() => setTab("favoritos")}
                className="profile-button cursor-pointer"
              >
                <Heart size={18} />
                Favoritos
              </button>

              <button
                onClick={() => setTab("compras")}
                className="profile-button cursor-pointer"
              >
                <History size={18} />
                Compras
              </button>

              <button
                onClick={() => setTab("avaliacoes")}
                className="profile-button cursor-pointer"
              >
                <Star size={18} />
                Avaliações
              </button>

              <button
                onClick={() => setTab("enderecos")}
                className="profile-button cursor-pointer"
              >
                <MapPin size={18} />
                Endereços
              </button>

              <button
                onClick={() => setTab("seguranca")}
                className="profile-button cursor-pointer"
              >
                <Shield size={18} />
                Segurança
              </button>

              <button
                onClick={logout}
                className="
                flex items-center gap-3
                px-5 py-4
                rounded-2xl
                bg-red-500/20
                text-red-400
                hover:bg-red-500/25
                transition
                font-medium
                cursor-pointer
                "
              >
                <LogOut size={18} />
                Sair da conta
              </button>

            </div>

          </aside>

          {/* CONTEÚDO */}

          <section className="
          bg-white/5
          border border-white/10
          rounded-3xl
          p-8
          backdrop-blur-xl
          ">

            {tab === "perfil" && (
              <div>

                <h2 className="text-3xl font-bold mb-8">
                  Informações pessoais
                </h2>

                <div className="space-y-6">

                  <div>
                    <label className="text-white/60">
                      Nome
                    </label>

                    <input
                      type="text"
                      defaultValue={user.nome}
                      className="
                      mt-2 w-full
                      bg-white/5
                      border border-white/10
                      rounded-2xl
                      p-4
                      outline-none
                      focus:border-purple-500
                      "
                    />
                  </div>

                  <button className="
                  px-6 py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-purple-500
                  to-fuchsia-600
                  font-semibold
                  hover:scale-[1.02]
                  transition
                  ">
                    Salvar alterações
                  </button>

                </div>

              </div>
            )}

            {/* Photo upload */}
            {tab === "perfil" && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Foto de perfil</h3>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20"> 
                    {photoPreview ? (
                      <img src={photoPreview} alt="preview" className="w-20 h-20 object-cover rounded-full" />
                    ) : (
                      <UserAvatar name={user.nome} className="w-20 h-20" />
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="px-4 py-2 bg-white/5 rounded-lg cursor-pointer">
                      Adicionar / Alterar foto
                      <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                    </label>

                    <button onClick={handleRemovePhoto} className="px-4 py-2 bg-red-500/20 rounded-lg">Remover foto</button>
                  </div>
                </div>
              </div>
            )}

            {tab === "favoritos" && (

  <div>

    <h2 className="text-3xl font-bold mb-8">
      Veículos Favoritos
    </h2>

    {favoritos.length === 0 ? (

      <p className="text-white/60">
        Nenhum veículo favoritado ainda.
      </p>

    ) : (

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {favoritos.map((carro) => (

          <div
            key={carro.favorito_id}
            className="
            bg-white/5
            border border-white/10
            rounded-3xl
            overflow-hidden
            "
          >

            <img
              src={getCarImageUrl(carro.imagem)}
              alt={`${carro.marca} ${carro.modelo}`}
              className="
              w-full h-52
              object-cover
              "
            />

            <div className="p-5">

              <h3 className="text-xl font-bold">
                {carro.marca} {carro.modelo}
              </h3>

              <p className="text-purple-300 mt-2">
                R$ {Number(carro.preco).toLocaleString("pt-BR")}
              </p>

              <button
                onClick={() =>
                  handleRemove(carro.favorito_id)
                }
                className="
                mt-5
                px-5 py-3
                rounded-xl
                bg-red-500/20
                text-red-400
                hover:bg-red-500/30
                transition
                "
              >
                Remover
              </button>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

)}

            {tab === "compras" && (
              <div>
                <h2 className="text-3xl font-bold mb-8">
                  Histórico de compras
                </h2>

                <p className="text-white/60">
                  Nenhuma compra realizada.
                </p>
              </div>
            )}

            {tab === "avaliacoes" && (
              <div>
                <h2 className="text-3xl font-bold mb-8">
                  Suas avaliações
                </h2>

                <p className="text-white/60">
                  Você ainda não avaliou veículos.
                </p>
              </div>
            )}

            {tab === "enderecos" && (
              <div>

                <div className="flex items-center justify-between mb-8">

                  <h2 className="text-3xl font-bold">
                    Endereços
                  </h2>

                  <button className="
                  px-5 py-3
                  rounded-xl
                  bg-purple-600
                  hover:bg-purple-500
                  transition
                  ">
                    Adicionar endereço
                  </button>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

  <input
    placeholder="Rua"
    value={endereco.rua}
    onChange={(e) =>
      setEndereco({
        ...endereco,
        rua: e.target.value
      })
    }
    className="profile-input"
  />

  <input
    placeholder="Número"
    value={endereco.numero}
    onChange={(e) =>
      setEndereco({
        ...endereco,
        numero: e.target.value
      })
    }
    className="profile-input"
  />

  <input
    placeholder="Bairro"
    value={endereco.bairro}
    onChange={(e) =>
      setEndereco({
        ...endereco,
        bairro: e.target.value
      })
    }
    className="profile-input"
  />

  <input
    placeholder="Cidade"
    value={endereco.cidade}
    onChange={(e) =>
      setEndereco({
        ...endereco,
        cidade: e.target.value
      })
    }
    className="profile-input"
  />

  <input
    placeholder="Estado"
    value={endereco.estado}
    onChange={(e) =>
      setEndereco({
        ...endereco,
        estado: e.target.value
      })
    }
    className="profile-input"
  />

  <input
    placeholder="CEP"
    value={endereco.cep}
    onChange={(e) =>
      setEndereco({
        ...endereco,
        cep: e.target.value
      })
    }
    className="profile-input"
  />

</div>

<button
  onClick={salvarEndereco}
  className="
  mt-6
  px-6 py-4
  rounded-2xl
  bg-gradient-to-r
  from-purple-500
  to-fuchsia-600
  font-semibold
  hover:scale-[1.02]
  transition
  "
>
  Salvar endereço
</button>

              </div>
            )}

            {tab === "seguranca" && (
              <div>

                <h2 className="text-3xl font-bold mb-8">
                  Alterar senha
                </h2>

                <div className="space-y-5">

                  <input
                    type="password"
                    placeholder="Senha atual"
                    className="profile-input"
                  />

                  <input
                    type="password"
                    placeholder="Nova senha"
                    className="profile-input"
                  />

                  <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    className="profile-input"
                  />

                  <button className="
                  px-6 py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-purple-500
                  to-fuchsia-600
                  font-semibold
                  hover:scale-[1.02]
                  transition
                  ">
                    Atualizar senha
                  </button>

                </div>

              </div>
            )}

          </section>

        </div>

      </div>

    </main>
  )
}

export default Perfil
