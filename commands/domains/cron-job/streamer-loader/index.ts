import { CronJob } from 'cron'
import searchStream from '../../../query/channel-search'
import { redisGetAllKey } from '../../../../tools/redis.ts'
export const job = new CronJob(
	process.env.STREAMER_LOADER_CRON!,
	async function () {
		const names = await redisGetAllKey()
		for (const name of names) {
			console.log(await searchStream(name))
		}
	},
	null,
	true,
	'Asia/Bangkok'
)
