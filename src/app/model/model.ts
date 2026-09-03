

export class DraftPlayer {
    constructor(
        public name: string,
        public deck: string,
    ) { }
}


export class DraftSession {
    constructor(
        public id: string,
        public date: Date,
        public players: DraftPlayer[] = [],

        public games: Game[] = []
    ) { }
}



export class Game {
    constructor(
        public round: number,
        public player1: string,
        public player2: string,
        public score1: number,
        public score2: number,
        public date: Date,
        public draftId: string
    ) { }
}

export class PlayerElo {
    constructor(
        public player: string,
        public elo: number,
        public oldElo: number,
        public date: Date,
        public round: number,
    ) { }
}