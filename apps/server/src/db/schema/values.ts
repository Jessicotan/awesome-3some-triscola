export const RoomStatus = {
	Waiting: 'waiting',
	Playing: 'playing',
	Closed: 'closed',
} as const
export const roomStatusValues = [RoomStatus.Waiting, RoomStatus.Playing, RoomStatus.Closed] as const

export const GameStatus = {
	Setup: 'setup',
	Playing: 'playing',
	Finished: 'finished',
	Abandoned: 'abandoned',
} as const
export const gameStatusValues = [
	GameStatus.Setup,
	GameStatus.Playing,
	GameStatus.Finished,
	GameStatus.Abandoned,
] as const

export const Suit = {
	Coins: 'coins',
	Cups: 'cups',
	Swords: 'swords',
	Batons: 'batons',
} as const
export const suitValues = [
	Suit.Coins,
	Suit.Cups,
	Suit.Swords,
	Suit.Batons,
] as const

export const CardRank = {
	Two: 'two',
	Four: 'four',
	Five: 'five',
	Six: 'six',
	Seven: 'seven',
	Jack: 'jack',
	Knight: 'knight',
	King: 'king',
	Three: 'three',
	Ace: 'ace',
} as const
export const cardRankValues = [
	CardRank.Two,
	CardRank.Four,
	CardRank.Five,
	CardRank.Six,
	CardRank.Seven,
	CardRank.Jack,
	CardRank.Knight,
	CardRank.King,
	CardRank.Three,
	CardRank.Ace,
] as const
