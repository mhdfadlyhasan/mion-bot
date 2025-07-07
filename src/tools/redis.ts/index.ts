import { createClient } from 'redis'
const redisClient = await createClient({
	url: process.env.REDIS_KEY!,
})
	.on('error', (err) => console.log('Redis Client Error', err))
	.connect()

export async function redisSet(key: string, input: string): Promise<string | null> {
	return await redisClient.set(key, input)
}

export async function redisSetJson(key: string, input: string): Promise<string | null> {
	return await redisClient.set(key, JSON.stringify(input))
}

export async function redisGet(key: string): Promise<string | null> {
	return await redisClient.get(key)
}


export async function redisGetWildCard(input: string): Promise<string | null> {
	const keys = await redisClient.keys('*' + input + '*')
	if (keys.length === 0) {
		return null
	}
	return await redisClient.get(keys[0] as string)
}

export async function redisGetAllKey(): Promise<string[]> {
	return await redisClient.keys('*')
}

export async function redisGetKey(input: string): Promise<string[]> {
	return await redisClient.keys(input)
}
export default {
	RedisClient: redisClient,
}