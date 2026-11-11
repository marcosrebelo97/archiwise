import { createClient } from "redis"

// Initialize client with retry strategy for resilience
let redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 5) {
                console.error('Número máximo de tentativas de reconexão atingido.');
                return new Error('Número máximo de tentativas atingido.');
            }
            console.log(`Tentando reconectar ao Redis (tentativa ${retries + 1})...`);
            return Math.min(retries * 1000, 60000); // Tempo entre tentativas (exponencial, até 60 segundos)
        },
    },
});

redisClient.on('error', (err) => {
    console.error('Erro no cliente Redis:', err);
});

redisClient.connect().catch(console.error);

export default redisClient;