import { sendMessage } from '../tools/client'

const notificationMap: { [key: string]: NodeJS.Timeout | null } = {}

export async function setNotification(name: string, message: string, delay: number) {
	if (delay > 0) {
		if (notificationMap[name] != null) {
			clearTimeout(notificationMap[name])
			console.log('clearing notification')
		}
		const timeout = setTimeout(() => {
			sendMessage(message)
		}, delay)
		notificationMap[name] = timeout
	}
}