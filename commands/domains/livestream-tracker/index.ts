import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
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
			const result = await response.json()
			await interaction.reply(JSON.stringify(result))
		} catch (error) {
			console.error('Error fetching livestream info:', error)
			await interaction.reply({
				content: 'Failed to fetch livestream info.',
				ephemeral: true,
			})
		}
	},
}