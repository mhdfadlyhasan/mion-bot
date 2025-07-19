import { SlashCommandBuilder, ChatInputCommandInteraction, ComponentType } from 'discord.js'
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
		let [result, meaning] = await breakDownKanji(name)
		await interaction.deferReply()
		const buttonList = textMultiChoice(result.element + '\n' + meaning, result.child)
		const reply = await interaction.editReply(buttonList)

		const collector = reply.createMessageComponentCollector({
			componentType: ComponentType.Button,
			filter: btn => btn.user.id === interaction.user.id,
		})
		collector.on('collect', async btn => {
			const newEl = result.child[parseInt(btn.customId)]!
			const [newResult, meaning] = await breakDownKanji(newEl)
			const buttonList = textMultiChoice(newEl + '\n' + meaning, newResult.child)
			await btn.update(buttonList)
			result = newResult
		})
	},
}