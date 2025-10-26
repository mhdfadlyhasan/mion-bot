import type { LivestreamItem } from "../../data_type/livestream"
import { hasUpcomingStream, type Youtuber } from "../../data_type/youtuber"
import { setNotification } from "../../lib/notification.ts"
import { FindYoutuberFromCache, searchYoutuberByName } from "../../query/search-youtuber"
import { getVideoDetailList } from "../../query/video-detail"
import { getYoutuberUpcomingVideoV2 } from "../../query/youtuber-upcoming-video-query"
import { redisSet } from "../../tools/redis/index.ts"

export async function searchStreamList(nameList: string[]): Promise<string> {
	let youtuberMap = new Map<string, Youtuber>()
	let upcomingStreamIDList: string[] = []

	for (let name of nameList) {
		try {
			let [youtuber, fullName] = await FindYoutuberFromCache(name)
			if (youtuber != null && hasUpcomingStream(youtuber)) {
				processOutput(youtuber)
				continue
			} else if (youtuber == null) {
				youtuber = await searchYoutuberByName(fullName)
				if (youtuber === null || youtuber.channelID === undefined) {
					console.log('No youtuber found. ' + fullName)
					continue
				}
			}
			const [upcomingStream, message] = await getYoutuberUpcomingVideoV2(youtuber!.channelID!)
			if (message != '' || upcomingStream == null) {
				console.info(message)
				continue
			}
			if (typeof upcomingStream.id == 'string') {
				continue
			}
			youtuberMap.set(upcomingStream.id.videoId, youtuber!)
			upcomingStreamIDList.push(upcomingStream.id.videoId)
		} catch (error) {
			console.error('Error fetching youtuber info:', error)
			return 'Failed to fetch youtuber info.' + error
		}
	}


	const videoInfoList = await getVideoDetailList(upcomingStreamIDList)
	if (videoInfoList == null) {
		return ''
	}
	for (const videoDetail of videoInfoList.items) {
		if (videoDetail.liveStreamingDetails == null) {
			return 'Failed to fetch youtuber info.'
		}
		if (typeof videoDetail.id != 'string') {
			continue
		}
		const youtuber = youtuberMap.get(videoDetail.id)!
		youtuber.latestStreamLink = `https://www.youtube.com/watch?v=${videoDetail.id}`
		youtuber.latestStreamTime = videoDetail.liveStreamingDetails?.scheduledStartTime
		redisSet(youtuber.channelName!, JSON.stringify(youtuber))
		console.info(processOutput(youtuber))
	}
	return 'completed'
}




function processOutput(detail: Youtuber): string {
	const startTime = new Date(detail.latestStreamTime).toLocaleString('en-us', { timeZone: 'Asia/Bangkok' })
	const delay = new Date(detail.latestStreamTime).getTime() - Date.now()
	if (delay > 0) setNotification(detail.channelID as string, 'Its about to start! ' + detail.channelName + "\n" + detail.latestStreamLink, delay)
	return ('Live time ' + startTime + '\n' + detail.latestStreamLink)
}