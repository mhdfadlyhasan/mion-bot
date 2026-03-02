import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

export function textMultiChoice(content: string, optionList: string[]): {
	content: string
	components: ActionRowBuilder<ButtonBuilder>[]
} {
	const row = new ActionRowBuilder<ButtonBuilder>()
	if (!optionList || optionList.length === 0) {
		const button = new ButtonBuilder()
			.setCustomId('0')
			.setLabel('No child')
			.setDisabled(true)
			.setStyle(ButtonStyle.Primary)
		row.addComponents(button)
		return ({
			content: content,
			components: [row],
		})
	}

	for (let idx = 0; idx < optionList.length; idx++) {
		const option = optionList[idx]
		if (option === undefined || option === null) {
			continue
		}
		const button = new ButtonBuilder()
			.setCustomId(idx.toString())
			.setLabel(option)
			.setStyle(ButtonStyle.Primary)

		return ({
			content: content,
			components: [row],
		})
	}
