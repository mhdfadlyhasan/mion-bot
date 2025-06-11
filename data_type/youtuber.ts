type YoutuberItem = {
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

export type Youtuber = {
	kind: string
	regionCode: string
	items: YoutuberItem[]
}
