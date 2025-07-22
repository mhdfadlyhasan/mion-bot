import type { ChannelEntry } from "./channel_feed"

export type LivestreamItem = {
	id: string | {
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


export function factory(entry: ChannelEntry): LivestreamItem {
	return {
		id: {
			videoId: entry.videoId
		},
		snippet: {
			// liveBroadcastContent: string,
			publishedAt: entry.published,
			title: "",
			description: "",
			channelTitle: "",
			liveBroadcastContent: "",
			thumbnails: {}
		},
		liveStreamingDetails: {
			actualStartTime: "",
			actualEndTime: "",
			scheduledStartTime: "",
			scheduledEndTime: "",
			concurrentViewers: 0,
			activeLiveChatId: ""
		}
	}
}

