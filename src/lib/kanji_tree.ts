import { kanjiTree } from "kanji"
import { KanjiTree } from "../data_type/kanji_tree"

export async function breakDownKanji(word: string): Promise<KanjiTree> {
	const rawTree = kanjiTree(word)
	const parsedTree = KanjiTree.fromRaw(rawTree)

	//todo populate jisho
	return parsedTree
}
