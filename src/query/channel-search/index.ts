import type { Youtuber } from '../../data_type/youtuber.ts'
import { redisGetWildCard, redisSet } from '../../tools/redis.ts/index.ts'
import { setNotification } from '../../lib/notification.ts'
import { getYoutuberUpcomingVideo, getYoutuberUpcomingVideoV2 } from '../youtuber-upcoming-video-query/index.ts'
import { searchYoutuberByName } from '../search-youtuber/index.ts'
import { getVideoDetail, getVideoDetailList } from '../video-detail/index.ts'
import type { LivestreamItem } from '../../data_type/livestream.ts'
function processOutput(detail: Youtuber): string {
	const startTime = new Date(detail.latestStreamTime).toLocaleString('en-us', { timeZone: 'Asia/Bangkok' })
	const delay = new Date(detail.latestStreamTime).getTime() - Date.now()
	setNotification(detail.channelID as string, 'Its about to start! \n' + detail.latestStreamLink, delay)
	return ('Live time ' + startTime + '\n' + detail.latestStreamLink)
}
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


export async function searchStreamList(nameList: string[]): Promise<string | LivestreamItem> {
	const now = new Date()
	let isFullNameGet = false
	let youtuberMap = new Map<string, Youtuber>()

	let upcomingStreamIDList: string[] = []

	for (let name in nameList) {
		try {
			let youtuber: Youtuber
			const youtuberInCache = await redisGetWildCard(name.toLowerCase())
			if (youtuberInCache !== null && youtuberInCache != '') {
				const youtuber = JSON.parse(youtuberInCache) as Youtuber
				if (youtuber.channelName !== undefined) {
					name = youtuber.channelName
					isFullNameGet = true
				}
				const latestStreamTime = new Date(youtuber.latestStreamTime)
				if (now < latestStreamTime) {
					// console.info('using data from redis')
					// processOutput(youtuber)
					// continue
				}
			}
			if (!isFullNameGet) {
				youtuber = await searchYoutuberByName(name)
				youtuberMap.set(youtuber.channelName!, youtuber)
				if (youtuber === null || youtuber.channelID === undefined) {
					return ('No youtuber found. ' + name)
				}
			}
			let upcomingStream: LivestreamItem | null
			let message: string
			[upcomingStream, message] = await getYoutuberUpcomingVideoV2(youtuber!.channelID!)
			if (message != '' || upcomingStream == null) {
				console.log(message)
				return message
			}
			upcomingStreamIDList.push(upcomingStream.id.videoId)
		} catch (error) {
			console.error('Error fetching youtuber info:', error)
			return 'Failed to fetch youtuber info.' + error
		}
	}


	const [videoInfoList] = await getVideoDetailList(upcomingStreamIDList)
	for (const video of videoInfoList!) {
		const youtuber = youtuberMap.get(video.snippet.channelTitle)!
		youtuber.latestStreamLink = `https://www.youtube.com/watch?v=${video.id.videoId}`
		youtuber.latestStreamTime = video.liveStreamingDetails?.scheduledStartTime
		redisSet(youtuber.channelName!, JSON.stringify(youtuber))
		console.log(processOutput(youtuber))
	}
	return ''
}