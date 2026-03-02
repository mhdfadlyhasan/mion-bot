import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, Message, type ChatInputCommandInteraction, type OmitPartialGroupDMChannel } from "discord.js"

export async function sendTextWithButton(interaction: ChatInputCommandInteraction | Message<true> | Message<false>, messageList: string[]) {
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
	let message: Message<boolean>

	if ('editReply' in interaction) {
		message = await interaction.editReply({
			content: messageList.slice(start, end).join('\n'),
			components: [row],
		})
	} else if ('edit' in interaction) {
		message = await interaction.edit({
			content: messageList.slice(start, end).join('\n'),
			components: [row],
		})
	}


	const collector = message!.createMessageComponentCollector({
		componentType: ComponentType.Button,
		idle: 60_000,
	})

	collector.on('collect', async btn => {
		if (btn.customId === 'next') {
			start = start + BATCH_LENGTH
		} else if (btn.customId === 'back') {
			start = Math.max(0, start - BATCH_LENGTH)
		}

		end = Math.min(start + BATCH_LENGTH, messageList.length)

		const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('back')
				.setLabel('Back')
				.setStyle(ButtonStyle.Danger)
				.setDisabled(start === 0),
			new ButtonBuilder()
				.setCustomId('next')
				.setLabel('Next')
				.setStyle(ButtonStyle.Primary)
				.setDisabled(end === messageList.length)
		)

		await btn.update({
			content: messageList.slice(start, end).join('\n'),
			components: [newRow],
		})
	})

	collector.on('end', async () => {
		await message.edit({ components: [] }).catch(() => null)
	})

}
