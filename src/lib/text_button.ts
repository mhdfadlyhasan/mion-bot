import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, type ChatInputCommandInteraction } from "discord.js"

export async function sendTextWithButton(interaction: ChatInputCommandInteraction) {
	const strings = [
		'1',
		'2',
		'3',
		'4',
		'5',
	]
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
	const message = await interaction.reply({
		content: strings[i],
		components: [row],
	})

	const collector = message.createMessageComponentCollector({
		componentType: ComponentType.Button,
		filter: btn => btn.user.id === interaction.user.id,
	})
	collector.on('collect', async btn => {
		if (btn.customId === 'next') {
			i = (i + 1) % strings.length // wrap around
		} else if (btn.customId === 'back') {
			i = (i - 1 + strings.length) % strings.length // wrap around backwards
		}

		await btn.update({
			content: strings[i],
			components: [row],
		})
	})

}
