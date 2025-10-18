export interface Tile{
    id:number;
    color:'Red'|'Blue'|'Black'|'Yellow';
    value:number|null;
    isFalseJoker:boolean;
}

export interface Meld{
    type:'set'|'series';
    tiles:Tile[];
}

export interface RoundResult{
    roundNumber:number;
    scores:{
        playerId:string;
        score:number
    }[];
}

export interface Player{
    playerId:string;
    hand:Tile[];
    roundScore:number;
    cumulativeScore:number;
    hasOpened:boolean;
    openedWithPairs:boolean;
    lastOpeningValue:number;
}

export interface RoundState{
    deck:Tile[];
    discardPile:Tile[];
    tableMeld:Meld[];
    indicatorTile:Tile;
    okeyTile:Tile;
    currentPlayerIndex:number;
    dealerIndex:number;
    roundStatus:'inProgress'|'Finished'|'Voided';
}

export interface GameSettings{
    isFoldable:boolean;
    pointsForPairsFinish:number;
}

export interface GameSession{
    sessionId:string;
    players:Player[];
    gameSettings:GameSettings;
    roundHistory:RoundResult[];
    currentRoundNumber:number;
    totalRounds:number;
}

