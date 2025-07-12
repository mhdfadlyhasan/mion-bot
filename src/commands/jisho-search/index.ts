import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import jishoSearch from '../../query/jisho-search'
import { sendTextWithButton } from '../../lib/text_button'

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
		const word = interaction.options.getString('word', true)
		await interaction.deferReply()
		const message = await jishoSearch(word)
		if (message !== undefined) {
			sendTextWithButton(interaction, message)
		}
	},
}