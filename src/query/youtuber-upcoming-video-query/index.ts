import type { ChannelEntry, ChannelFeed } from '../../data_type/channel_feed'
import { factory, type Livestream, type LivestreamItem } from '../../data_type/livestream'
import { XMLParser } from "fast-xml-parser"

const getTemplateUpcomingVideo = (channelID: string) => `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=upcoming&channelId=${channelID}&key=${process.env.YOUTUBE_API_KEY}`
const getTemplateUpcomingVideoV2 = (channelID: string) => `https://www.youtube.com/feeds/videos.xml?channel_id=${channelID}`

export async function getYoutuberUpcomingVideo(channelID: string): Promise<[LivestreamItem | null, string]> {
	let upcomingStream: LivestreamItem | null = null
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), 10000)

	try {
		const upcomingVideoResponse = await fetch(getTemplateUpcomingVideo(channelID), { signal: controller.signal })
		clearTimeout(timeoutId)
		if (!upcomingVideoResponse.ok) {
			return [null, `Network upcomingVideoResponse was not ok. Status: ${upcomingVideoResponse.status}`]
		}

		const upcomingVideo = await upcomingVideoResponse.json() as Livestream
		if (upcomingVideo.items.length === 0) {
			return [null, 'No upcoming streams found.']
		}

		const now = new Date()
		const limit = new Date()
		limit.setDate(now.getDate() - Number(process.env.LIVESTREAM_MAX_DAY_LIMIT))

		for (const item of upcomingVideo.items) {
			if (item?.snippet?.liveBroadcastContent === 'upcoming') {
				const date = new Date(item.snippet.publishedAt)
				if (date > limit) {
					upcomingStream = item
					break
				}
			}
		}

		if (upcomingStream === null) {
			return [null, 'No upcoming streams found.']
		}

		return [upcomingStream, '']
	} catch (error: unknown) {
		clearTimeout(timeoutId)
		console.error('Error fetching upcoming video:', error)
		if (error instanceof Error && error.name === 'AbortError') {
			return [null, 'Request timeout while fetching upcoming video']
		}
		const message = error instanceof Error ? error.message : String(error)
		return [null, message]
	}
}


export async function getYoutuberUpcomingVideoV2(channelID: string): Promise<[LivestreamItem | null, string]> {
	let upcomingStream: LivestreamItem | null = null
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), 10000)

	try {
		const upcomingVideoResponse = await fetch(getTemplateUpcomingVideoV2(channelID), { signal: controller.signal })
		clearTimeout(timeoutId)
		if (!upcomingVideoResponse.ok) {
			throw new Error(`Network response was not ok. Status: ${upcomingVideoResponse.status}`)
		}
		const parse = new XMLParser({
			ignoreAttributes: false,
			attributeNamePrefix: "",
			removeNSPrefix: true,
		})
		const response = parse.parse(await upcomingVideoResponse.text()) as {
			feed: ChannelFeed,
			xml: string
		}
		const upcomingVideoList: ChannelEntry[] = response.feed.entry.filter(value =>
			parseInt(value.group?.community?.statistics.views) == 0
		)
		if (upcomingVideoList.length === 0) {
			return [null, 'No upcoming streams found.']
		}
		const now = new Date()
		const limit = new Date()
		limit.setDate(now.getDate() - Number(process.env.LIVESTREAM_MAX_DAY_LIMIT))

		for (const video of upcomingVideoList) {
			const date = new Date(video.published)
			if (date > limit) {
				upcomingStream = factory(video)
			}
		}

		if (upcomingStream === null) {
			return [upcomingStream, 'No upcoming streams found.']
		} else {
			return [upcomingStream, '']
		}
	} catch (error: unknown) {
		clearTimeout(timeoutId)
		console.error('Error fetching upcoming video v2:', error)
		if (error instanceof Error && error.name === 'AbortError') {
			return [null, 'Request timeout while fetching upcoming video v2']
		}
		const message = error instanceof Error ? error.message : String(error)
		return [null, message]
	}
}