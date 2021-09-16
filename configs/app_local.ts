export const config = () => {
  return {
    host: {
      domain: 'localhost',
      port: 3004,
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
      url:"localhost",
      port: 6379,
      ttl: 10000,
    },
    cors: {
      domain: 'http://localhost:3002',
    },
    jwt: {
      privateKey: "xxxx",
      expiresIn: "2 days",
    }
  };
};
