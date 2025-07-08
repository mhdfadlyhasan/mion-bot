import { SlashCommandBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'
import { searchYoutuberByName } from '../../query/search-youtuber'
import { redisGetKey, redisSet } from '../../tools/redis.ts'
import searchStream from '../../query/channel-search/index.ts'

export default {
	data: new SlashCommandBuilder()
		.setName('add-channel')
		.setDescription('Add a youtube channel')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('youtuber name')
				.setRequired(true),
		),
	async execute(interaction: ChatInputCommandInteraction) {
		const name = interaction.options.getString('name', true)
		const youtuber = await searchYoutuberByName(name)
		if (youtuber === undefined) {
			await interaction.reply('channel not found: ' + name)
			return
		}
		const confirm = new ButtonBuilder()
			.setCustomId('confirm')
			.setLabel('Confirm Youtuber Name')
			.setStyle(ButtonStyle.Primary)

		const cancel = new ButtonBuilder()
			.setCustomId('cancel')
			.setLabel('Cancel')
			.setStyle(ButtonStyle.Secondary)

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(cancel, confirm)

		const response = await interaction.reply({
			content: `Are you sure you want add **${youtuber.channelName}** to the streamer list?`,
			components: [row],
			withResponse: true,
		})
		const collectorFilter = (i: { user: { id: string } }) => i.user.id === interaction.user.id

		try {
			const confirmation = await response!.resource!.message!.awaitMessageComponent({ filter: collectorFilter, time: 60_000 })
			if (confirmation.customId === 'confirm') {
				const inRedis = await redisGetKey(youtuber.channelName!)

				if (inRedis[0] == undefined) {
					redisSet(youtuber.channelName!, '')
					searchStream(youtuber.channelName!)
					await confirmation.update({ content: `**${youtuber.channelName}** Has been added` })
				} else {
					await confirmation.update({ content: 'This channel already been added!' })
				}
			} else if (confirmation.customId === 'cancel') {
				await confirmation.update({ content: 'Cancelled', components: [] })
			}
		} catch {
			await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] })
		}
	},
}

