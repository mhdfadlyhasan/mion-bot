import type { Livestream } from '../../data_type/livestream'

export async function getVideoDetail(idList: string[]): Promise<[string | Livestream | null, string]> {
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), 10000)
	try {
		let startTime: string
		const link = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${idList.join(',')}&key=${process.env.YOUTUBE_API_KEY}`
		const response = await fetch(link, { signal: controller.signal })
		clearTimeout(timeoutId)
		if (!response.ok) {
			throw new Error(`Network response was not ok. Status: ${response.status}`)
		}
		const livestream = await response.json() as Livestream
		if (livestream.items.length === 0) {
			return [null, '']
		}
		if (livestream.items[0]?.liveStreamingDetails.scheduledStartTime == null) {
			startTime = 'unknown'
		} else {
			startTime = new Date(livestream.items[0]?.liveStreamingDetails.scheduledStartTime).toString()
		}
		return [livestream, startTime]
	} catch (error: unknown) {
		clearTimeout(timeoutId)
		console.error('Error fetching livestream info:', error)
		if (error instanceof Error && error.name === 'AbortError') {
			return ['Request timeout while fetching video details', '']
		}
		const message = error instanceof Error ? error.message : String(error)
		return [message, '']
	}
}

export async function getVideoDetailList(idList: string[]): Promise<Livestream | null> {
	if (idList.length === 0) return null
	const controller = new AbortController()
	const timeoutId = setTimeout(() => controller.abort(), 10000)
	try {
		const link = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${idList.join(',')}&key=${process.env.YOUTUBE_API_KEY}`
		const response = await fetch(link, { signal: controller.signal })
		clearTimeout(timeoutId)
		if (!response.ok) {
			throw new Error(`Network response was not ok. Status: ${response.status}`)
		}
		const livestream = await response.json() as Livestream
		return livestream
	} catch (error: unknown) {
		clearTimeout(timeoutId)
		console.error('Error fetching livestream info list:', error)
		return null
	}
}
