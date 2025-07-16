import { kanjiTree } from "kanji"

export async function breakDownKanji(word: string) {
	const result = kanjiTree(word)
	console.log(JSON.stringify(result))
	// await interaction.deferReply()
	// const message = await jishoSearch(word)
	// if (message !== undefined) {
	// 	// sendTextWithButton(interaction, result)
	// }
}