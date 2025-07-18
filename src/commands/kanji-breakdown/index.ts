import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { breakDownKanji } from '../../lib/kanji_tree'
import { textMultiChoice } from '../../lib/text_multichoice'

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
		const name = interaction.options.getString('kanji', true)
		const result = await breakDownKanji(name)
		const buttonList = textMultiChoice(result.element, result.child)
		interaction.reply(buttonList)
	},
}