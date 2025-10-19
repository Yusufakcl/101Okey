# 101 Okey Oyun Mantığı

## Genel Bakış

Bu modül 101 Okey oyununun temel mantığını içerir. Oyun 4 oyuncu ile oynanır ve dağıtıcı rolü her turda saat yönünün tersine döner.

## Temel Kurallar

### Oyuncu Sayısı
- Oyun **tam olarak 4 oyuncu** ile oynanır
- Her oyuncu sırayla hamle yapar

### Dağıtıcı Sistemi
- İlk tur için dağıtıcı **rastgele** seçilir
- Sonraki turlarda dağıtıcı **saat yönünün tersine (counter-clockwise)** döner
- Rotasyon: Oyuncu 0 → Oyuncu 3 → Oyuncu 2 → Oyuncu 1 → Oyuncu 0

### Oyun Sırası
- Oyuncular **saat yönünde (clockwise)** oynар
- İlk hamleyi dağıtıcının **sağındaki oyuncu** yapar
- Sıra: Oyuncu 0 → Oyuncu 1 → Oyuncu 2 → Oyuncu 3 → Oyuncu 0

## Ana Fonksiyonlar

### `initializeGame()`
Yeni bir oyun oturumu başlatır.

```typescript
const playerIds: [string, string, string, string] = [
    'Ali', 
    'Ayşe', 
    'Mehmet', 
    'Fatma'
];

const gameSettings: GameSettings = {
    isFoldable: true,
    pointsForPairsFinish: 2
};

const gameSession = initializeGame(playerIds, gameSettings, 10);
// 10 tur olarak başlatır
```

**Parametreler:**
- `playerIds`: Tam olarak 4 oyuncu ID'si içeren tuple
- `gameSettings`: Oyun ayarları
- `totalRounds`: Toplam tur sayısı (varsayılan: 10)

**Döner:** `GameSession` objesi

---

### `startNewRound()`
Yeni bir tur başlatır ve dağıtıcıyı otomatik olarak döndürür.

```typescript
let dealerIndex = startNewRound(gameSession);
// İlk tur: rastgele dağıtıcı

dealerIndex = startNewRound(gameSession, dealerIndex);
// Sonraki turlar: otomatik rotasyon
```

**Parametreler:**
- `gameSession`: Mevcut oyun oturumu
- `previousDealerIndex`: Önceki turun dağıtıcı indeksi (opsiyonel)

**Döner:** Yeni dağıtıcı indeksi

---

### `getNextDealerIndex()`
Bir sonraki dağıtıcının indeksini hesaplar (saat yönünün tersine).

```typescript
const nextDealer = getNextDealerIndex(currentDealerIndex);
// 0 → 3, 1 → 0, 2 → 1, 3 → 2
```

**Formül:** `(currentIndex - 1 + 4) % 4`

---

### `getFirstPlayerIndex()`
Dağıtıcıdan sonra ilk oynayacak oyuncunun indeksini döner.

```typescript
const firstPlayer = getFirstPlayerIndex(dealerIndex);
// Dağıtıcının sağındaki oyuncu
```

**Formül:** `(dealerIndex + 1) % 4`

---

### `getNextPlayerIndex()`
Sıradaki oyuncunun indeksini döner (saat yönünde).

```typescript
const nextPlayer = getNextPlayerIndex(currentPlayerIndex);
// 0 → 1, 1 → 2, 2 → 3, 3 → 0
```

**Formül:** `(currentIndex + 1) % 4`

---

### `initializeRound()`
Yeni bir tur için `RoundState` objesi oluşturur.

```typescript
const roundState = initializeRound(dealerIndex);
```

---

### `prepareTileBales()`
Oyun taşlarını karıştırır, 15 adet 7'li balya oluşturur ve artan 1 taşı döner.

```typescript
const tileSetup = prepareTileBales();
// tileSetup.bales -> 15 balya, her biri 7 taş
// tileSetup.remainingTile -> Artan 1 taş
```

---

### `getDealerRotationSequence()`
Belirli sayıda tur için dağıtıcı sırasını gösterir (test/debug için).

```typescript
const sequence = getDealerRotationSequence(startingDealer, 8);
// [2, 1, 0, 3, 2, 1, 0, 3]
```

---

### `getGameStateInfo()`
Oyunun mevcut durumu hakkında bilgi döner.

```typescript
const info = getGameStateInfo(gameSession, roundState);
// {
//   currentRound: 3,
//   totalRounds: 10,
//   dealerPlayerId: "Ali",
//   currentPlayerTurn: "Ayşe",
//   playerOrder: ["Ali", "Ayşe", "Mehmet", "Fatma"]
// }
```

## Kullanım Örneği

### Tam Bir Oyun Oturumu

```typescript
import {
    initializeGame,
    startNewRound,
    getFirstPlayerIndex,
    getNextPlayerIndex,
    initializeRound
} from './game/gameLogic.js';

// 1. Oyunu başlat
const gameSession = initializeGame(
    ['Oyuncu1', 'Oyuncu2', 'Oyuncu3', 'Oyuncu4'],
    { isFoldable: true, pointsForPairsFinish: 2 },
    8 // 8 tur
);

// 2. Her tur için
let dealerIndex: number | undefined = undefined;

for (let i = 0; i < gameSession.totalRounds; i++) {
    // Yeni turu başlat
    dealerIndex = startNewRound(gameSession, dealerIndex);
    
    // Round state oluştur
    const roundState = initializeRound(dealerIndex);
    
    // İlk oyuncuyu bul
    let currentPlayerIdx = roundState.currentPlayerIndex;
    
    console.log(`Tur ${gameSession.currentRoundNumber}`);
    console.log(`Dağıtıcı: ${gameSession.players[dealerIndex]?.playerId}`);
    console.log(`İlk Oynayan: ${gameSession.players[currentPlayerIdx]?.playerId}`);
    
    // Oyunu oyna (her oyuncu sırayla)
    for (let turn = 0; turn < 20; turn++) {
        const player = gameSession.players[currentPlayerIdx];
        if (!player) break;
        
        // Oyuncunun hamlesi
        console.log(`  ${player.playerId} oynuyor...`);
        
        // Sonraki oyuncuya geç
        currentPlayerIdx = getNextPlayerIndex(currentPlayerIdx);
    }
}
```

## Test Çalıştırma

Test dosyasını çalıştırmak için:

```bash
npx tsx src/game/gameLogic.test.ts
```

Bu komut:
- Oyun başlatma sürecini gösterir
- Dağıtıcı rotasyonunu açıklar
- Oyuncu sırasını gösterir
- Tam bir oyun simülasyonu çalıştırır

## Dağıtıcı Rotasyonu Örnekleri

### 8 Tur Örneği
Başlangıç dağıtıcısı: Oyuncu 3

| Tur | Dağıtıcı | İlk Oynayan |
|-----|----------|-------------|
| 1   | Oyuncu 3 | Oyuncu 0    |
| 2   | Oyuncu 2 | Oyuncu 3    |
| 3   | Oyuncu 1 | Oyuncu 2    |
| 4   | Oyuncu 0 | Oyuncu 1    |
| 5   | Oyuncu 3 | Oyuncu 0    |
| 6   | Oyuncu 2 | Oyuncu 3    |
| 7   | Oyuncu 1 | Oyuncu 2    |
| 8   | Oyuncu 0 | Oyuncu 1    |

### Rotasyon Mantığı

```
Dağıtıcı Rotasyonu (Saat Yönünün Tersine):
    ┌─────────┐
    │ Oyuncu0 │◄─┐
    └─────────┘  │
         ▲       │
         │       │
    ┌─────────┐ │
    │ Oyuncu1 │ │
    └─────────┘ │
         ▲      │
         │      │
    ┌─────────┐│
    │ Oyuncu2 ││
    └─────────┘│
         ▲     │
         │     │
    ┌─────────┐│
    │ Oyuncu3 │┘
    └─────────┘

Oyun Sırası (Saat Yönünde):
    ┌─────────┐
    │ Oyuncu0 │─┐
    └─────────┘ │
         │      │
         ▼      │
    ┌─────────┐│
    │ Oyuncu1 ││
    └─────────┘│
         │     │
         ▼     │
    ┌─────────┐│
    │ Oyuncu2 ││
    └─────────┘│
         │     │
         ▼     ▼
    ┌─────────┐
    │ Oyuncu3 │◄─┘
    └─────────┘
```

## Veri Yapıları

Kullanılan ana veri yapıları `src/types/game.model.ts` dosyasında tanımlanmıştır:

- `GameSession`: Tüm oyun oturumu bilgileri
- `Player`: Oyuncu bilgileri ve durumu
- `RoundState`: Mevcut tur durumu
- `GameSettings`: Oyun ayarları
- `Tile`: Oyun taşları
- `Meld`: Taş kombinasyonları

## Notlar

- Oyuncu indeksleri **0-3** arasındadır
- Tüm rotasyon işlemleri modulo 4 aritmetiği kullanır
- Dağıtıcı rolü sadece oyun başlangıcında önemlidir, oyun sırasında etkilemez
- İlk hamleyi her zaman dağıtıcının sağındaki oyuncu yapar

