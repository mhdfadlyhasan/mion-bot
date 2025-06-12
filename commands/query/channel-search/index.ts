import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import type { Youtuber } from '../../../data_type/youtuber'
import type { Livestream } from '../../../data_type/livestream.ts'
import { redisSet, redisGet } from '../../../tools/redis.ts/index.ts'


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
				await interaction.reply('https://www.youtube.com/watch?v=' + linkInCache as string)
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
			await interaction.reply(youtuber.items[0]?.snippet.channelTitle + 'https://www.youtube.com/watch?v=' + stream!.id.videoId)
			redisSet(youtuber.items[0]?.snippet.channelTitle as string, stream!.id.videoId)
		} catch (error) {
			console.error('Error fetching youtuber info:', error)
			await interaction.reply({
				content: 'Failed to fetch youtuber info.',
				ephemeral: true,
			})
		}
	},
}