import type { GameSession, Player, RoundState, GameSettings, Tile } from '../types/game.model.js';

/**
 * Yeni bir oyun oturumu başlatır
 * 4 oyuncu ile oyun başlar ve ilk dağıtıcı rastgele seçilir
 */
export function initializeGame(
    playerIds: [string, string, string, string],
    gameSettings: GameSettings,
    totalRounds: number = 10
): GameSession {
    if (playerIds.length !== 4) {
        throw new Error('Oyun tam olarak 4 oyuncu ile oynanmalıdır');
    }

    // 4 oyuncu oluştur
    const players: Player[] = playerIds.map(playerId => ({
        playerId,
        hand: [],
        roundScore: 0,
        cumulativeScore: 0,
        hasOpened: false,
        openedWithPairs: false,
        lastOpeningValue: 0
    }));

    // İlk dağıtıcıyı rastgele seç (0-3 arası)
    const initialDealerIndex = Math.floor(Math.random() * 4);

    const gameSession: GameSession = {
        sessionId: generateSessionId(),
        players,
        gameSettings,
        roundHistory: [],
        currentRoundNumber: 0,
        totalRounds
    };

    return gameSession;
}

/**
 * Yeni bir tur başlatır
 * Dağıtıcı indeksi saat yönünün tersine (counter-clockwise) döner
 * @param previousDealerIndex - Önceki turun dağıtıcı indeksi
 * @returns Yeni dağıtıcı indeksi
 */
export function getNextDealerIndex(previousDealerIndex: number): number {
    // Saat yönünün tersine dönme: 0 -> 3 -> 2 -> 1 -> 0
    // 4 oyuncu için: (previousIndex - 1 + 4) % 4
    return (previousDealerIndex - 1 + 4) % 4;
}

/**
 * Dağıtıcıdan sonraki oyuncuyu bulur (saat yönünde)
 * İlk hamleyi dağıtıcının sağındaki oyuncu yapar
 */
export function getFirstPlayerIndex(dealerIndex: number): number {
    // Saat yönünde: 0 -> 1 -> 2 -> 3 -> 0
    return (dealerIndex + 1) % 4;
}

/**
 * Bir sonraki oyuncunun indeksini döner (saat yönünde)
 */
export function getNextPlayerIndex(currentPlayerIndex: number): number {
    return (currentPlayerIndex + 1) % 4;
}

/**
 * Yeni bir tur için RoundState oluşturur
 * @param dealerIndex - Bu turun dağıtıcı indeksi
 */
export function initializeRound(dealerIndex: number): Omit<RoundState, 'deck' | 'indicatorTile' | 'okeyTile'> {
    return {
        discardPile: [],
        tableMeld: [],
        currentPlayerIndex: getFirstPlayerIndex(dealerIndex),
        dealerIndex,
        roundStatus: 'inProgress'
    };
}

/**
 * Oyun oturumu için benzersiz ID üretir
 */
function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Oyun oturumunda yeni bir tur başlatır
 * Dağıtıcı otomatik olarak saat yönünün tersine döner
 */
export function startNewRound(gameSession: GameSession, previousDealerIndex?: number): number {
    let newDealerIndex: number;

    if (previousDealerIndex === undefined) {
        // İlk tur - rastgele dağıtıcı seç
        newDealerIndex = Math.floor(Math.random() * 4);
    } else {
        // Sonraki turlar - saat yönünün tersine döndür
        newDealerIndex = getNextDealerIndex(previousDealerIndex);
    }

    // Tur numarasını artır
    gameSession.currentRoundNumber += 1;

    // Oyuncuların tur skorlarını sıfırla
    gameSession.players.forEach(player => {
        player.hand = [];
        player.roundScore = 0;
        player.hasOpened = false;
        player.openedWithPairs = false;
        player.lastOpeningValue = 0;
    });

    return newDealerIndex;
}

/**
 * Dağıtıcı sırasını gösterir (debug/test için)
 */
export function getDealerRotationSequence(startingDealer: number, rounds: number): number[] {
    const sequence: number[] = [startingDealer];
    let currentDealer = startingDealer;

    for (let i = 1; i < rounds; i++) {
        currentDealer = getNextDealerIndex(currentDealer);
        sequence.push(currentDealer);
    }

    return sequence;
}

/**
 * Oyun durumu bilgisi döner
 */
export interface GameStateInfo {
    currentRound: number;
    totalRounds: number;
    dealerPlayerId: string;
    currentPlayerTurn: string;
    playerOrder: string[];
}

export function getGameStateInfo(
    gameSession: GameSession,
    roundState: RoundState
): GameStateInfo {
    return {
        currentRound: gameSession.currentRoundNumber,
        totalRounds: gameSession.totalRounds,
        dealerPlayerId: gameSession.players[roundState.dealerIndex].playerId,
        currentPlayerTurn: gameSession.players[roundState.currentPlayerIndex].playerId,
        playerOrder: gameSession.players.map(p => p.playerId)
    };
}

