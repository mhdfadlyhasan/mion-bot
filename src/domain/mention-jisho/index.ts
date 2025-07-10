import { Message, MessageType, type OmitPartialGroupDMChannel } from "discord.js"
import jishoSearch from "../../query/jisho-search"
import { containsJapanese } from "../../lib/contain_japanese"

export async function mentionJisho(interaction: OmitPartialGroupDMChannel<Message<boolean>>) {
	let message: string = ''
	if (interaction.type == MessageType.Reply) {
		message += (await interaction.fetchReference()).content
	} else {
		message += interaction.content
	}

	if (containsJapanese(message)) {
		const cleaned = message.replace(/[^\u3040-\u30FF\u4E00-\u9FFF]/g, '')
		const deferReply = await interaction.channel.send("fetching! please wait")
		const result = await jishoSearch(cleaned)
		deferReply.edit(result)
	} else {
		interaction.reply('no japanese detected!')
	}
}
