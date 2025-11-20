// src/lib/db.ts
// MySQL database connection utility (replaces Prisma)
import mysql from 'mysql2/promise';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// Connection pool configuration for production
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'blog_db',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: 'utf8mb4',
});

// Helper function to execute queries
export async function query<T = RowDataPacket[]>(
  sql: string,
  params?: any[]
): Promise<T> {
  try {
    const [rows] = await pool.execute<T>(sql, params);
    return rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function for transactions
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Helper to use connection in transaction
export async function connQuery<T = RowDataPacket[]>(
  connection: mysql.PoolConnection,
  sql: string,
  params?: any[]
): Promise<T> {
  const [rows] = await connection.execute<T>(sql, params);
  return rows as T;
}

export async function connExecute(
  connection: mysql.PoolConnection,
  sql: string,
  params?: any[]
): Promise<number> {
  const [result] = await connection.execute<ResultSetHeader>(sql, params);
  return result.affectedRows;
}

export async function connInsert(
  connection: mysql.PoolConnection,
  sql: string,
  params?: any[]
): Promise<number> {
  const [result] = await connection.execute<ResultSetHeader>(sql, params);
  return result.insertId;
}

// Re-export for convenience
export { connQuery, connExecute, connInsert };

// Helper to get a single row
export async function queryOne<T = RowDataPacket>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T[]>(sql, params);
  return (rows.length > 0 ? rows[0] : null) as T | null;
}

// Helper for insert operations (returns insertId)
export async function insert(
  sql: string,
  params?: any[]
): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(sql, params);
  return result.insertId;
}

// Helper for update/delete operations (returns affectedRows)
export async function execute(
  sql: string,
  params?: any[]
): Promise<number> {
  const [result] = await pool.execute<ResultSetHeader>(sql, params);
  return result.affectedRows;
}

// Export the pool for advanced usage
export { pool };

// Close pool on process termination
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});

