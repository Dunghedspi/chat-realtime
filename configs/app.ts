export const config = () => {
    return {
        host: {
            domain: "",
            port: 3004
        },
        database: {
            dialect: 'mysql',
            hostname: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'chat',
            logging: false,
            autoLoadModels: true,
            synchronize: true,
            // url: url dat
        },
        redis: {
            host: 'localhost',
            port: 6379,
            ttl: 1000,
        },
        jwt_key: "xxxxx"
    }
}