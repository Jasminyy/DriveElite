import { api } from "./api"

export async function getPerfil() {
  const response = await api.get("/usuarios/me")

  return response.data
}

export async function updateEndereco(data) {

  const response = await api.put(
    "/usuarios/endereco",
    data
  )

  return response.data
}
