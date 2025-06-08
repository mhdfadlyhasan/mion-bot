import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { ParseTimeString } from './parse_time'

export default {
	data: new SlashCommandBuilder()
		.setName('remind')
		.setDescription('Set a reminder')
		.addStringOption(option =>
			option.setName('time')
				.setDescription('When to remind (e.g. 10s, 5m, 1h)')
				.setRequired(true),
		).addStringOption(option =>
			option.setName('message')
				.setDescription('The reminder message')
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const time = interaction.options.getString('time', true)
		const message = interaction.options.getString('message', true)
		const ms = ParseTimeString(time)

		if (ms === null) {
			await interaction.reply({
				content: 'Invalid time format. Use s, m, or h (e.g. 10s, 5m, 1h).',
			})
			return
		}
		await interaction.reply({
			content: 'Set',
		})

		setTimeout(() => {
			interaction.followUp({
				content: `<@${interaction.user.id}> Reminder: **${message}**`,
			})
		}, ms)
	},
}

