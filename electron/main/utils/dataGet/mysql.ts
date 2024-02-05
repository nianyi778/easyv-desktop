import mysql from 'mysql2/promise';

export default async function customMysql(config: {
    addr: string;
    database: string;
    password: string;
    port: number;
    sql: string;
    username: string;
}) {
    const { addr, username, password, port, database, sql } = config;
    // 创建一个数据库连接
    const connection = await mysql.createConnection({
        host: addr,
        user: username,
        password: password,
        pool: port,
        database: database
    });

    // 简单查询
    try {
        const [results] = await connection.query(
            sql
        );
        console.log(`sql result`, JSON.stringify(results)); // 结果集
        return results
    } catch (err) {
        console.log(err);
    }

    // 关闭连接
    connection.end();

    return null;

};

