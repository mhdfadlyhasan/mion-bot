import type { Livestream, LivestreamItem } from '../../data_type/livestream'

const getTemplateUpcomingVideo = (channelID: string) => `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=upcoming&channelId=${channelID}&key=${process.env.YOUTUBE_API_KEY}`

export async function getYoutuberUpcomingVideo(channelID: string): Promise<[LivestreamItem | null, string]> {
	let upcomingStream: LivestreamItem | null = null

	const upcomingVideoResponse = await fetch(getTemplateUpcomingVideo(channelID))
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
}