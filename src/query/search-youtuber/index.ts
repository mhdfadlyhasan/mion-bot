import { Innertube } from 'youtubei.js'
import type { Youtuber } from '../../data_type/youtuber'

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
