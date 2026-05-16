import jwt from 'jsonwebtoken';

// 1. Middleware de Autenticação (Verifica se o usuário está logado)
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ erro: 'Token inválido' });
    }

    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ erro: 'Token em formato inválido' });
    }

    try {
        // Verifica o token e extrai os dados (payload)
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        // Importante: Salvamos os dados do usuário (ID e Role) na requisição
        req.user = payload; 
        
        return next();
    } catch (err) {
        return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
};

// 2. Middleware de Admin (Verifica se o usuário tem permissão de professor)
export const isAdmin = (req, res, next) => {
    // O verifyToken precisa ser chamado ANTES deste aqui para preencher o req.user
    if (req.user && req.user.role === 'admin') {
        return next(); // É admin, pode passar!
    } else {
        return res.status(403).json({ 
            msg: "Acesso negado: Rota exclusiva para administradores." 
        });
    }
};

// Exportamos como padrão o verifyToken para manter compatibilidade com seu código antigo
export default verifyToken;