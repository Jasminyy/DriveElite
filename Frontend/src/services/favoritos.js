import { api } from "./api"

export async function getFavoritos() {
  const response = await api.get("/favoritos")

  return response.data
}

export async function addFavorito(id_carro) {
  const response = await api.post("/favoritos", {
    id_carro
  })

  return response.data
}

export async function removeFavorito(id) {
  const response = await api.delete(`/favoritos/${id}`)

  return response.data
}