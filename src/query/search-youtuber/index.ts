import { Innertube } from 'youtubei.js'
import type { Youtuber } from '../../data_type/youtuber'
import { redisGetWildCard } from '../../tools/redis.ts'

export async function searchYoutuberByName(input: string): Promise<Youtuber> {
	const innertube = await Innertube.create({})
	const search = await innertube.search(input, {
		type: 'channel',
	})
	const channel = search.channels
	const result: Youtuber = {
		channelID: channel[0]?.author.id,
		channelName: channel[0]?.author.name.toLowerCase(),
		latestStreamLink: '',
		kind: '',
		regionCode: '',
		items: [],
		latestStreamTime: '',
	}
	return result
}


export async function FindYoutuberFromCache(name: string): Promise<[Youtuber | null, string]> {
	const youtuberInCache = await redisGetWildCard(name.toLowerCase())
	if (youtuberInCache !== null) {
		const youtuber = JSON.parse(youtuberInCache) as Youtuber
		if (youtuber.channelName !== undefined) {
			name = youtuber.channelName
		}
		return [youtuber, name]

	} else {
		console.log('not found ' + name)
	}
	return [null, name]
}