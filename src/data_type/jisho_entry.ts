export type JishoEntry = {
	slug: string
	is_common: boolean,
	jlpt: string[],
	japanese: [
		{
			word: string,
			reading: string
		}
	],
	senses: [
		{
			english_definitions: string[],
			parts_of_speech: string[],
			links: [],
			tags: [],
			restrictions: [],
			see_also: [],
			antonyms: string[],
			source: [],
			info: []
		}
		// tags: [],
	],
	// attribution: {
	// 	jmdict: true,
	// 	jmnedict: false,
	// 	dbpedia: false
	// }
}
