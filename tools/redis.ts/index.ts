import { createClient } from 'redis'
const redisClient = await createClient({
	url: process.env.REDIS_KEY!,
})
	.on('error', (err) => console.log('Redis Client Error', err))
	.connect()

export async function redisSet(key: string, input: string): Promise<string | null> {
	return await redisClient.set('channel_stream:' + process.env.CHANNEL_ID!, input)
}

export async function redisGet(key: string): Promise<string | null> {
	return await redisClient.get(key)
}

export default {
	RedisClient: redisClient
}