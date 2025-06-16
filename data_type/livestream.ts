export type LivestreamItem = {
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
	liveStreamingDetails: {
		actualStartTime: string,
		actualEndTime: string,
		scheduledStartTime: string,
		scheduledEndTime: string,
		concurrentViewers: number,
		activeLiveChatId: string
	}
}

export type Livestream = {
	kind: string
	regionCode: string
	items: LivestreamItem[]
}
