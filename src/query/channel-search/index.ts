import type { Youtuber } from '../../data_type/youtuber.ts'
import { getVideoDetail } from '../video-detail-query/index.ts'
import { redisGetWildCard, redisSet } from '../../tools/redis.ts/index.ts'
import { searchYoutuberByName } from '../../lib/search_youtuber.ts'
import { setNotification } from '../../lib/notification.ts'
import { getYoutuberUpcomingVideo } from '../youtuber-upcoming-video-query/index.ts'

export default async function searchStream(name: string): Promise<string> {
	const now = new Date()
	const processOutput = function processOutput(detail: Youtuber): string {
		const startTime = new Date(detail.latestStreamTime).toLocaleString('en-us', { timeZone: 'Asia/Bangkok' })
		const delay = new Date(detail.latestStreamTime as string).getTime() - Date.now()
		setNotification(detail.channelID as string, 'Its about to start! \n' + detail.latestStreamLink, delay)
		return ('Live time ' + startTime + '\n' + detail.latestStreamLink)
	}
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
		const upcomingStream = await getYoutuberUpcomingVideo(youtuber.channelID)
		if (typeof upcomingStream === 'string') {
			return upcomingStream
		}
		const [videoInfo, latestStreamTime] = await getVideoDetail([upcomingStream.id.videoId])
		if (videoInfo === null || typeof videoInfo === 'string') {
			return 'Error' + videoInfo
		}
		youtuber.latestStreamLink = `https://www.youtube.com/watch?v=${upcomingStream.id.videoId}`
		youtuber.latestStreamTime = latestStreamTime
		redisSet(youtuber.channelName!, JSON.stringify(youtuber))
		return processOutput(youtuber)
	} catch (error) {
		console.error('Error fetching youtuber info:', error)
		return 'Failed to fetch youtuber info.' + error
	}
}