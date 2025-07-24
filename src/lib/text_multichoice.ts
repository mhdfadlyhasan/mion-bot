import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

export function textMultiChoice(content: string, optionList: string[]): {
	content: string
	components: ActionRowBuilder<ButtonBuilder>[]
} {
	const row = new ActionRowBuilder<ButtonBuilder>()
	if (optionList.length === 0) {
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
	else {
		for (const idx in optionList) {
			if (optionList[idx] === undefined) {
				continue
			}
			const button = new ButtonBuilder()
				.setCustomId(idx)
				.setLabel(optionList[idx])
				.setStyle(ButtonStyle.Primary)
			row.addComponents(button)
		}
	}

	return ({
		content: content,
		components: [row],
	})
}
