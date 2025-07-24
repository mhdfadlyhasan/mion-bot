import type { Livestream } from '../../data_type/livestream'

export async function getVideoDetail(idList: string[]): Promise<[string | Livestream | null, string]> {
	try {
		let startTime: string
		const link = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${idList.join(',')}&key=${process.env.YOUTUBE_API_KEY}`
		const response = await fetch(link)
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
	} catch (error) {
		console.error('Error fetching livestream info:', error)
		return [error as string, '']
	}
}

export async function getVideoDetailList(idList: string[]): Promise<Livestream | null> {
	if (idList.length == 0) return null
	try {
		const link = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${idList.join(',')}&key=${process.env.YOUTUBE_API_KEY}`
		console.log(link)
		const response = await fetch(link)
		if (!response.ok) {
			throw new Error(`Network response was not ok. Status: ${response.status}`)
		}
		const livestream = await response.json() as Livestream
		return livestream
	} catch (error: any) {
		console.error('Error fetching livestream info:', error)
		return null
	}
}
