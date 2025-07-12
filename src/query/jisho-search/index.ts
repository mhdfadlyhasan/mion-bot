import type { Entry, Jisho } from '../../data_type/jisho_entry'
import { tokenize } from 'kuromojin'


async function splitJapanese(text: string) {
	const tokens = await tokenize(text)
	return mergeTokens(tokens)
}


function mergeTokens(tokens: Awaited<ReturnType<typeof tokenize>>) {
	const merged = []
	let i = 0
	if (tokens == null) {
		return
	}
	while (i < tokens.length) {
		const t = tokens[i]
		const t1 = tokens[i + 1]
		// Vている
		if (
			t &&
			t1 &&
			tokens[i + 2] &&
			t.pos === '動詞' &&
			t1.surface_form === 'て' &&
			t1.pos === '助詞' &&
			tokens[i + 2]!.basic_form === 'いる' &&
			tokens[i + 2]!.pos === '動詞'
		) {
			merged.push({
				surface: t.surface_form + t1.surface_form + tokens[i + 2]!.surface_form,
				reading: t.reading,
				basicForm: t.basic_form,
				conjugated_form: t.conjugated_form,
				word_position: t.word_position,
				pos: t.pos,
			})
			i += 3
		} else if (
			t &&
			t1 &&
			t.pos === '動詞' &&
			t1.pos === '助動詞'
		) {
			// verb and aux
			merged.push({
				surface: t.surface_form + t1.surface_form,
				reading: t.reading,
				basicForm: t.basic_form,
				conjugated_form: t.conjugated_form,
				word_position: t.word_position,
				pos: t.pos,
			})
			i += 2
		} else if (t) {
			merged.push({
				surface: t.surface_form,
				reading: t.reading,
				basicForm: t.basic_form,
				conjugated_form: t.conjugated_form,
				word_position: t.word_position,
				pos: t.pos,
			})
			i++
		}
	}
	return merged
}

export default async function jishoSearch(input: string): Promise<string[]> {
	const symbolsToRemove = [' ', ',', '、', '　']
	let result: string[] = []
	const cleaned = input
		.split('')
		.map(char => symbolsToRemove.includes(char) ? '' : char)
		.join('')

	const wordList = await splitJapanese(cleaned)
	console.log(wordList)
	try {
		if (wordList === undefined) {
			return result
		}
		for (const token of wordList) {
			const word = token.surface
			if (!word || word === '') continue
			const jsonResponse = await searchJisho(word)
			const jishoEntry = jsonResponse.entries?.[1] as Entry
			// if (!jishoEntry?.senses?.[0]) continue
			if (!jishoEntry || !jishoEntry.senses || !jishoEntry.senses[0]) {
				result.push(`Notfound entry: ${word}`)
				continue
			}
			console.log(jsonResponse.query)
			const entry = `**${token.surface}**\nReading: [**${token.reading}**], Meaning: ${jishoEntry.senses[0].gloss[0]}`
			result.push(entry)
		}
		return result
	} catch (error) {
		console.error('Error fetching jisho info:', error)
		return ['Failed to fetch jisho info. ' + error]
	}
}

const searchJisho = async (word: string): Promise<Jisho> => {
	const url = 'https://jisho.hlorenzi.com/api/v1/search'
	const payload = {
		query: word,
		limit: 1,
	}

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		})

		if (!response.ok) {
			const errorText = await response.text()
			throw new Error(`HTTP error ${response.status}: ${errorText}`)
		}

		const data = await response.json() as Jisho
		return data
	} catch (err) {
		console.error('Fetch error:', err)
		return null as unknown as Jisho
	}
}
