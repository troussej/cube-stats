export class Player {
    constructor(
        public name: string,
    ) { }
}

export class DraftPlayer {
    constructor(
        public name: string,
        public deck: string,
    ) { }
}


export class DraftSession {
    constructor(
        public date: Date,
        public players: DraftPlayer[] = [],

        public games: Game[] = []
    ) { }
}



export class Game {
    constructor(
        public round: number,
        public player1: Player,
        public player2: Player,
        public score1: number,
        public score2: number,
        public date: Date
    ) { }
}

export class PlayerElo {
    constructor(
        public player: Player,
        public elo: number,
        public date: Date
    ) { }
}