import type { JishoEntry } from '../../data_type/jisho_entry'
import { tokenize } from 'kuromojin'
export default async function jishoSearch(word: string): Promise<string> {
	type JishoResponse = {
		meta: {
			status: number
		}
		data: JishoEntry[]
	}
	const symbolsToRemove = [' ', ',', '、', '　']
	const cleaned = word
		.split('')
		.map(char => symbolsToRemove.includes(char) ? '' : char)
		.join('')
	async function splitJapanese(text: string) {
		const tokens = await tokenize(text)
		return tokens.map(t => ({
			surface: t.surface_form,
			reading: t.reading,
			basicForm: t.basic_form,
			conjugated_form: t.conjugated_form,
			word_position: t.word_position,
			pos: t.pos,
		}))


	}
	const wordList = await splitJapanese(cleaned)
	try {
		let result: string = ''
		for (const token of wordList) {
			word = token.surface
			if (token.pos == '助詞') {
				//	particle
				word += ' %23particle'
			}
			const link = `https://jisho.org/api/v1/search/words?keyword=${word}`
			const response = await fetch(link)
			const jsonResponse = await response.json() as JishoResponse
			const jishoEntry = jsonResponse.data[0] as JishoEntry
			const entry = `**${jishoEntry.slug == null ? '' : jishoEntry.slug}** (${jishoEntry.is_common ? 'common' : 'uncommon'})\n Reading:[**${jishoEntry.japanese[0].reading}**], Meaning: ${jishoEntry.senses[0].english_definitions.join(', ')}\n`
			result += entry
		}
		return result
	} catch (error) {
		console.error('Error fetching jisho info:', error)
		return 'Failed to fetch jisho info.' + error
	}
}