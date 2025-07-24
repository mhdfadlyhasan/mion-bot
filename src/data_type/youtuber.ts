export type YoutuberItem = {
	kind: string
	etag: string
	id: {
		channelId: string
	}
	snippet: {
		title: string
		description: string
		channelTitle: string
		channelId: string
		liveBroadcastContent: string
		thumbnails: {
			[key: string]: {
				url: string
				width: number
				height: number
			}
		}
	}
}

export function hasUpcomingStream(youtuber: Youtuber): boolean {
	const now = new Date()
	const latestStreamTime = new Date(youtuber.latestStreamTime)
	if (youtuber.latestStreamTime == '') return false
	return now < latestStreamTime
}

export type Youtuber = {
	channelID: string | undefined
	channelName: string | undefined
	kind: string
	regionCode: string
	items: YoutuberItem[]
	latestStreamTime: string
	latestStreamLink: string
}
