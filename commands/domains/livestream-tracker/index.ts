import { SlashCommandBuilder, ChatInputCommandInteraction, MessagePayload } from 'discord.js'
import type { Livestream } from '../../../data_type/livestream'
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
			await interaction.reply(result.items[0].snippet.title)
		} catch (error) {
			console.error('Error fetching livestream info:', error)
			await interaction.reply({
				content: 'Failed to fetch livestream info.',
				ephemeral: true,
			})
		}
	},
}