import type { JishoEntry } from '../../data_type/jisho_entry'

export default async function jishoSearch(word: string): Promise<string> {
	type JishoResponse = {
		meta: {
			status: number
		}
		data: JishoEntry[]
	}

	try {
		const link = `https://jisho.org/api/v1/search/words?keyword=${word}`
		const response = await fetch(link)
		const jsonResponse = await response.json() as JishoResponse
		const jishoEntry = jsonResponse.data[0] as JishoEntry
		const result = `**${jishoEntry.slug}** (${jishoEntry.is_common ? 'common' : 'uncommon'})\n Reading:[**${jishoEntry.japanese[0].reading}**], Meaning: ${jishoEntry.senses[0].english_definitions.join(', ')}`
		return result
	} catch (error) {
		console.error('Error fetching jisho info:', error)
		return 'Failed to fetch jisho info.' + error
	}
}