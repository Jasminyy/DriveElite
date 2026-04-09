import mysql from "mysql2/promise";
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente ANTES de criar o pool
dotenv.config();

// Validação das variáveis de ambiente
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error(`❌ Variáveis de ambiente faltando: ${missingVars.join(', ')}`);
  console.error('Por favor, verifique seu arquivo .env');
  process.exit(1);
}

// Cria o pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // AJUSTE: Garante que preços (DECIMAL) venham como números e não strings
  decimalNumbers: true, 
  // AJUSTE: Padroniza o fuso horário para evitar erros em datas
  timezone: 'Z' 
});

// Função para testar a conexão
export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Conexão com o banco [${process.env.DB_NAME}] bem-sucedida!`);
    connection.release();
    return true;
  } catch (err) {
    console.error('❌ Falha ao conectar com o banco de dados:', err.message);
    
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('→ Verifique as credenciais (DB_USER, DB_PASSWORD) no .env');
    }
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.error(`→ O banco '${process.env.DB_NAME}' não existe. Crie-o primeiro!`);
    }
    if (err.code === 'ECONNREFUSED') {
      console.error(`→ Servidor MySQL não está rodando em ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    }
    
    return false;
  }
}

export default pool;