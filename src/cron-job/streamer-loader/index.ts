import { CronJob } from 'cron'
import { redisGetAllKey } from '../../tools/redis.ts/index.ts'
import searchStream from '../../query/search-stream/index.ts'

export const job = new CronJob(process.env.STREAMER_LOADER_CRON!, async function loadStream() {
	const names = await redisGetAllKey()
	for (const name of names) {
		console.log(await searchStream(name))
	}
}, null, true, 'Asia/Bangkok')
