import { kanjiTree } from "kanji"
import { KanjiTree } from "../data_type/kanji_tree"
import jishoSearch from "../query/jisho-search"

export async function breakDownKanji(word: string): Promise<[KanjiTree, string]> {
	const rawTree = kanjiTree(word)
	const parsedTree = KanjiTree.fromRaw(rawTree)
	let meaning = await jishoSearch(parsedTree.element)

	for (const child of parsedTree.child) {
		const temp = await jishoSearch(child)
		temp.map(value => meaning.push(value))
	}
	return [parsedTree, meaning.join('\n')]
}
