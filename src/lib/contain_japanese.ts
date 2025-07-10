export function containsJapanese(text: string): boolean {
	// Hiragana range
	const hiraganaRegex = /[\u3040-\u309F]/
	// Katakana range
	const katakanaRegex = /[\u30A0-\u30FF]/
	// Common Kanji range (C-JK Unified Ideographs)
	const kanjiRegex = /[\u4E00-\u9FAF]/

	return hiraganaRegex.test(text) || katakanaRegex.test(text) || kanjiRegex.test(text)
}
