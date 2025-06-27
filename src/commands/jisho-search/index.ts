import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import jishoSearch from '../../query/jisho-search'

export default {
	data: new SlashCommandBuilder()
		.setName('jisho')
		.setDescription('Search from jisho')
		.addStringOption(option =>
			option.setName('word')
				.setDescription('anything is fine')
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const name = interaction.options.getString('word', true)
		const message = await jishoSearch(name)
		if (message !== undefined) {
			await interaction.reply(message)
		}
	},
}