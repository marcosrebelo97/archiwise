import {cleanEnv, port, str} from "envalid";


function validateEnv() {
     cleanEnv(process.env, {
        // Define o ambiente da aplicação (development, production ou test)
        NODE_ENV: str({
            choices: ['development', 'production', 'test'],
            desc: 'Define o ambiente da aplicação',
            example: 'development'
        }),

        // Segredo utilizado para sessões
        SESSION_SECRET: str({
            desc: 'Chave secreta usada para assinar sessões',
            example: 'mySuperSecretKey'
        }),

        // Host utilizado pelo Swagger
        HOST: str({
            desc: 'Endereço do host utilizado no Swagger',
            example: 'localhost'
        }),

        // URL de conexão com o banco de dados
        DATABASE_URL: str({
            desc: 'URL de conexão com o banco de dados',
            example: 'mysql://user:password@host:port/database'
        }),

        // Endpoint do serviço Gotenberg
        GOTENBERG_ENDPOINT: str({
            default: '',
            desc: 'Endpoint do serviço Gotenberg usado para conversão de documentos',
            example: 'https://gotenberg.example.com'
        }),

        // Endpoint do serviço Python
        PYTHON_ENDPOINT: str({
            default: '',
            desc: 'Endpoint da API Python para processamento de dados',
            example: 'https://api.example.com/process'
        }),

        // URL de conexão com o Redis
        REDIS_URL: str({
            desc: 'URL de conexão com o Redis',
            example: 'redis://user:password@host:port'
        }),

        // URL do frontend
        FRONTEND_ENDPOINT: str({
            desc: 'Endpoint do frontend da aplicação',
            example: 'http://localhost:3000'
        }),

        // Porta na qual o backend será executado
        PORT: port({
            desc: 'Porta na qual o backend será iniciado',
            example: '4000'
        }),
    });


}

export default validateEnv;