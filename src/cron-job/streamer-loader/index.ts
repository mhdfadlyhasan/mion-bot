import { CronJob } from 'cron'
import searchStream from '../../commands/query/channel-search/index.ts'
import { redisGetAllKey } from '../../tools/redis.ts/index.ts'
export const job = new CronJob(process.env.STREAMER_LOADER_CRON!, async function loadStream() {
	const names = await redisGetAllKey()
	for (const name of names) {
		console.log(await searchStream(name))
	}
}, null, true, 'Asia/Bangkok')
