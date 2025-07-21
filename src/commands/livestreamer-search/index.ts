import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import searchStream from '../../query/channel-search'

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
		const name = interaction.options.getString('name', true)
		const message = await searchStream(name)

		// const processOutput = function processOutput(detail: Youtuber): string {
		// 	const startTime = new Date(detail.latestStreamTime).toLocaleString('en-us', { timeZone: 'Asia/Bangkok' })
		// 	const delay = new Date(detail.latestStreamTime).getTime() - Date.now()
		// 	setNotification(detail.channelID as string, 'Its about to start! \n' + detail.latestStreamLink, delay)
		// 	return ('Live time ' + startTime + '\n' + detail.latestStreamLink)
		// }

		if (message !== undefined) {
			await interaction.reply(message)
		}
	},
}