import type { Entry } from '../../data_type/jisho_entry'
import { tokenize } from 'kuromojin'
type JishoResponse = {
	meta: {
		status: number
	}
	data: Entry[]
}
export default async function jishoSearch(word: string): Promise<string> {

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
			console.log(token)
			word = token.basicForm
			console.log("this is the word '" + word + '"')
			if (word == '') {
				continue
			}
			const jsonResponse = await searchJisho(word)
			const jishoEntry = jsonResponse.data[0] as Entry
			const entry = `**${token.surface}** (${jishoEntry.is_common ? 'common' : 'uncommon'})\n Reading:[**${jishoEntry.japanese[0].reading}**], Meaning: ${jishoEntry.senses[0].english_definitions.join(', ')}\n`
			result += entry
		}
		return result
	} catch (error) {
		console.error('Error fetching jisho info:', error)
		return 'Failed to fetch jisho info.' + error
	}
}


const searchJisho = async (word: string): Promise<JishoResponse> => {
	const url = "https://jisho.hlorenzi.com/api/v1/search"
	console.log(word)
	const payload = {
		query: '見えてない',
		limit: 2
	}

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		})

		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(`HTTP error ${response.status}: ${errorText}`)
		}

		const data = await response.json() as JishoResponse
		console.log("API response:", data)
		return data
	} catch (err) {
		console.error("Fetch error:", err)
		return null as any
	}
}
