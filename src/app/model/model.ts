

export class DraftPlayer {

    constructor(
        public name: string,
        public deck: string,
        public wins: number = 0,
        public losses: number = 0,
        public draws: number = 0,
        public score: number = 0
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
        public draftId: string,
        public eloChange1?: PlayerEloChange,
        public eloChange2?: PlayerEloChange
    ) { }
}

export class PlayerEloChange {
    constructor(
        public player: string,
        public elo: number,
        public oldElo: number,
        public date: Date,
        public round: number,
    ) { }
}

