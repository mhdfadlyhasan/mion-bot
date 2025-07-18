import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

export function textMultiChoice(content: string, optionList: string[]): {
	content: string
	components: ActionRowBuilder<ButtonBuilder>[]
} {
	const row = new ActionRowBuilder<ButtonBuilder>()
	if (optionList.length === 0) {
		console.log("huh")

	}
	else {
		for (const option of optionList) {
			if (option === undefined) {
				continue
			}
			const button = new ButtonBuilder()
				.setCustomId(option)
				.setLabel(option)
				.setStyle(ButtonStyle.Primary)
			row.addComponents(button)
		}
	}

	return ({
		content: content,
		components: [row],
	})
}
