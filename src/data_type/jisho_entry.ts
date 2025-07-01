type InflectionStep = {
	ruleId: string
	sourceTerm: string
	sourceCategory: string
	targetTerm: string
	targetCategory: string
}

type InflectionPath = InflectionStep[]

type QueryData = {
	strRaw: string
	str: string
	strSplit: string[]
	strJapanese: string
	strJapaneseSplit: string[]
	strHiragana: string
	kanji: string[]
	inflectionBreakdown: InflectionPath[]
	tags: string[]
}

type Example = {
	term: string
	ja: string
	en: string
}

type Sense = {
	gloss: string[]
	examples?: Example[]
}

export type Entry = {
	type?: string
	section?: string
	senses?: Sense[]
}

export type Jisho = {
	query: QueryData
	entries: Entry[]
}