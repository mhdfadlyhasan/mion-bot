import { CronJob } from 'cron'
import searchStream from '../../../query/channel-search'
import { sendMessage } from '../../../../tools/client'

export const job = new CronJob(
	process.env.STREAMER_LOADER_CRON!,
	async function () {
		console.log(await searchStream('Korone Ch. 戌神ころね'))
		sendMessage('stream scheduler is evoked')
	},
	null,
	true,
	'Asia/Bangkok'
)
