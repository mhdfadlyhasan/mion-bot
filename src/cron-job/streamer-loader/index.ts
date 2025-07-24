import { CronJob } from 'cron'
import { redisGetAllKey } from '../../tools/redis.ts/index.ts'
import { searchStreamList } from '../../domain/search-stream/index.ts'

export const job = new CronJob(process.env.STREAMER_LOADER_CRON!, async function loadStream() {
	const names = await redisGetAllKey()
	searchStreamList(names)
}, null, true, 'Asia/Bangkok')
