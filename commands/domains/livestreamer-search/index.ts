import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import searchStream from '../../query/channel-search/index.ts'

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
		if (message !== undefined) {
			await interaction.reply(message)
		}
	}
}