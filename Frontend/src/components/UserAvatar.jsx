import { getStoredUser, isAuthenticated } from "../services/api.js"

function getInitial(name) {
  const cleanName = name?.trim()

  return cleanName
    ? cleanName.charAt(0).toUpperCase()
    : "J"
}

function UserAvatar({ name, className = "" }) {
  const user = isAuthenticated()
    ? getStoredUser()
    : null

  const initial = getInitial(name || user?.nome)

  return (
    <div
      className={`
        flex items-center justify-center
        rounded-full
        bg-gradient-to-br
        from-purple-400
        via-purple-600
        to-fuchsia-700
        text-white
        font-bold
        shadow-[0_0_35px_rgba(168,85,247,0.45)]
        border border-white/10
        ${className}
      `}
    >
      {initial}
    </div>
  )
}

export default UserAvatar