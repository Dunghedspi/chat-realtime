export const config = () => {
    return {
        host: {
            domain: "localhost2",
            port: 3004
        },
        database: {
            type: 'mysql',
            hostname: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database_name: 'chat'
            // url: url dat 
        },
        redis: {
            host: 'localhost',
            port: 6379,
            ttl: 1000,
        },
        cors: {
            domain: "http://localhost:3002",
        },
        jwt_key: "xxxxx"
    }
}