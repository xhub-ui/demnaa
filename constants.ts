
import { FishType, FishingRod, Bait, Potion, Enchantment, InventoryItem, Rarity, GameEvent, Weather } from './types';

export const GAME_VERSION = "1.2.0";

export const CHANGELOG_DATA = [
    {
        version: "1.2.0",
        date: "Oktober 2024",
        adds: [
            "Jendela informasi pembaruan (Changelog) sekarang muncul saat game dimulai.",
        ],
        changes: [
            "Perbaikan kecil pada logika tombol memancing untuk meningkatkan responsivitas.",
            "Penyesuaian teks UI untuk kejelasan yang lebih baik.",
        ],
        removals: []
    },
    {
        version: "1.1.0",
        date: "September 2024",
        adds: [
            "Sistem Enchanting Altar di Map! Gunakan Stonehenge Relics untuk memperkuat joran.",
            "Event dunia acak (Golden Hour, Meteor Shower) yang memberikan bonus sementara.",
            "Cuaca (Cerah, Hujan, Badai) yang mempengaruhi kelangkaan ikan.",
            "Siklus Siang/Malam dengan efek bonus pada tangkapan.",
            "Fitur Buku Koleksi Ikan untuk melacak semua tangkapan dan rekor berat.",
            "Joran-joran baru yang kuat telah ditambahkan ke dalam game!",
            "Mode animasi sederhana di pengaturan untuk meningkatkan performa.",
        ],
        changes: [
            "Desain ulang UI memancing dengan fase dan animasi yang lebih interaktif dan menarik.",
            "Sistem penjualan ikan dirombak dengan opsi \"Jual Semua\" per kelangkaan dan \"Pilih Beberapa\".",
            "Mekanisme keberuntungan dihitung ulang untuk menyertakan lebih banyak faktor (cuaca, waktu, skill).",
        ],
        removals: [
            "Menghapus sistem upgrade equipment lama (Tas, Radar, dll) dan digantikan dengan sistem Enchanting yang lebih dinamis.",
        ]
    }
];

export const FISH_TYPES: FishType[] = [
    { id: "skitterfin-fish", name: "Skitterfin Fish", rarity: "common", baseValue: 10, color: "#a0c4ff", xp: 5, icon: "https://i.top4top.io/p_3595ikr940.png" },
    { id: "pebbletooth-fish", name: "Pebbletooth Fish", rarity: "common", baseValue: 8, color: "#bdb2ff", xp: 4, icon: "https://d.top4top.io/p_35959a22w0.png" },
    { id: "mudskipper-grump-fish", name: "Mudskipper Grump Fish", rarity: "common", baseValue: 12, color: "#ffc6ff", xp: 6, icon: "https://k.top4top.io/p_3595274jm0.png" },
    { id: "lukerjaw-fish", name: "Lukerjaw Fish", rarity: "common", baseValue: 15, color: "#fffffc", xp: 7, icon: "https://c.top4top.io/p_3595k873g0.png" },
    { id: "finny-pout-fish", name: "Finny Pout Fish", rarity: "common", baseValue: 7, color: "#caffbf", xp: 3, icon: "https://l.top4top.io/p_35952fedj1.png" },
    { id: "ikan-bawal", name: "Ikan Bawal", rarity: "uncommon", baseValue: 25, color: "#2e8b57", xp: 12, icon: "🐠" },
    { id: "ikan-kerapu", name: "Ikan Kerapu", rarity: "uncommon", baseValue: 30, color: "#8b4513", xp: 15, icon: "🐠" },
    { id: "ikan-tuna", name: "Ikan Tuna", rarity: "uncommon", baseValue: 35, color: "#483d8b", xp: 18, icon: "🐠" },
    { id: "ikan-tongkol", name: "Ikan Tongkol", rarity: "uncommon", baseValue: 28, color: "#708090", xp: 14, icon: "🐠" },
    { id: "ikan-kakap", name: "Ikan Kakap", rarity: "uncommon", baseValue: 32, color: "#ff4500", xp: 16, icon: "🐠" },
    { id: "ikan-hiu", name: "Ikan Hiu", rarity: "rare", baseValue: 50, color: "#696969", xp: 25, icon: "🦈" },
    { id: "ikan-pari", name: "Ikan Pari", rarity: "rare", baseValue: 45, color: "#2f4f4f", xp: 22, icon: "🐠" },
    { id: "ikan-salmon", name: "Ikan Salmon", rarity: "rare", baseValue: 60, color: "#fa8072", xp: 30, icon: "🐠" },
    { id: "ikan-barakuda", name: "Ikan Barakuda", rarity: "rare", baseValue: 65, color: "#b0c4de", xp: 32, icon: "🦈" },
    { id: "ikan-paus", name: "Ikan Paus", rarity: "epic", baseValue: 100, color: "#2f4f4f", xp: 50, icon: "🐋" },
    { id: "ikan-duyung", name: "Ikan Duyung", rarity: "epic", baseValue: 200, color: "#ff69b4", xp: 100, icon: "🧜‍♀️" },
    { id: "ikan-angler", name: "Ikan Angler", rarity: "epic", baseValue: 150, color: "#4b0082", xp: 75, icon: "🐡" },
    { id: "ikan-phoenix", name: "Ikan Phoenix", rarity: "legendary", baseValue: 500, color: "#ff4500", xp: 250, icon: "🔥" },
    { id: "ikan-kraken", name: "Ikan Kraken", rarity: "legendary", baseValue: 600, color: "#8b008b", xp: 300, icon: "🐙" },
    { id: "ikan-aurora", name: "Ikan Aurora", rarity: "legendary", baseValue: 550, color: "#ff8c00", xp: 275, icon: "✨" },
    { id: "ikan-chimera", name: "Ikan Chimera", rarity: "mythic", baseValue: 2000, color: "#8b0000", xp: 1000, icon: "🐲" },
    { id: "ikan-pegasus", name: "Ikan Pegasus", rarity: "mythic", baseValue: 2200, color: "#f0f8ff", xp: 1100, icon: "🦄" },
    { id: "ikan-nebula", name: "Ikan Nebula", rarity: "mythic", baseValue: 2100, color: "#8a2be2", xp: 1050, icon: "🌌" },
    { id: "secret-shark", name: "Secret Shark", rarity: "secret", baseValue: 5250, color: "#9bf6ff", xp: 2625, icon: "https://raw.githubusercontent.com/xhub-ui/fukuishi/main/assets/secret/Secret%20Shark.png" },
    { id: "ikan-elder", name: "Ikan Elder", rarity: "mysterious", baseValue: 15000, color: "#8b0000", xp: 7500, icon: "👴" },
    { id: "ikan-ancient", name: "Ikan Kuno", rarity: "mysterious", baseValue: 20000, color: "#cd853f", xp: 10000, icon: "🏺" },
    { id: "ikan-unknown", name: "Ikan Tak Dikenal", rarity: "anonymous", baseValue: 100000, color: "#000000", xp: 50000, icon: "❓" },
    { id: "ikan-nameless", name: "Ikan Tanpa Nama", rarity: "anonymous", baseValue: 150000, color: "#696969", xp: 75000, icon: "🚫" },
    { id: "ikan-developer", name: "Ikan Developer", rarity: "dev", baseValue: 1000000, color: "#00ff00", xp: 500000, icon: "👨‍💻" },
    { id: "ikan-programmer", name: "Ikan Programmer", rarity: "dev", baseValue: 1500000, color: "#008000", xp: 750000, icon: "💻" },
    { id: "ikan-executor", name: "Ikan Executor", rarity: "executors", baseValue: 10000000, color: "#ff0000", xp: 5000000, icon: "⚡" },
    { id: "ikan-admin", name: "Ikan Admin", rarity: "executors", baseValue: 15000000, color: "#dc143c", xp: 75000, icon: "👑" },
];

export const FISHING_RODS: FishingRod[] = [
    { id: "starter-rod", name: "Starter Rod", price: 0, luck: 1, weight: 10, speed: 1, endurance: 5, description: "Joran dasar untuk memulai.", owned: true, equipped: true, visual: 'wood' },
    { id: "toy-rod", name: "Toy Rod", price: 0, luck: 35, weight: 5, speed: 5, endurance: 2, description: "Lebih terlihat seperti mainan, tapi secara mengejutkan beruntung.", owned: false, equipped: false, visual: 'plastic' },
    { id: "luck-rod", name: "Luck Rod", price: 250, luck: 60, weight: 25, speed: 10, endurance: 10, description: "Dibuat untuk pemancing yang percaya pada keberuntungan.", owned: false, equipped: false, visual: 'wood-lucky' },
    { id: "grass-rod", name: "Grass Rod", price: 1500, luck: 40, weight: 250, speed: 25, endurance: 15, description: "Joran yang kokoh terbuat dari rumput yang lentur.", owned: false, equipped: false, visual: 'bamboo' },
    { id: "demascus-rod", name: "Demascus Rod", price: 3000, luck: 70, weight: 500, speed: 15, endurance: 12, description: "Ditempa dengan logam langka, joran ini sangat beruntung.", owned: false, equipped: false, visual: 'metal' },
    { id: "lucky-rod", name: "Lucky Rod", price: 10000, luck: 150, weight: 800, speed: 18, endurance: 15, description: "Keberuntungan ada di pihak Anda dengan joran ini.", owned: false, equipped: false, visual: 'wood-lucky' },
    { id: "midnight-rod", name: "Midnight Rod", price: 50000, luck: 120, weight: 10000, speed: 45, endurance: 20, description: "Joran yang diselimuti misteri malam.", owned: false, equipped: false, visual: 'carbon' },
    { id: "steampunk-rod", name: "Steampunk Rod", price: 215000, luck: 180, weight: 60000, speed: 15, endurance: 18, description: "Keajaiban teknologi, penuh dengan roda gigi dan keberuntungan.", owned: false, equipped: false, visual: 'steampunk' },
    { id: "chrome-rod", name: "Chrome Rod", price: 437000, luck: 230, weight: 200000, speed: 30, endurance: 25, description: "Mengkilap, ramping, dan sangat kuat.", owned: false, equipped: false, visual: 'chrome' },
    { id: "astral-rod", name: "Astral Rod", price: 1000000, luck: 350, weight: 500000, speed: 43, endurance: 30, description: "Sebuah fragmen dari kosmos, berdenyut dengan energi bintang.", owned: false, equipped: false, visual: 'cosmic' },
    { id: 'celestial-rod', name: 'Celestial Rod', price: 100000, luck: 60, speed: 50, endurance: 25, weight: 350000, description: "Setelah tangkap 50 ikan, dapat buff +80% Luck, +20% Lure Speed, semua ikan jadi 'Celestial' (3x) selama 15 menit.", owned: false, equipped: false, visual: 'celestial' },
    { id: 'ethereal-prism-rod', name: 'Ethereal Prism Rod', price: 15000000, luck: 195, speed: 95, endurance: 40, weight: Infinity, description: "Peluang tinggi untuk menangkap ikan termutasi (Prismize).", owned: false, equipped: false, visual: 'prism' },
    { id: 'no-life-rod', name: 'No-Life Rod', price: Infinity, unlockDescription: 'Capai Level 500', luck: 105, speed: 90, endurance: 10, weight: Infinity, description: "Tidak kehilangan streak; ikan langsung tertangkap; bisa stunning & beri mutasi 'Hexed'.", owned: false, equipped: false, visual: 'nolife' },
    { id: 'heavens-rod', name: "Heaven's Rod", price: 1750000, luck: 225, speed: 30, endurance: 30, weight: Infinity, description: "5% peluang untuk mendapatkan ikan mutasi 'Heavenly' (5x nilai).", owned: false, equipped: false, visual: 'heavenly' },
    { id: 'rod-of-the-depths', name: 'Rod of the Depths', price: 750000, luck: 130, speed: 65, endurance: 10, weight: 30000, description: "Setiap 3 tangkapan, dapat 1 ikan bonus + 10% peluang dapat Enchant Relic.", owned: false, equipped: false, visual: 'depths' },
    { id: 'kraken-rod', name: 'Kraken Rod', price: 1333333, luck: 185, speed: 60, endurance: 15, weight: 115000, description: "20% peluang gandakan ikan; 10% peluang dengan 'Tentacle Surge' (10x); setelah 5 ikan, dapat ikan Langka/Mitis/Eksotis.", owned: false, equipped: false, visual: 'kraken' },
    { id: 'zeus-rod', name: 'Zeus Rod', price: 2700000, luck: 90, speed: 70, endurance: 20, weight: 65000, description: "10% picu badai (2 menit): 90% 'Electric Shock' (3.5x), 10% 'Charred' (0.5x).", owned: false, equipped: false, visual: 'zeus' },
    { id: 'poseidon-rod', name: 'Poseidon Rod', price: 1555555, luck: 165, speed: 50, endurance: 40, weight: 100000, description: "25% dapat 75% nilai ikan; 5% panggil 'Poseidon's Ghost' (tambah berat 75-150%).", owned: false, equipped: false, visual: 'poseidon' },
    { id: 'spooky-rod', name: 'Spooky Rod', price: Infinity, unlockDescription: "Serahkan 10x Witch's Ingredients", luck: 66, speed: 75, endurance: -10, weight: 150000, description: "50% peluang setiap detik untuk isi 4% progress & bekukan ikan; 10% untuk 3 mutasi FischFright.", owned: false, equipped: false, visual: 'spooky' },
    { id: 'abyssal-rod', name: 'Abyssal Rod', price: 500000, luck: 140, speed: 45, endurance: 35, weight: 200000, description: "15% peluang untuk mendapatkan ikan mutasi 'Abyssal' (2.5x nilai).", owned: false, equipped: false, visual: 'abyssal' },
    { id: 'infernal-rod', name: 'Infernal Rod', price: 850000, luck: 110, speed: 55, endurance: 20, weight: 80000, description: "25% peluang untuk membakar ikan (1.5x nilai); 5% peluang untuk mendapatkan ikan 'Infernal' (4x nilai).", owned: false, equipped: false, visual: 'infernal' },
    { id: 'crystal-rod', name: 'Crystal Rod', price: 250000, luck: 85, speed: 65, endurance: 30, weight: 120000, description: "Setiap tangkapan sempurna memberikan +5% Luck (maks 5 stack) selama sesi memancing.", owned: false, equipped: false, visual: 'crystal' },
    { id: 'ancient-rod', name: 'Ancient Rod', price: 1000000, luck: 175, speed: 40, endurance: 45, weight: 500000, description: "10% peluang mendapatkan relic tambahan; 5% peluang mendapatkan ancient fish (10x nilai).", owned: false, equipped: false, visual: 'ancient' },
    { id: 'thunder-rod', name: 'Thunder Rod', price: 450000, luck: 95, speed: 70, endurance: 25, weight: 90000, description: "15% peluang menyetrum ikan (2x nilai); selama hujan thunder, statistik meningkat 50%.", owned: false, equipped: false, visual: 'zeus' },
    { id: 'galactic-rod', name: 'Galactic Rod', price: 2000000, luck: 155, speed: 85, endurance: 35, weight: 750000, description: "Dapat menangkap fish dari planet lain; 20% peluang mendapatkan cosmic fish (3x nilai).", owned: false, equipped: false, visual: 'cosmic' },
    { id: 'seraphic-rod', name: 'Seraphic Rod', price: Infinity, unlockDescription: 'Capai Level 1000', luck: 150, speed: 95, endurance: 20, weight: Infinity, description: "Beam mengisi separuh progress bar; tangkapan instan.", owned: false, equipped: false, visual: 'seraphic' },
];


export const BAITS: Bait[] = [
    { id: "umpan-cacing", name: "Umpan Cacing", type: "bait", basePrice: 5, currentPrice: 5, priceIncrease: 1.1, icon: "🪱", effect: { attraction: 1.2, rareChance: 0.8, biteSpeed: 1.1, durability: 3 }, pros: "Murah, efektif untuk ikan biasa", cons: "Kurang efektif untuk ikan langka" },
    { id: "umpan-udang", name: "Umpan Udang", type: "bait", basePrice: 15, currentPrice: 15, priceIncrease: 1.15, icon: "🦐", effect: { attraction: 1.5, rareChance: 1.2, biteSpeed: 1.0, durability: 2 }, pros: "Bagus untuk ikan langka", cons: "Mahal, cepat habis" },
    { id: "umpan-ulat", name: "Umpan Ulat", type: "bait", basePrice: 8, currentPrice: 8, priceIncrease: 1.12, icon: "🐛", effect: { attraction: 1.3, rareChance: 0.9, biteSpeed: 1.3, durability: 4 }, pros: "Cepat menarik perhatian, tahan lama", cons: "Ikan langka kurang tertarik" },
    { id: "umpan-keju", name: "Umpan Keju", type: "bait", basePrice: 12, currentPrice: 12, priceIncrease: 1.18, icon: "🧀", effect: { attraction: 1.1, rareChance: 1.5, biteSpeed: 0.8, durability: 5 }, pros: "Sangat efektif untuk ikan langka, tahan lama", cons: "Lama menarik perhatian ikan" },
    { id: "umpan-roti", name: "Umpan Roti", type: "bait", basePrice: 3, currentPrice: 3, priceIncrease: 1.05, icon: "🍞", effect: { attraction: 1.0, rareChance: 0.7, biteSpeed: 1.0, durability: 6 }, pros: "Sangat murah, tahan lama", cons: "Efektivitas rendah" },
    { id: "umpan-daging", name: "Umpan Daging", type: "bait", basePrice: 25, currentPrice: 25, priceIncrease: 1.25, icon: "🥩", effect: { attraction: 1.8, rareChance: 1.3, biteSpeed: 1.2, durability: 2 }, pros: "Sangat efektif, cepat menarik perhatian", cons: "Sangat mahal, cepat habis" },
    { id: "umpan-buatan", name: "Umpan Buatan", type: "bait", basePrice: 20, currentPrice: 20, priceIncrease: 1.2, icon: "🎣", effect: { attraction: 1.4, rareChance: 1.1, biteSpeed: 1.1, durability: 8 }, pros: "Sangat tahan lama", cons: "Efektivitas sedang" },
    { id: "umpan-emas", name: "Umpan Emas", type: "bait", basePrice: 50, currentPrice: 50, priceIncrease: 1.4, icon: "🌟", effect: { attraction: 2.0, rareChance: 2.0, biteSpeed: 1.5, durability: 1 }, pros: "Sangat efektif untuk semua jenis ikan", cons: "Sangat mahal, sekali pakai" },
    { id: "umpan-campuran", name: "Umpan Campuran", type: "bait", basePrice: 30, currentPrice: 30, priceIncrease: 1.3, icon: "🍲", effect: { attraction: 1.6, rareChance: 1.4, biteSpeed: 1.2, durability: 3 }, pros: "Seimbang untuk semua situasi", cons: "Harga cukup mahal" }
];

export const POTIONS: Potion[] = [
    // FIX: Renamed 'effect' to 'potency' to match the updated Potion type.
    { id: "ramuan-keberuntungan", name: "Ramuan Keberuntungan", type: "potion", basePrice: 30, currentPrice: 30, priceIncrease: 1.25, potency: 40, duration: 240 }
];

export const MATERIALS: InventoryItem[] = [
    { id: "stonehenge-relic", name: "Stonehenge Relic", type: 'material', icon: '💎' }
];

export const SHOP_ITEMS = [
    { id: "upgrade-rod", name: "Upgrade Joran", basePrice: 50, currentPrice: 50, priceIncrease: 1.5, type: "equipment", target: "rod" },
    { id: "upgrade-backpack", name: "Upgrade Tas", basePrice: 40, currentPrice: 40, priceIncrease: 1.4, type: "equipment", target: "backpack" },
    { id: "upgrade-radar", name: "Upgrade Radar", basePrice: 60, currentPrice: 60, priceIncrease: 1.6, type: "equipment", target: "radar" },
    { id: "upgrade-rope", name: "Upgrade Tali", basePrice: 30, currentPrice: 30, priceIncrease: 1.3, type: "equipment", target: "rope" },
    { id: "upgrade-hook", name: "Upgrade Kail", basePrice: 35, currentPrice: 35, priceIncrease: 1.35, type: "equipment", target: "hook" }
];

export const LOCATIONS = [
    { id: "danau-tenang", name: "Danau Tenang", difficulty: 1, icon: '⛩️' },
    { id: "sungai-deras", name: "Sungai Deras", difficulty: 2, icon: '⛩️' },
    { id: "laut-dalam", name: "Laut Dalam", difficulty: 3, icon: '⛩️' },
    { id: "relics-stone-isle", name: "Relics Stone Isle", difficulty: 3, icon: '🏝️' },
    { id: "samudra-misterius", name: "Samudra Misterius", difficulty: 4, icon: '⛩️' },
    { id: "enchanting-altar", name: "Enchanting Altar", difficulty: 999, isActionLocation: true, icon: '🏛️' }
];

export const RARITY_WEIGHTS: { [key: string]: number } = { "common": 42, "uncommon": 24, "rare": 14, "epic": 10, "legendary": 5, "mythic": 3, "secret": 1.5, "mysterious": 0.4, "anonymous": 0.08, "dev": 0.015, "executors": 0.005 };

export const MINIMUM_LUCK_FOR_RARITY: { [key in Rarity]: number } = {
    common: 0,
    uncommon: 15,
    rare: 150,
    epic: 700,
    legendary: 2000,
    mythic: 30000,
    secret: 0,
    mysterious: 100000,
    anonymous: 200000,
    dev: 500000,
    executors: 1000000,
};

export const MUTATION_CHANCES: { [key: string]: number } = { "corrupt": 0.5, "galaxy": 0.1, "gemstone": 0.3, "ghost": 1.0, "lightning": 0.4, "fairy-dust": 1.5, "midnight": 0.3, "radioactive": 0.5, "stone": 5.0, "festive": 0.2, "frozen": 2.0 };
export const MUTATION_MULTIPLIERS: { [key: string]: number } = { "corrupt": 3.0, "galaxy": 5.5, "gemstone": 3.8, "ghost": 2.5, "lightning": 3.2, "fairy-dust": 2.8, "midnight": 3.8, "radioactive": 3.0, "stone": 1.2, "festive": 2.6, "frozen": 2.0 };
export const WEIGHT_CATEGORIES = [{ max: 1, chance: 60 }, { max: 100, chance: 25 }, { max: 500, chance: 10 }, { max: 1000, chance: 3 }, { max: 100000, chance: 1.5 }, { max: 1000000, chance: 0.4 }, { max: 5000000, chance: 0.1 }];

export const RARITY_COLORS: { [key: string]: string } = {
    common: 'text-stone-300',
    uncommon: 'text-lime-400',
    rare: 'text-sky-400',
    epic: 'text-purple-400',
    legendary: 'text-amber-400',
    mythic: 'text-rose-400',
    secret: 'text-teal-400',
    mysterious: 'text-indigo-400',
    anonymous: 'text-slate-400',
    dev: 'text-yellow-300',
    executors: 'text-red-500',
};

export const MUTATION_STYLES: { [key: string]: string } = {
    corrupt: "bg-[#2d0b4d]/50",
    galaxy: "bg-[#0f0c29]/50",
    gemstone: "bg-amber-500/20",
    ghost: "bg-slate-300/30",
    lightning: "bg-yellow-300/20",
    "fairy-dust": "bg-pink-300/20",
    midnight: "bg-indigo-900/40",
    radioactive: "bg-lime-400/20",
    stone: "bg-stone-500/30",
    festive: "bg-red-500/20",
    frozen: "bg-cyan-300/20",
};

export const WEATHER_EFFECTS: { [key in Weather]: { luck_multiplier: number, rarity_bonus: { [key in Rarity]?: number } } } = {
    sunny: { luck_multiplier: 1, rarity_bonus: { common: 1.1 } },
    rainy: { luck_multiplier: 1.15, rarity_bonus: { rare: 1.2, epic: 1.1 } },
    stormy: { luck_multiplier: 1.3, rarity_bonus: { legendary: 1.5, mythic: 1.2 } },
};

export const GAME_EVENTS: GameEvent[] = [
    { id: 'golden-hour', name: 'Golden Hour', description: "Sinar matahari keemasan membuat ikan lebih berharga!", duration: 10 * 60, appliesTo: 'day', effects: { value: 25 } },
    // FIX: Removed 'galaxy' from spawnRate as it's not a valid Rarity type.
    { id: 'meteor-shower', name: 'Meteor Shower', description: "Bintang jatuh membawa keberuntungan dari kosmos.", duration: 15 * 60, appliesTo: 'night', effects: { luck: 50, spawnRate: { mythic: 1.5 } } },
    { id: 'fish-frenzy', name: 'Fish Frenzy', description: "Ikan-ikan menjadi sangat aktif!", duration: 5 * 60, appliesTo: 'all', effects: { spawnRate: { common: 1.5, uncommon: 1.2 } } },
    { id: 'deep-slumber', name: 'Deep Slumber', description: "Ikan-ikan langka terbangun dari tidurnya.", duration: 20 * 60, appliesTo: 'night', effects: { spawnRate: { legendary: 1.2, mysterious: 1.5 } } }
];


export const REGULAR_ENCHANTMENTS: Enchantment[] = [
    {id: 'insight', name: 'Insight', type: 'regular', description: 'Mendapatkan XP 1.5x, +20% Lure Speed, & 30% kemungkinan menangkap Purified fish.', tips: 'Cocok untuk leveling cepat dengan Astral Rod.', xpBoost: 1.5, speed: 20},
    {id: 'clever', name: 'Clever', type: 'regular', description: 'Mendapatkan XP 2.25x dari semua tangkapan.', tips: 'Versi lebih baik dari Insight, bagus untuk Astral Rod.', xpBoost: 2.25},
    {id: 'sea-king', name: 'Sea King', type: 'regular', description: 'Menambah ukuran ikan sebesar +35%.', tips: 'Sangat sinergis dengan Poseidon Rod.', sizeIncrease: 35},
    {id: 'blessed', name: 'Blessed', type: 'regular', description: '+5% Shiny & Sparkling chance, serta +5% Progress speed.', tips: 'Gunakan dengan Lucky Rod untuk memaksimalkan peluang.', progressSpeed: 5},
    {id: 'mutated', name: 'Mutated', type: 'regular', description: 'Meningkatkan Mutation chance sebesar +90%.', tips: 'Ideal untuk Abyssal Rod atau Infernal Rod.', mutationChance: 90},
    {id: 'noir', name: 'Noir', type: 'regular', description: '10% kemungkinan menangkap Albino/Darkened fish, +10% ukuran ikan.', tips: 'Cocok untuk joran dengan pasif mutasi seperti Abyssal Rod.', sizeIncrease: 10},
    {id: 'ghastly', name: 'Ghastly', type: 'regular', description: 'Mengubah semua ikan menjadi Translucent & 10% kemungkinan duplikasi.', tips: 'Direkomendasikan untuk joran non-money making seperti Chrome Rod.'},
    {id: 'abyssal-enchant', name: 'Abyssal', type: 'regular', description: '10% aplikasi mutasi Abyssal. 80% berat +1.3x, 20% berat -0.6x.', tips: 'Bagus untuk Rod of the Depths.'},
    {id: 'quality', name: 'Quality', type: 'regular', description: '+15% Lure Speed, +15% luck, +5% resilience, +5% Progress speed.', tips: 'Sangat cocok untuk joran serba bisa seperti No-Life Rod.', speed: 15, luck: 15, resilience: 5, progressSpeed: 5},
    {id: 'swift', name: 'Swift', type: 'regular', description: 'Menambah +30% Lure Speed dan +5% Progress Speed.', tips: 'Peningkatan kecepatan serba guna.', speed: 30, progressSpeed: 5},
    {id: 'hasty', name: 'Hasty', type: 'regular', description: 'Menambah Lure Speed secara signifikan, yaitu +55%.', tips: 'Untuk pemancing yang tidak sabar.', speed: 55},
    {id: 'lucky', name: 'Lucky', type: 'regular', description: '+20% luck, +15% Lure Speed, dan Mutation chance +40%.', tips: 'Berguna untuk joran dengan luck rendah, seperti Zeus Rod.', luck: 20, speed: 15, mutationChance: 40},
    {id: 'divine', name: 'Divine', type: 'regular', description: '+45% luck, +20% resilience, dan +20% Lure Speed.', tips: 'Versi lebih baik dari Lucky, cocok untuk Zeus Rod.', luck: 45, resilience: 20, speed: 20},
    {id: 'breezed', name: 'Breezed', type: 'regular', description: '+65% luck, +10% Lure Speed, +20% progress speed saat cuaca Windy.', tips: 'Spesialis cuaca berangin untuk Zeus Rod.', luck: 65, speed: 10, progressSpeed: 20},
    {id: 'storming', name: 'Storming', type: 'regular', description: '+95% luck, +45% Lure Speed, +50% kemungkinan Electric fish saat Rainy.', tips: 'Spesialis cuaca hujan untuk Zeus Rod.', luck: 95, speed: 45},
    {id: 'controlled', name: 'Controlled', type: 'regular', description: 'Menambah kontrol bar sebesar +0.15.', tips: 'Berguna untuk joran yang sulit dikendalikan.', control: 0.15},
    {id: 'resilient', name: 'Resilient', type: 'regular', description: 'Meningkatkan resilience sebesar +35%.', tips: 'Membuat pertarungan dengan ikan lebih mudah.', resilience: 35},
    {id: "unbreakable", name: "Unbreakable", type: "regular", description: "Menambah +10,000 Max Kg dan +0.1 kontrol bar.", tips: "Untuk menargetkan ikan yang lebih berat.", maxKg: 10000, control: 0.1},
    {id: 'steady', name: 'Steady', type: 'regular', description: 'Meningkatkan Progress speed sebesar +20%.', tips: 'Cocok untuk joran dengan resilience rendah seperti Toy Rod.', progressSpeed: 20},
    {id: 'long', name: 'Long', type: 'regular', description: '+20% resilience, +5% Progress speed, & jangkauan lempar +50 Studs.', tips: 'Situasional, tidak direkomendasikan untuk sebagian besar joran.', resilience: 20, progressSpeed: 5},
    {id: 'scrapper', name: 'Scrapper', type: 'regular', description: 'Menghemat bait dengan 60% kemungkinan bait tidak terpakai.', tips: 'Cocok untuk joran cepat seperti Galactic Rod atau No-Life Rod.'},
    {id: 'wormhole', name: 'Wormhole', type: 'regular', description: '80% kemungkinan menangkap ikan dari lokasi acak.', tips: 'Sinergi bagus dengan Rod Of The Depths.'},
    {id: 'scavenger', name: 'Scavenger', type: 'regular', description: '3x drop rate untuk item langka (Relics, dll).', tips: 'Cocok untuk farming material enchantment.'},
    {id: 'chaotic', name: 'Chaotic', type: 'regular', description: '8% ikan menjadi Chaotic (nilai 12x) & bisa menusuk ikan.', tips: 'Cocok untuk joran dengan money-making minimal.'},
    {id: 'flashline', name: 'Flashline', type: 'regular', description: '20% dapat +80% Progress Speed, 80% dapat +10% Progress Speed.', tips: 'Direkomendasikan untuk Ethereal Prism Rod.'},
    {id: 'momentum', name: 'Momentum', type: 'regular', description: 'Perfect Catch menambah +2% stat (maks +30%), Regular catch mengurangi 4%.', tips: 'Cocok untuk Seraphic Rod yang mengandalkan Perfect Catch.'},
    {id: 'chronos', name: 'Chronos', type: 'regular', description: 'Setiap 5 detik, 50% kemungkinan menghentikan ikan selama 3 detik.', tips: 'Berguna untuk joran dengan resilience rendah.'},
    {id: 'blood-reckoning', name: 'Blood Reckoning', type: 'regular', description: 'Kesempatan aplikasi mutasi Sanguine (multiplier 8x).', tips: 'Risiko tinggi, hasil tinggi. Gunakan pada joran terkuat Anda.'},
];

export const EXALTED_ENCHANTMENTS: Enchantment[] = [
    {id: 'immortal', name: 'Immortal', type: 'exalted', description: '+75% luck dan +30% Progress speed.', tips: 'Versi superior dari Divine. Cocok untuk Zeus Rod.', luck: 75, progressSpeed: 30},
    {id: 'mystical', name: 'Mystical', type: 'exalted', description: '+25% luck, +45% resilience, +15% lure speed, +10% Progress Speed.', tips: 'Peningkatan stat yang seimbang dan kuat.', luck: 25, resilience: 45, speed: 15, progressSpeed: 10},
    {id: 'sea-overlord', name: 'Sea Overlord', type: 'exalted', description: 'Menambah ukuran ikan sebesar +50%.', tips: 'Versi lebih baik dari Sea King. Cocok untuk Poseidon Rod.', sizeIncrease: 50},
    {id: 'anomalous', name: 'Anomalous', type: 'exalted', description: '20% kemungkinan duplikat ikan menjadi Anomalous (nilai 4.44x).', tips: 'Versi lebih baik dari Abyssal. Cocok untuk Rod of the Depths.'},
    {id: 'quantum', name: 'Quantum', type: 'exalted', description: '25% kemungkinan ikan menjadi Subspace (nilai 5x).', tips: 'Enchantment terbaik untuk money-making. Cocok untuk Kraken Rod.'},
    {id: 'piercing', name: 'Piercing', type: 'exalted', description: 'Kemampuan menusuk ikan saat reel, +15% Progress Speed.', tips: 'Menjamin tangkapan saat reel.', progressSpeed: 15},
    {id: 'invincible', name: 'Invincible', type: 'exalted', description: 'Memberikan Max Kg tak terhingga.', tips: 'Wajib untuk Ancient Rod saat menangkap ikan raksasa.', maxKg: Infinity},
    {id: 'herculean', name: 'Herculean', type: 'exalted', description: '+25,000 Max Kg, +0.2 Control, dan +10% Progress Speed.', tips: 'Peningkatan besar untuk menangani monster laut.', maxKg: 25000, control: 0.2, progressSpeed: 10},
];

export const COSMIC_ENCHANTMENTS: Enchantment[] = [
    {id: 'wise', name: 'Wise', type: 'cosmic', description: 'Mendapatkan XP 1.2x setelah menangkap ikan.', tips: 'Versi lebih lemah dari Insight. Bagus untuk tambahan XP.', xpBoost: 1.2},
    {id: 'sea-prince', name: 'Sea Prince', type: 'cosmic', description: 'Ukuran ikan +15%.', tips: 'Bonus ukuran ikan yang bagus.', sizeIncrease: 15},
    {id: 'overclocked', name: 'Overclocked', type: 'cosmic', description: 'Progress speed +5% pada ikan apapun.', tips: 'Cocok untuk Ethereal Prism Rod.', progressSpeed: 5},
    {id: 'tenacity', name: 'Tenacity', type: 'cosmic', description: 'Progress speed +10% untuk setiap snapped reel (maks 200%).', tips: 'Mengubah kegagalan menjadi kekuatan.'},
    {id: 'tryhard', name: 'Tryhard', type: 'cosmic', description: 'Progress speed +20%, namun kontrol berkurang -0.1.', tips: 'Cocok untuk joran dengan resilience tinggi seperti Ethereal Prism rod.', progressSpeed: 20, control: -0.1},
    {id: 'cryogenic', name: 'Cryogenic', type: 'cosmic', description: 'Kesempatan kecil untuk membekukan ikan.', tips: 'Cocok untuk joran tanpa pasif mutasi seperti Demascus Rod.'},
    {id: 'glittered', name: 'Glittered', type: 'cosmic', description: 'Menambah +5% Shiny dan Sparkling chance.', tips: 'Cocok untuk joran seimbang seperti Steampunk Rod.'},
];
