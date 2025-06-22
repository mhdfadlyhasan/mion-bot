export function ParseTimeString(input: string): number | null {
	const match = input.match(/^(\d+)(s|m|h)$/)
	if (!match) return null

	const value = parseInt(match[1]!)
	const unit = match[2]

	switch (unit) {
		case 's': return value * 1000
		case 'm': return value * 60 * 1000
		case 'h': return value * 60 * 60 * 1000
		default: return null
	}
}