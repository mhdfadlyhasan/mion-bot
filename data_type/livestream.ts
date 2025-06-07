type LivestreamItem = {
	id: {
		videoId: string
	}
	snippet: {
		title: string
		description: string
		channelTitle: string
		liveBroadcastContent: string
		publishedAt: string
		thumbnails: {
			[key: string]: {
				url: string
				width: number
				height: number
			}
		}
	}
}

export type Livestream = {
	kind: string
	regionCode: string
	items: LivestreamItem[]
}
