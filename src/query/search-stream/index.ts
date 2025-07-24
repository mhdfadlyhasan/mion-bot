import { type Youtuber } from '../../data_type/youtuber.ts'
import { redisGetWildCard, redisSet } from '../../tools/redis.ts/index.ts'
import { setNotification } from '../../lib/notification.ts'
import { getYoutuberUpcomingVideo, getYoutuberUpcomingVideoV2 } from '../youtuber-upcoming-video-query/index.ts'
import { searchYoutuberByName } from '../search-youtuber/index.ts'
import { getVideoDetail } from '../video-detail/index.ts'
import type { LivestreamItem } from '../../data_type/livestream.ts'

export default async function searchStream(name: string): Promise<string | LivestreamItem> {
	const now = new Date()
	let isFullNameGet = false
	let youtuber: Youtuber | null = null

	try {
		const youtuberInCache = await redisGetWildCard(name.toLowerCase())
		if (youtuberInCache !== null && youtuberInCache != '') {
			youtuber = JSON.parse(youtuberInCache) as Youtuber
			if (youtuber.channelName !== undefined) {
				name = youtuber.channelName
				isFullNameGet = true
			}
			const latestStreamTime = new Date(youtuber.latestStreamTime)
			if (now < latestStreamTime) {
				console.info('using data from redis')
				return processOutput(youtuber)
			}
		}
		if (!isFullNameGet) {
			youtuber = await searchYoutuberByName(name)
		}
		if (youtuber === null || youtuber.channelID === undefined) {
			return ('No youtuber found. ' + name)
		}
		let upcomingStream: LivestreamItem | null
		let message: string
		if (process.env.GET_UPCOMING_V2) {
			[upcomingStream, message] = await getYoutuberUpcomingVideo(youtuber.channelID)
		} else {
			[upcomingStream, message] = await getYoutuberUpcomingVideoV2(youtuber.channelID)
			return upcomingStream as LivestreamItem
		}
		if (message != '' || upcomingStream == null) {
			return message
		}
		let upcomingStreamID = upcomingStream.id
		if (typeof upcomingStream.id != 'string') {
			upcomingStreamID = upcomingStream.id.videoId
		}
		const [videoInfo, latestStreamTime] = await getVideoDetail([upcomingStreamID as string])
		if (videoInfo === null || typeof videoInfo === 'string') {
			return 'Error' + videoInfo
		}
		youtuber.latestStreamLink = `https://www.youtube.com/watch?v=${upcomingStreamID}`
		youtuber.latestStreamTime = latestStreamTime
		redisSet(youtuber.channelName!, JSON.stringify(youtuber))
		return processOutput(youtuber)
	} catch (error) {
		console.error('Error fetching youtuber info:', error)
		return 'Failed to fetch youtuber info.' + error
	}
}

function processOutput(detail: Youtuber): string {
	const startTime = new Date(detail.latestStreamTime).toLocaleString('en-us', { timeZone: 'Asia/Bangkok' })
	const delay = new Date(detail.latestStreamTime).getTime() - Date.now()
	if (delay > 0) setNotification(detail.channelID as string, 'Its about to start! \n' + detail.latestStreamLink, delay)
	return ('Live time ' + startTime + '\n' + detail.latestStreamLink)
}