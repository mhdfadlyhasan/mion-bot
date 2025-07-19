export class KanjiTree {
	element: string
	child: string[]
	g: KanjiTree[]
	kind: string

	constructor(element: string, g: KanjiTree[], kind: string) {
		this.element = element
		this.g = g
		this.kind = kind
		this.child = g.map(child => child.element)
	}

	static fromRaw(obj: any): KanjiTree {
		const g = (obj.g || []).map((child: any) => KanjiTree.fromRaw(child))
		return new KanjiTree(obj.element, g, obj.kind)
	}
}
