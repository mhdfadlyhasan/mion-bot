import { createClient } from 'redis'
const redisClient = await createClient({
	url: process.env.REDIS_KEY!,
})
	.on('error', (err) => console.log('Redis Client Error', err))
	.connect()

export async function redisSet(key: string, input: string): Promise<string | null> {
	return await redisClient.set(key, input)
}

export async function redisSetJson(key: string, input: any): Promise<string | null> {
	return await redisClient.set(key, JSON.stringify(input))
}

export async function redisGet(key: string): Promise<string | null> {
	return await redisClient.get(key)
}

export default {
	RedisClient: redisClient,
}