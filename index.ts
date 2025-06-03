import { randomUUIDv7 } from 'bun'

console.log('Hello 望音!')
if (randomUUIDv7()) {
	console.log('chat is this true')
} else {
	console.log('chat is this is not true')
}