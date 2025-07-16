import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import jishoSearch from '../../query/jisho-search'
import { sendTextWithButton } from '../../lib/text_button'
import { kanjiTree } from 'kanji'

export default {
	data: new SlashCommandBuilder()
		.setName('kanji')
		.setDescription('Detailed info of a kanji')
		.addStringOption(option =>
			option.setName('kanji')
				.setDescription('anything is fine')
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {

	},
}