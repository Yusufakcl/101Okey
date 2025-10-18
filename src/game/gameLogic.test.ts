import {
    initializeGame,
    getNextDealerIndex,
    getFirstPlayerIndex,
    getNextPlayerIndex,
    startNewRound,
    getDealerRotationSequence
} from './gameLogic.js';
import type { GameSettings } from '../types/game.model.js';

/**
 * Bu dosya oyun mantığının nasıl çalıştığını gösterir
 */

console.log('=== 101 Okey Oyun Mantığı Test ===\n');

// 1. Oyun Başlatma
console.log('1. OYUN BAŞLATMA');
console.log('-'.repeat(50));

const playerIds: [string, string, string, string] = ['Oyuncu1', 'Oyuncu2', 'Oyuncu3', 'Oyuncu4'];
const gameSettings: GameSettings = {
    isFoldable: true,
    pointsForPairsFinish: 2
};

const gameSession = initializeGame(playerIds, gameSettings, 8);
console.log(`Oyun Oturumu ID: ${gameSession.sessionId}`);
console.log(`Toplam Oyuncu: ${gameSession.players.length}`);
console.log(`Oyuncular: ${gameSession.players.map(p => p.playerId).join(', ')}`);
console.log(`Toplam Tur: ${gameSession.totalRounds}\n`);

// 2. Dağıtıcı Rotasyonu Testi
console.log('2. DAĞITICI ROTASYONU (Saat Yönünün Tersine)');
console.log('-'.repeat(50));

// İlk tur için rastgele dağıtıcı belirle
let currentDealerIndex = Math.floor(Math.random() * 4);
console.log(`İlk Tur Dağıtıcısı: Oyuncu ${currentDealerIndex + 1} (${playerIds[currentDealerIndex]})`);

// 8 tur için dağıtıcı rotasyonunu göster
const dealerSequence = getDealerRotationSequence(currentDealerIndex, 8);
console.log('\nDağıtıcı Sırası (8 Tur):');
dealerSequence.forEach((dealerIdx, round) => {
    const firstPlayer = getFirstPlayerIndex(dealerIdx);
    console.log(
        `Tur ${round + 1}: Dağıtıcı = Oyuncu ${dealerIdx + 1} (${playerIds[dealerIdx]}), ` +
        `İlk Oynayan = Oyuncu ${firstPlayer + 1} (${playerIds[firstPlayer]})`
    );
});

// 3. Oyuncu Sırası Testi
console.log('\n3. OYUNCU SIRASI (Saat Yönünde)');
console.log('-'.repeat(50));
console.log('Oyun sırası saat yönünde ilerler: Oyuncu1 → Oyuncu2 → Oyuncu3 → Oyuncu4 → Oyuncu1...');

let playerIndex = 0;
console.log('\nBir turun hamle sırası:');
for (let i = 0; i < 8; i++) {
    console.log(`Hamle ${i + 1}: Oyuncu ${playerIndex + 1} (${playerIds[playerIndex]})`);
    playerIndex = getNextPlayerIndex(playerIndex);
}

// 4. Dağıtıcı Rotasyon Mantığı Açıklaması
console.log('\n4. DAĞITICI ROTASYON MANTIĞI');
console.log('-'.repeat(50));
console.log('Saat yönünün tersine (counter-clockwise):');
console.log('  Oyuncu 0 → Oyuncu 3 → Oyuncu 2 → Oyuncu 1 → Oyuncu 0');
console.log('  Formül: (currentIndex - 1 + 4) % 4');
console.log('\nÖrnekler:');
for (let i = 0; i < 4; i++) {
    const next = getNextDealerIndex(i);
    console.log(`  Oyuncu ${i} dağıtıcı ise, sonraki tur Oyuncu ${next} dağıtıcı olur`);
}

// 5. Tam Oyun Simülasyonu
console.log('\n5. TAM OYUN SİMÜLASYONU');
console.log('-'.repeat(50));

const fullGame = initializeGame(
    ['Ali', 'Ayşe', 'Mehmet', 'Fatma'],
    gameSettings,
    4
);

console.log(`\nOyun Oturumu: ${fullGame.sessionId}`);
console.log(`Oyuncular: ${fullGame.players.map(p => p.playerId).join(', ')}\n`);

let dealerIdx: number | undefined = undefined;
for (let round = 0; round < 4; round++) {
    dealerIdx = startNewRound(fullGame, dealerIdx);
    const firstPlayerIdx = getFirstPlayerIndex(dealerIdx);
    
    const dealer = fullGame.players[dealerIdx];
    const firstPlayer = fullGame.players[firstPlayerIdx];
    const player2 = fullGame.players[getNextPlayerIndex(firstPlayerIdx)];
    const player3 = fullGame.players[getNextPlayerIndex(getNextPlayerIndex(firstPlayerIdx))];
    const player4 = fullGame.players[getNextPlayerIndex(getNextPlayerIndex(getNextPlayerIndex(firstPlayerIdx)))];
    
    if (!dealer || !firstPlayer || !player2 || !player3 || !player4) continue;
    
    console.log(`Tur ${fullGame.currentRoundNumber}:`);
    console.log(`  Dağıtıcı: ${dealer.playerId} (indeks: ${dealerIdx})`);
    console.log(`  İlk Oynayan: ${firstPlayer.playerId} (indeks: ${firstPlayerIdx})`);
    console.log(`  Oyun Sırası: ${firstPlayer.playerId} → ${player2.playerId} → ${player3.playerId} → ${player4.playerId}`);
}

console.log('\n=== Test Tamamlandı ===');

