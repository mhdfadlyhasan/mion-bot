import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import type { Youtuber } from '../../../data_type/youtuber'
import type { Livestream } from '../../../data_type/livestream.ts'
import { redisSet, redisGet, redisSetJson } from '../../../tools/redis.ts/index.ts'
import { getVideoDetail } from '../video-detail-query/index.ts'


export default {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Search a youtuber')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('youtuber name')
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		try {
			const name = interaction.options.getString('name', true)
			const linkInCache = await redisGet(name)
			if (linkInCache !== null) {
				console.info('using data from redis')
				const detail = JSON.parse(linkInCache) as Youtuber
				await interaction.reply('Live time ' + detail.latestStreamTime + '\n' + detail.latestStreamLink)
				return
			}
			const link = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${name}}&key=${process.env.YOUTUBE_API_KEY}`
			const response = await fetch(link)
			if (!response.ok) {
				throw new Error(`Network response was not ok. Status: ${response.status}`)
			}
			const youtuber = await response.json() as Youtuber
			if (youtuber.items.length === 0) {
				await interaction.reply('No channels found.')
				return
			}

			const linkStream = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=upcoming&channelId=${youtuber.items[0]?.id.channelId}&key=${process.env.YOUTUBE_API_KEY}`
			const latestStream = await fetch(linkStream)
			if (!latestStream.ok) {
				throw new Error(`Network latestStream was not ok. Status: ${latestStream.status}`)
			}
			const result = await latestStream.json() as Livestream
			if (result.items.length === 0) {
				await interaction.reply('No upcoming streams found.')
				return
			}
			const stream = result.items[0]
			const videoInfo = await getVideoDetail([String(result.items[0]?.id.videoId)])
			if (videoInfo === null || typeof videoInfo === 'string') {
				throw 'Error'
			}
			var startTime: string
			if (videoInfo.items[0]?.liveStreamingDetails.scheduledStartTime == null) {
				startTime = 'unknown'
			} else {
				startTime = new Date(videoInfo.items[0]?.liveStreamingDetails.scheduledStartTime).toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
			}
			await interaction.reply('Live time ' + startTime + '\n' + youtuber.items[0]?.snippet.channelTitle + 'https://www.youtube.com/watch?v=' + stream!.id.videoId)
			redisSet(youtuber.items[0]?.snippet.channelTitle as string, stream!.id.videoId)
			youtuber.latestStreamLink = 'https://www.youtube.com/watch?v=' + stream!.id.videoId
			youtuber.latestStreamTime = startTime
			redisSetJson(youtuber.items[0]?.snippet.channelTitle as string, youtuber)
		} catch (error) {
			console.error('Error fetching youtuber info:', error)
			await interaction.reply({
				content: 'Failed to fetch youtuber info.',
				ephemeral: true,
			})
		}
	},
}