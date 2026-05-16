import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Perfil() {
    const navigate = useNavigate()
    const token = localStorage.getItem("token")
    const user = jwtDecode(token)

    function logout() {
        localStorage.removeItem("token")

        navigate("/login")
    }

    return (
        <div className="min-h-screen bg-black text-white p-10">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">
                    Meu Perfil
                </h1>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                    <div className="flex items-center gap-5">
                        <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-3xl font-bold">
                            J
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold">
                                {user.nome}
                            </h2>
                            <p className="text-white/60">
                                Conta autenticada
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 flex gap-4 flex-wrap">
                       <button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 transition">
                            Favoritos
                        </button>

                        <button className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 transition">
                            Histórico
                        </button>

                        <button
                            onClick={logout}
                            className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-400 transition"
                        >
                            Sair da conta
                        </button>

                    </div>



                </div>

            </div>

        </div>

    )
}

export default Perfil