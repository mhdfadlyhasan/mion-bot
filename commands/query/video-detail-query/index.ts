import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import type { Youtuber } from '../../../data_type/youtuber'
import type { Livestream } from '../../../data_type/livestream.ts'

export async function getVideoDetail(idList: string[]): Promise<Livestream | string | null> {
	try {
		const link = `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${idList.join(',')}&key=${process.env.YOUTUBE_API_KEY}`
		const response = await fetch(link)
		if (!response.ok) {
			throw new Error(`Network response was not ok. Status: ${response.status}`)
		}
		const livestream = await response.json() as Livestream
		if (livestream.items.length === 0) {
			return null
		}
		return livestream
	} catch (error) {
		console.error('Error fetching livestream info:', error)
		return error as string
	}
}
