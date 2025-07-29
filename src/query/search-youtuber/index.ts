import { Innertube } from 'youtubei.js'
import type { Youtuber } from '../../data_type/youtuber'
import { redisGet } from '../../tools/redis/index.ts'

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
	const youtuberInCache = await redisGet(name.toLowerCase())
	try {
		if (youtuberInCache !== null) {
			const youtuber = JSON.parse(youtuberInCache) as Youtuber
			if (youtuber.channelName !== undefined) {
				name = youtuber.channelName
			}
			return [youtuber, name]
		} else {
			console.log('not found ' + name)
		}
	} catch (error) {
		if (error instanceof SyntaxError) {
			console.error("JSON Parse Error:", error.message)
		} else {
			console.error("An unexpected error occurred during JSON parsing:", error)
		}
		return [null, name]
	}
	return [null, name]
}