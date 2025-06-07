import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import type { Livestream } from '../../../data_type/livestream.ts'
const link = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&eventType=upcoming&channelId=${process.env.TEST_CHANNEL_ID}&key=${process.env.YOUTUBE_API_KEY}`

export default {
	data: new SlashCommandBuilder()
		.setName('livestream')
		.setDescription('Replies with livestream of a user!'),
	async execute(interaction: ChatInputCommandInteraction) {
		try {
			const response = await fetch(link)
			if (!response.ok) {
				throw new Error(`Network response was not ok. Status: ${response.status}`)
			}
			const result = await response.json() as Livestream
			if (result.items.length === 0) {
				await interaction.reply('No upcoming streams found.')
				return
			}
			const stream = result.items[0]
			await interaction.reply(stream?.snippet.title ?? '')
		} catch (error) {
			console.error('Error fetching livestream info:', error)
			await interaction.reply({
				content: 'Failed to fetch livestream info.',
				ephemeral: true,
			})
		}
	},
}