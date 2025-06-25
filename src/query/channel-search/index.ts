import type { Youtuber } from '../../data_type/youtuber.ts'
import type { Livestream, LivestreamItem } from '../../data_type/livestream.ts'
import { getVideoDetail } from '../video-detail-query/index.ts'
import { redisGetWildCard, redisSet } from '../../tools/redis.ts/index.ts'
import { searchYoutuberByName } from '../../lib/search_youtuber.ts'
import { setNotification } from '../../lib/notification.ts'

export default async function searchStream(name: string): Promise<string> {
	const now = new Date()
	try {
		const linkInCache = await redisGetWildCard(name.toLowerCase())
		if (linkInCache !== null && linkInCache.length > 0) {
			const detail = JSON.parse(linkInCache) as Youtuber
			const liveDate = new Date(detail.latestStreamTime)
			if (now < liveDate) {
				console.info('using data from redis')
				const startTime = new Date(detail.latestStreamTime).toLocaleString('en-us', { timeZone: 'Asia/Bangkok' })
				const delay = new Date(detail.latestStreamTime as string).getTime() - Date.now()
				setNotification(detail.channelID as string, 'Its about to start! \n' + detail.latestStreamLink, delay)
				return ('Live time ' + startTime + '\n' + detail.latestStreamLink)
			}
		}
		const youtuber = await searchYoutuberByName(name)
		const linkStream = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=upcoming&channelId=${youtuber.channelID}&key=${process.env.YOUTUBE_API_KEY}`
		const latestStream = await fetch(linkStream)
		if (!latestStream.ok) {
			return (`Network latestStream was not ok. Status: ${latestStream.status}`)
		}
		const result = await latestStream.json() as Livestream
		if (result.items.length === 0) {
			return ('No upcoming streams found.')
		}
		let upcomingStream: LivestreamItem | null = null
		for (const item of result.items) {
			if (item != null && item.snippet != undefined && item.snippet.liveBroadcastContent == 'upcoming') {
				const date = new Date(item.snippet.publishedAt)
				const limit = new Date()
				limit.setDate(now.getDate() - Number(process.env.LIVESTREAM_MAX_DAY_LIMIT))
				if (date > limit) {
					upcomingStream = item
					break
				}
			}
		}
		if (upcomingStream === null) {
			return 'No upcoming streams found.'
		}
		const videoInfo = await getVideoDetail([String(upcomingStream!.id.videoId)])
		if (videoInfo === null || typeof videoInfo === 'string') {
			return 'Error' + videoInfo
		}
		let startTime: string
		if (videoInfo.items[0]?.liveStreamingDetails.scheduledStartTime == null) {
			startTime = 'unknown'
		} else {
			startTime = new Date(videoInfo.items[0]?.liveStreamingDetails.scheduledStartTime).toLocaleString('en-us', { timeZone: 'Asia/Bangkok' })
		}
		youtuber.latestStreamLink = 'https://www.youtube.com/watch?v=' + upcomingStream!.id.videoId
		youtuber.latestStreamTime = videoInfo.items[0]?.liveStreamingDetails.scheduledStartTime as string
		redisSet(youtuber.channelName!, JSON.stringify(youtuber))
		const delay = new Date(youtuber.latestStreamTime as string).getTime() - Date.now()
		setNotification(youtuber.channelID as string, 'Its about to start! \n' + youtuber.latestStreamLink, delay)
		return ('Live time ' + startTime + '\n' + youtuber.channelName + 'https://www.youtube.com/watch?v=' + upcomingStream!.id.videoId)
	} catch (error) {
		console.error('Error fetching youtuber info:', error)
		return 'Failed to fetch youtuber info.' + error
	}
}