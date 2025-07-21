import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, type ChatInputCommandInteraction } from "discord.js"

export async function sendTextWithButton(interaction: ChatInputCommandInteraction, messageList: string[]) {
	const next = new ButtonBuilder()
		.setCustomId('next')
		.setLabel('Next')
		.setStyle(ButtonStyle.Primary)

	const back = new ButtonBuilder()
		.setCustomId('back')
		.setLabel('Back')
		.setStyle(ButtonStyle.Danger)
		.setDisabled(true)

	let start = 0
	let BATCH_LENGTH = 5
	let end = start + BATCH_LENGTH
	let row = new ActionRowBuilder<ButtonBuilder>().addComponents(back, next)
	const message = await interaction.editReply({
		content: messageList.slice(start, end).join('\n'),
		components: [row],
	})

	const collector = message.createMessageComponentCollector({
		componentType: ComponentType.Button,
		filter: btn => btn.user.id === interaction.user.id,
	})
	collector.on('collect', async btn => {
		if (btn.customId === 'next') {
			start = start + BATCH_LENGTH
		} else if (btn.customId === 'back') {
			start = start - BATCH_LENGTH  // wrap around backwards
		}
		if (start < 0 || start > messageList.length) start = 0
		end = start + BATCH_LENGTH

		if (end > messageList.length) {
			end = messageList.length
		}

		if (start > 0 && back.data.disabled) {
			back.setDisabled(false)
			row = new ActionRowBuilder<ButtonBuilder>().addComponents(back, next)
		} else if (start == 0 && !back.data.disabled) {
			back.setDisabled(true)
			row = new ActionRowBuilder<ButtonBuilder>().addComponents(back, next)
		}

		await btn.update({
			content: messageList.slice(start, end).join('\n'),
			components: [row],
		})
	})

}
