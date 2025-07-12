import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, type ChatInputCommandInteraction } from "discord.js"

export async function sendTextWithButton(interaction: ChatInputCommandInteraction, messageList: string[]) {
	const next = new ButtonBuilder()
		.setCustomId('next')
		.setLabel('next')
		.setStyle(ButtonStyle.Primary)

	const back = new ButtonBuilder()
		.setCustomId('back')
		.setLabel('back')
		.setStyle(ButtonStyle.Secondary)

	let i = 0
	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(back, next)
	const message = await interaction.editReply({
		content: messageList[i],
		components: [row],
	})

	const collector = message.createMessageComponentCollector({
		componentType: ComponentType.Button,
		filter: btn => btn.user.id === interaction.user.id,
	})
	collector.on('collect', async btn => {
		if (btn.customId === 'next') {
			i = (i + 1) % messageList.length // wrap around
		} else if (btn.customId === 'back') {
			i = (i - 1 + messageList.length) % messageList.length // wrap around backwards
		}

		await btn.update({
			content: messageList[i],
			components: [row],
		})
	})

}
