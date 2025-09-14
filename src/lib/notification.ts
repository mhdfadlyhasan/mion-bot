import { sendMessage } from '../tools/client'

const notificationMap: { [key: string]: NodeJS.Timeout | null } = {}
const now = Date.now()
const ONE_HOUR = 1000 * 60 * 60

export async function setNotification(name: string, message: string, delay: number) {
	const isStartingSoon = delay > 0 && delay <= ONE_HOUR
	if (isStartingSoon) {
		if (notificationMap[name] != null) {
			clearTimeout(notificationMap[name])
		}
		const timeout = setTimeout(() => {
			sendMessage(message)
		}, delay)
		notificationMap[name] = timeout
	}
}