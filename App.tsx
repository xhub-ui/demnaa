
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { InventoryItem, FishType, PlayerState, Tab, Bait, FishingRod, Rarity, Mutation, Potion, User, Enchantment, Weather, GameEvent } from './types';
import { FISH_TYPES, FISHING_RODS, BAITS, POTIONS, LOCATIONS, RARITY_WEIGHTS, MUTATION_CHANCES, MUTATION_MULTIPLIERS, WEIGHT_CATEGORIES, RARITY_COLORS, MUTATION_STYLES, MATERIALS, REGULAR_ENCHANTMENTS, EXALTED_ENCHANTMENTS, COSMIC_ENCHANTMENTS, MINIMUM_LUCK_FOR_RARITY, WEATHER_EFFECTS, GAME_EVENTS, CHANGELOG_DATA, GAME_VERSION } from './constants';

// --- UTILITY FUNCTIONS ---
const getRequiredXP = (level: number) => Math.floor(100 * Math.pow(level, 1.5));
const getNextPrice = (currentPrice: number, increaseRate: number) => Math.floor(currentPrice * increaseRate);
const AVATARS = ['👤', '🧑‍🚀', '🕵️', '🥷', '🧑‍🎤', '🧑‍🎨', '🧑‍💻', '🤖', '🦊', '🐸'];


// A new component for the sakura effect
const SakuraFall = () => {
    const petals = useMemo(() => Array.from({ length: 30 }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}vw`,
            animationDuration: `${Math.random() * 5 + 8}s`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${Math.random() * 10 + 10}px`,
        };
        const swayStyle = {
            animationDuration: `${Math.random() * 4 + 3}s`,
        };
        return { id: i, style, swayStyle };
    }), []);

    return (
        <div className="sakura-container z-0">
            {petals.map(petal => (
                <div key={petal.id} className="petal-sway" style={petal.swayStyle}>
                    <div className="petal" style={petal.style}>🌸</div>
                </div>
            ))}
        </div>
    );
};

const initialPlayerState: PlayerState = {
    level: 1, xp: 0, skillPoints: 0, baseLuck: 1,
    skills: {
        strength: { level: 1, name: "Kekuatan Tarikan", effect: 1.1, icon: "力" },
        luck: { level: 1, name: "Keberuntungan", effect: 1.05, icon: "運" },
        endurance: { level: 1, name: "Ketahanan", effect: 1.08, icon: "耐" },
        knowledge: { level: 1, name: "Pengetahuan Ikan", effect: 1.07, icon: "知" }
    }
};

// --- MAIN APP COMPONENT ---
export default function App() {
    // --- STATE MANAGEMENT ---
    const [money, setMoney] = useState(100);
    const [totalCaught, setTotalCaught] = useState(0);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [player, setPlayer] = useState<PlayerState>(initialPlayerState);
    
    // Auth State
    const [user, setUser] = useState<User | null>(null);
    const [authView, setAuthView] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Fishing State - Revamped
    const [fishingPhase, setFishingPhase] = useState<'idle' | 'casting' | 'waiting' | 'biting' | 'reeling' | 'caught' | 'escaped'>('idle');
    const [fishingStatus, setFishingStatus] = useState('Siap memancing...');
    const [fishOnTheLine, setFishOnTheLine] = useState<FishType | null>(null);
    const [reelingProgress, setReelingProgress] = useState(0);
    const [caughtFishAnimation, setCaughtFishAnimation] = useState<{ style: React.CSSProperties, key: number } | null>(null);
    const [isAutoFishing, setIsAutoFishing] = useState(false);
    const [rodAction, setRodAction] = useState<'idle' | 'casting' | 'reeling' | 'escaped' | 'caught'>('idle');
    const [fishPosition, setFishPosition] = useState<{ x: number, y: number } | null>(null);
    const [biteWindow, setBiteWindow] = useState(0);


    // Collection State
    const [fishCollection, setFishCollection] = useState<{
        [fishId: string]: {
            count: number;
            heaviest: number;
            mutations: Set<Mutation>;
        }
    }>({});

    // Equipment & Consumables
    const [rods, setRods] = useState<FishingRod[]>(FISHING_RODS);
    const [activeBait, setActiveBait] = useState<Bait | null>(null);
    const [activeBaitDurability, setActiveBaitDurability] = useState<number | null>(null);
    const [activePotions, setActivePotions] = useState<{ id: string, name: string, expiresAt: number }[]>([]);
    
    // Shop State
    const [shopBaits, setShopBaits] = useState<Bait[]>(BAITS);
    const [shopPotions, setShopPotions] = useState<Potion[]>(POTIONS);
    const [shopFilter, setShopFilter] = useState<'sell' | 'bait' | 'potion'>('sell');
    const [shopSearch, setShopSearch] = useState('');
    const [isBulkSellMode, setIsBulkSellMode] = useState(false);
    const [selectedFishToSell, setSelectedFishToSell] = useState<string[]>([]);
    const [collapsedRarities, setCollapsedRarities] = useState<Record<string, boolean>>({});


    // UI State
    const [activeTab, setActiveTab] = useState<Tab>(Tab.Info);
    const [notification, setNotification] = useState('');
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
    const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isPlayerStatsModalOpen, setIsPlayerStatsModalOpen] = useState(false);
    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
    const [inventorySearch, setInventorySearch] = useState('');
    const [inventoryFilter, setInventoryFilter] = useState<'all' | 'fish' | 'bait' | 'potion' | 'material'>('all');
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [animationMode, setAnimationMode] = useState<'full' | 'simple'>('full');
    const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(true);

    // Enchanting State
    const [isEnchantingModalOpen, setIsEnchantingModalOpen] = useState(false);
    const [enchantRollsToday, setEnchantRollsToday] = useState(0);
    const [lastEnchantRollDate, setLastEnchantRollDate] = useState<string | null>(null);
    const [pendingEnchantment, setPendingEnchantment] = useState<Enchantment | null>(null);

    // World State
    const [weather, setWeather] = useState<Weather>('sunny');
    const [isDay, setIsDay] = useState(true);
    const [inGameTime, setInGameTime] = useState('06:00');
    const [activeEvent, setActiveEvent] = useState<{ name: string, description: string, expiresAt: number, effects: GameEvent['effects'] } | null>(null);

    // Other game state
    const [currentLocation, setCurrentLocation] = useState(LOCATIONS[0].id);

    // Refs for timers and animations
    const autoFishTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const accountMenuRef = useRef<HTMLDivElement>(null);
    const fishTargetRef = useRef<{ x: number; y: number } | null>(null);
    const fishAnimationRef = useRef<number | null>(null);
    const biteWindowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const biteWindowIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const reelingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const fishingPhaseRef = useRef(fishingPhase);

    useEffect(() => {
        fishingPhaseRef.current = fishingPhase;
    }, [fishingPhase]);

    // --- COMPUTED VALUES ---
    const equippedRod = useMemo(() => rods.find(r => r.equipped)!, [rods]);
    
    const equippedRodStats = useMemo(() => {
        if (!equippedRod) return { luck: 0, speed: 0, endurance: 0, weight: 0 };
        const base = {
            luck: equippedRod.luck,
            speed: equippedRod.speed,
            endurance: equippedRod.endurance,
            weight: equippedRod.weight
        };
        const enchantment = equippedRod.enchantment;
        const cosmic = equippedRod.cosmicEnchantment;

        return {
            luck: base.luck + (enchantment?.luck || 0) + (cosmic?.luck || 0),
            speed: base.speed + (enchantment?.speed || 0) + (cosmic?.speed || 0),
            endurance: base.endurance + (enchantment?.resilience || 0) + (cosmic?.resilience || 0),
            weight: Math.max(base.weight, (enchantment?.maxKg || 0), (cosmic?.maxKg || 0))
        };
    }, [equippedRod]);

    const totalLuck = useMemo(() => {
        const rodLuck = equippedRodStats.luck;
        const potionLuck = activePotions.some(p => p.id === 'ramuan-keberuntungan') ? POTIONS[0].potency : 0;
        const skillLuck = player.skills.luck.level * 10;
        const baseLuck = player.baseLuck || 0;
        let finalLuck = baseLuck + rodLuck + potionLuck + skillLuck;

        // Weather effect
        finalLuck *= WEATHER_EFFECTS[weather].luck_multiplier;
        // Day/Night effect (+10% luck at night)
        if (!isDay) finalLuck *= 1.1;
        // Event effect
        if (activeEvent?.effects?.luck) finalLuck *= (1 + activeEvent.effects.luck / 100);

        return finalLuck;
    }, [equippedRodStats, activePotions, player.skills.luck.level, player.baseLuck, weather, isDay, activeEvent]);

    const stonehengeRelicCount = useMemo(() => {
        return inventory.find(item => item.id === 'stonehenge-relic')?.count || 0;
    }, [inventory]);

    // --- HELPER & GAME LOGIC FUNCTIONS ---
    const showNotification = useCallback((message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(''), 3000);
    }, []);

    const addXP = useCallback((amount: number) => {
        setPlayer(prev => {
            const newXP = prev.xp + amount;
            const requiredXP = getRequiredXP(prev.level);
            if (newXP >= requiredXP) {
                const newLevel = prev.level + 1;
                setShowLevelUp(true);
                setMoney(m => m + 50 * newLevel); // Dynamic level up reward
                showNotification(`Selamat! Anda naik ke level ${newLevel}!`);
                return {
                    ...prev,
                    level: newLevel,
                    xp: newXP - requiredXP,
                    skillPoints: prev.skillPoints + 1,
                };
            }
            return { ...prev, xp: newXP };
        });
    }, [showNotification]);
    
    const removeFromInventory = useCallback((itemId: string, count = 1) => {
        setInventory(prev => {
            const itemIndex = prev.findIndex(item => item.id === itemId);
            if (itemIndex === -1) return prev;

            const item = prev[itemIndex];
            const newInventory = [...prev];
            
            if (item.type === 'fish' || (item.count && item.count <= count)) {
                newInventory.splice(itemIndex, 1);
            } else if(item.count) {
                newInventory[itemIndex] = { ...item, count: item.count - count };
            }
            return newInventory;
        });
    }, []);

    const reduceBaitDurability = useCallback(() => {
        if (activeBait && activeBaitDurability !== null) {
            const newDurability = activeBaitDurability - 1;
            if (newDurability <= 0) {
                showNotification(`${activeBait.name} telah habis!`);
                setActiveBait(null);
                setActiveBaitDurability(null);
            } else {
                setActiveBaitDurability(newDurability);
            }
        }
    }, [activeBait, activeBaitDurability, showNotification]);
    
    const fishEscaped = useCallback(() => {
        if (fishingPhaseRef.current === 'idle' || fishingPhaseRef.current === 'caught') return;

        if (biteWindowTimerRef.current) clearTimeout(biteWindowTimerRef.current);
        if (biteWindowIntervalRef.current) clearInterval(biteWindowIntervalRef.current);
        if (reelingIntervalRef.current) clearInterval(reelingIntervalRef.current);
    
        setRodAction('escaped');
        setTimeout(() => setRodAction('idle'), 500);
    
        setFishingPhase('escaped');
        setFishPosition(null);
        fishTargetRef.current = null;
        if (fishAnimationRef.current) cancelAnimationFrame(fishAnimationRef.current);
        
        setFishingStatus('Ikan lolos!');
        reduceBaitDurability();
        setFishOnTheLine(null);
        setReelingProgress(0);

        setTimeout(() => setFishingPhase('idle'), 1000);
    }, [reduceBaitDurability]);

    const getRandomFish = useCallback((): FishType => {
        const baitRareChance = activeBait?.effect.rareChance || 1;
        const luck = totalLuck * baitRareChance;

        const availableRarities = (Object.keys(MINIMUM_LUCK_FOR_RARITY) as Rarity[]).filter(
            rarity => luck >= MINIMUM_LUCK_FOR_RARITY[rarity]
        );
        
        if (availableRarities.length === 0) {
            availableRarities.push('common');
        }
        
        const weatherBonus = WEATHER_EFFECTS[weather].rarity_bonus;
        const eventBonus = activeEvent?.effects?.spawnRate || {};

        const rarityWeights = availableRarities.map(rarity => {
            const baseWeight = RARITY_WEIGHTS[rarity];
            const minLuck = MINIMUM_LUCK_FOR_RARITY[rarity];
            const luckBonus = Math.pow(Math.max(1, luck - minLuck), 1.2);
            const weatherMultiplier = weatherBonus[rarity] || 1;
            const eventMultiplier = eventBonus[rarity] || 1;
            return { rarity, weight: baseWeight * luckBonus * weatherMultiplier * eventMultiplier };
        });

        const totalWeight = rarityWeights.reduce((sum, { weight }) => sum + weight, 0);
        let random = Math.random() * totalWeight;

        let selectedRarity: Rarity = 'common';
        for (const { rarity, weight } of rarityWeights) {
            random -= weight;
            if (random <= 0) {
                selectedRarity = rarity;
                break;
            }
        }
        
        const fishOfRarity = FISH_TYPES.filter(fish => fish.rarity === selectedRarity);
        if (fishOfRarity.length > 0) {
            return fishOfRarity[Math.floor(Math.random() * fishOfRarity.length)];
        }
        
        return FISH_TYPES[0]; // Fallback to a common fish
    }, [activeBait, totalLuck, weather, activeEvent]);

    const fishAI = useCallback(() => {
        if (fishingPhaseRef.current !== 'waiting') {
            if (fishAnimationRef.current) cancelAnimationFrame(fishAnimationRef.current);
            fishAnimationRef.current = null;
            return;
        }

        setFishPosition(prevPos => {
            if (!prevPos || !fishTargetRef.current) return prevPos;
    
            const baseSpeed = 0.5;
            const rodSpeedMultiplier = 1 + (equippedRodStats.speed / 100);
            const effectiveSpeed = baseSpeed * rodSpeedMultiplier;
    
            const dx = fishTargetRef.current.x - prevPos.x;
            const dy = fishTargetRef.current.y - prevPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
    
            if (dist < 5) {
                fishTargetRef.current = { x: Math.random() * 80 + 10, y: Math.random() * 70 + 20 };
                return prevPos;
            }
    
            const newPos = {
                x: prevPos.x + (dx / dist) * effectiveSpeed,
                y: prevPos.y + (dy / dist) * effectiveSpeed
            };
    
            const hookX = 50;
            const hookY = 75;
            const distToHook = Math.sqrt(Math.pow(newPos.x - hookX, 2) + Math.pow(newPos.y - hookY, 2));
    
            if (distToHook < 8) {
                const baitEffect = activeBait?.effect || { biteSpeed: 1 };
                if (Math.random() < 0.05 * baitEffect.biteSpeed) {
                    setFishingPhase('biting');
                    setFishingStatus('Menggigit! Tarik!');
    
                    const baseWindow = 2500;
                    const enduranceBonus = (equippedRodStats.endurance / 50);
                    const speedPenalty = (equippedRodStats.speed / 120);
                    const luckBonus = (totalLuck / 1500);
                    const finalWindow = baseWindow * (1 + enduranceBonus - speedPenalty + luckBonus);
                    const clampedWindow = Math.max(1000, Math.min(finalWindow, 5000));
    
                    setBiteWindow(100);
                    const decrement = 100 / (clampedWindow / 100);
                    biteWindowIntervalRef.current = setInterval(() => {
                        setBiteWindow(w => Math.max(0, w - decrement));
                    }, 100);
    
                    biteWindowTimerRef.current = setTimeout(fishEscaped, clampedWindow);
                }
            }
            return newPos;
        });
    
        fishAnimationRef.current = requestAnimationFrame(fishAI);
    }, [equippedRodStats, totalLuck, activeBait, fishEscaped]);
    
    useEffect(() => {
        if (fishingPhase === 'waiting' && !fishAnimationRef.current) {
            fishAnimationRef.current = requestAnimationFrame(fishAI);
        }
        return () => {
            if (fishAnimationRef.current) {
                cancelAnimationFrame(fishAnimationRef.current);
                fishAnimationRef.current = null;
            }
        };
    }, [fishingPhase, fishAI]);

    // --- EVENT HANDLERS ---
    const handleCast = useCallback(() => {
        if (fishingPhase !== 'idle') return;
        if (!activeBait) {
            showNotification("Anda perlu menggunakan umpan untuk memancing!");
            return;
        }

        setFishingPhase('casting');
        setRodAction('casting');

        setTimeout(() => {
            setRodAction('idle');
            setFishingPhase('waiting');
            setFishingStatus('Menunggu ikan...');
            const startX = Math.random() < 0.5 ? -20 : 120;
            const startY = Math.random() * 80 + 10;
            setFishPosition({ x: startX, y: startY });
            fishTargetRef.current = { x: Math.random() * 80 + 10, y: Math.random() * 70 + 20 };
        }, 600); 

        setBiteWindow(0);
        setReelingProgress(0);
        setFishOnTheLine(null);
    }, [fishingPhase, activeBait, showNotification]);

    const generateFishWeight = useCallback((luck: number): number => {
        const random = Math.random() * 100;
        const luckShift = 1 + luck / 500; // Shift probability towards heavier fish
        
        let adjustedCategories = WEIGHT_CATEGORIES.map((cat, index) => {
            const shiftFactor = Math.pow(luckShift, index / 2);
            return { ...cat, chance: cat.chance * shiftFactor };
        });

        const totalChance = adjustedCategories.reduce((sum, cat) => sum + cat.chance, 0);
        adjustedCategories = adjustedCategories.map(cat => ({ ...cat, chance: (cat.chance / totalChance) * 100 }));
        
        let accumulatedChance = 0;
        for (const category of adjustedCategories) {
            accumulatedChance += category.chance;
            if (random <= accumulatedChance) {
                const min = category.max === 1 ? 0.1 : category.max / 10;
                const baseWeight = Math.random() * (category.max - min) + min;
                const sizeBonus = 1 + ((equippedRod.enchantment?.sizeIncrease || 0) + (equippedRod.cosmicEnchantment?.sizeIncrease || 0)) / 100;
                return parseFloat((baseWeight * sizeBonus).toFixed(3));
            }
        }
        return 1;
    }, [equippedRod]);

    const checkMutation = useCallback((): Mutation | null => {
        const luckMultiplier = 1 + (totalLuck / 100);
        const mutationChanceBonus = (equippedRod.enchantment?.mutationChance || 0) + (equippedRod.cosmicEnchantment?.mutationChance || 0);
        let finalMultiplier = luckMultiplier + (mutationChanceBonus / 100);

        // Night time bonus for certain mutations
        if (!isDay) {
            finalMultiplier *= 1.2;
        }

        for (const mutation in MUTATION_CHANCES) {
            const baseChance = MUTATION_CHANCES[mutation as Mutation];
            if (Math.random() * 100 < baseChance * finalMultiplier) {
                return mutation as Mutation;
            }
        }
        return null;
    }, [totalLuck, equippedRod, isDay]);
    
    const addToInventory = useCallback((item: InventoryItem, count = 1) => {
        setInventory(prev => {
            const newItems = [...prev];
            const itemToAdd = item.type === 'material' ? MATERIALS.find(m => m.id === item.id) : item;
            if (!itemToAdd) return prev;

            const existingItemIndex = newItems.findIndex(invItem => invItem.id === itemToAdd.id && invItem.type !== 'fish');
            
            if (existingItemIndex !== -1 && newItems[existingItemIndex].type !== 'fish') {
                const existingItem = newItems[existingItemIndex];
                newItems[existingItemIndex] = { ...existingItem, count: (existingItem.count || 0) + count };
            } else if (itemToAdd.type === 'fish') {
                for (let i = 0; i < count; i++) {
                    newItems.push({
                        ...itemToAdd,
                        weight: generateFishWeight(totalLuck),
                        mutation: checkMutation(),
                        id: `${itemToAdd.id}-${Date.now()}-${i}`
                    });
                }
            } else {
                newItems.push({ ...itemToAdd, count: count });
            }
            return newItems;
        });
    }, [generateFishWeight, checkMutation, totalLuck]);

    const handleFishCaught = (fishToCatch: FishType) => {
        const caughtFish = {
            ...fishToCatch,
            type: 'fish' as const,
            weight: generateFishWeight(totalLuck),
            mutation: checkMutation(),
            id: `${fishToCatch.id}-${Date.now()}`
        };

        setFishingPhase('caught');
        setRodAction('caught');
        setTimeout(() => setRodAction('idle'), 500);

        setTotalCaught(c => c + 1);
        setInventory(prev => [...prev, caughtFish]);
        
        if (caughtFish.weight) {
            const baseFishId = fishToCatch.id;
            const newWeight = caughtFish.weight;
            const newMutation = caughtFish.mutation;

            setFishCollection(prev => {
                const existingEntry = prev[baseFishId];
                const newMutations = new Set(existingEntry?.mutations);
                if (newMutation) newMutations.add(newMutation);
                return { ...prev, [baseFishId]: {
                    count: (existingEntry?.count || 0) + 1,
                    heaviest: Math.max(existingEntry?.heaviest || 0, newWeight),
                    mutations: newMutations,
                }};
            });
        }

        if (currentLocation === 'relics-stone-isle' && Math.random() < 0.0023) {
             const relic = MATERIALS.find(m => m.id === 'stonehenge-relic');
             if (relic) {
                addToInventory(relic, 1);
                showNotification("Anda menemukan Stonehenge Relic langka!");
             }
        }
        
        const xpBoost = (equippedRod.enchantment?.xpBoost || 1) * (equippedRod.cosmicEnchantment?.xpBoost || 1);
        const xpGained = Math.floor(fishToCatch.xp * player.skills.strength.effect * xpBoost);
        addXP(xpGained);
        reduceBaitDurability();

        const mutationText = caughtFish.mutation ? ` (Mutasi: ${caughtFish.mutation})` : '';
        const status = `Menangkap ${fishToCatch.name} (${caughtFish.weight}kg)${mutationText}! +${xpGained} XP`;
        showNotification(status);
        setFishingStatus(status);
        
        setCaughtFishAnimation({
            style: { background: fishToCatch.color, transform: `translateX(-50%)`},
            key: Date.now()
        });
        setTimeout(() => setCaughtFishAnimation(null), 2000);

        setFishOnTheLine(null);
        setReelingProgress(0);
        setTimeout(() => setFishingPhase('idle'), 1000);
    };

    const handleFishingAction = useCallback(() => {
        if (fishingPhase === 'biting') {
            // Start reeling
            if (biteWindowTimerRef.current) clearTimeout(biteWindowTimerRef.current);
            if (biteWindowIntervalRef.current) clearInterval(biteWindowIntervalRef.current);
            if (fishAnimationRef.current) cancelAnimationFrame(fishAnimationRef.current);
            fishAnimationRef.current = null;
            setFishPosition(null);

            setFishingPhase('reeling');
            setRodAction('reeling');
            setFishingStatus('Tarik terus!');
            const fishToCatch = getRandomFish();
            setFishOnTheLine(fishToCatch);
            setReelingProgress(30); // Start with some progress
        } else if (fishingPhase === 'reeling') {
            // Add progress
            const strengthBonus = player.skills.strength.effect;
            const rodEndurance = equippedRodStats.endurance / 100;
            const gain = 5 * strengthBonus * (1 + rodEndurance);
            setReelingProgress(p => Math.min(100, p + gain));
        }
    }, [fishingPhase, player.skills.strength.effect, equippedRodStats.endurance, getRandomFish]);

    useEffect(() => {
        if (fishingPhase !== 'reeling' || !fishOnTheLine) {
            if (reelingIntervalRef.current) clearInterval(reelingIntervalRef.current);
            return;
        }

        reelingIntervalRef.current = setInterval(() => {
            setReelingProgress(p => {
                if (p >= 100) {
                    if (reelingIntervalRef.current) clearInterval(reelingIntervalRef.current);
                    handleFishCaught(fishOnTheLine);
                    return 100;
                }
                if (p <= 0) {
                    if (reelingIntervalRef.current) clearInterval(reelingIntervalRef.current);
                    fishEscaped();
                    return 0;
                }
                const rarityIndex = Object.keys(RARITY_WEIGHTS).indexOf(fishOnTheLine.rarity);
                const fishStrength = 1 + (rarityIndex / 5);
                const rodPower = player.skills.endurance.effect + (equippedRodStats.endurance / 50);
                const depletion = Math.max(0.5, fishStrength / rodPower);
                return p - depletion;
            });
        }, 100);

        return () => {
            if (reelingIntervalRef.current) clearInterval(reelingIntervalRef.current);
        };
    }, [fishingPhase, fishOnTheLine, player.skills.endurance.effect, equippedRodStats.endurance, fishEscaped]);

    const calculateFishValue = (fish: InventoryItem): number => {
        if (!fish.baseValue || !fish.weight || !fish.rarity) return 0;
        const rarityMultipliers: { [key in Rarity]: number } = { "common": 1, "uncommon": 1.8, "rare": 3, "epic": 6, "legendary": 12, "mythic": 30, "secret": 60, "mysterious": 120, "anonymous": 300, "dev": 600, "executors": 1200 };
        const rarityMultiplier = rarityMultipliers[fish.rarity] || 1;
        const mutationMultiplier = fish.mutation ? MUTATION_MULTIPLIERS[fish.mutation] : 1;
        const knowledgeBonus = player.skills.knowledge.effect;
        const weightBonus = Math.pow(fish.weight, 1.05);
        const randomFactor = 1 + (Math.random() - 0.5) * 0.2; // +/- 10% variation
        let value = fish.baseValue * weightBonus * rarityMultiplier * mutationMultiplier * knowledgeBonus * randomFactor;
        
        if(activeEvent?.effects.value) {
            value *= (1 + activeEvent.effects.value / 100);
        }

        return Math.round(value);
    };

    const handleItemUse = (item: InventoryItem) => {
        if (item.type === 'bait') {
            const baitDetails = BAITS.find(b => b.id === item.id);
            if (baitDetails) {
                removeFromInventory(item.id);
                setActiveBait(baitDetails);
                setActiveBaitDurability(baitDetails.effect.durability);
                showNotification(`${item.name} dipilih sebagai umpan aktif.`);
            }
        } else if (item.type === 'potion') {
            const potionDetails = POTIONS.find(p => p.id === item.id);
            if (potionDetails) {
                let isNew = true;
                setActivePotions(prev => {
                    const newPotions = [...prev];
                    const existingPotionIndex = newPotions.findIndex(p => p.id === potionDetails.id);
                    
                    if (existingPotionIndex !== -1) {
                        isNew = false;
                        const existingPotion = newPotions[existingPotionIndex];
                        const newExpiresAt = Math.max(Date.now(), existingPotion.expiresAt) + potionDetails.duration * 1000;
                        newPotions[existingPotionIndex] = { ...existingPotion, expiresAt: newExpiresAt };
                        return newPotions;
                    } else {
                        newPotions.push({
                            id: potionDetails.id,
                            name: potionDetails.name,
                            expiresAt: Date.now() + potionDetails.duration * 1000
                        });
                        return newPotions;
                    }
                });
                removeFromInventory(item.id);
                if (isNew) {
                    showNotification(`Menggunakan ${item.name}.`);
                } else {
                    showNotification(`Durasi ${item.name} diperpanjang.`);
                }
            }
        }
        setSelectedItem(null);
    };

    const handleSellFish = (fish: InventoryItem) => {
        const value = calculateFishValue(fish);
        setMoney(m => m + value);
        removeFromInventory(fish.id);
        showNotification(`Menjual ${fish.name} seharga ${value} koin.`);
    };
    
    const handleSellRarity = (rarity: Rarity) => {
        const fishToSell = inventory.filter(item => item.type === 'fish' && item.rarity === rarity);
        if (fishToSell.length === 0) {
            showNotification(`Tidak ada ikan ${rarity} untuk dijual.`);
            return;
        }

        const totalValue = fishToSell.reduce((sum, fish) => sum + calculateFishValue(fish), 0);
        const fishIdsToSell = fishToSell.map(fish => fish.id);

        setMoney(m => m + totalValue);
        setInventory(prev => prev.filter(item => !fishIdsToSell.includes(item.id)));
        showNotification(`Menjual ${fishToSell.length} ikan ${rarity} seharga ${totalValue} koin.`);
    };

    const handleSellSelected = () => {
        if (selectedFishToSell.length === 0) return;
        const fishToSell = inventory.filter(item => selectedFishToSell.includes(item.id));
        const totalValue = fishToSell.reduce((sum, fish) => sum + calculateFishValue(fish), 0);
    
        setMoney(m => m + totalValue);
        setInventory(prev => prev.filter(item => !selectedFishToSell.includes(item.id)));
        showNotification(`Menjual ${fishToSell.length} ikan seharga ${totalValue} koin.`);
        setSelectedFishToSell([]);
        setIsBulkSellMode(false);
    };

    const handleToggleFishSelection = (fishId: string) => {
        setSelectedFishToSell(prev =>
            prev.includes(fishId)
                ? prev.filter(id => id !== fishId)
                : [...prev, fishId]
        );
    };
    
    const toggleRarityCollapse = (rarity: Rarity) => {
        setCollapsedRarities(prev => ({ ...prev, [rarity]: !prev[rarity] }));
    };

    const handleUpgradeSkill = (skill: keyof PlayerState['skills']) => {
        if (player.skillPoints > 0) {
            setPlayer(prev => {
                const newSkills = { ...prev.skills };
                newSkills[skill].level += 1;
                switch(skill) {
                    case 'strength': newSkills[skill].effect = 1 + (newSkills[skill].level * 0.1); break;
                    case 'luck': newSkills[skill].effect = 1 + (newSkills[skill].level * 0.05); break;
                    case 'endurance': newSkills[skill].effect = 1 + (newSkills[skill].level * 0.08); break;
                    case 'knowledge': newSkills[skill].effect = 1 + (newSkills[skill].level * 0.07); break;
                }
                return { ...prev, skillPoints: prev.skillPoints - 1, skills: newSkills };
            });
        }
    };
    
    const handleBuyRod = (rodId: string) => {
        const rod = rods.find(r => r.id === rodId);
        if (rod && money >= rod.price && !rod.owned) {
            setMoney(m => m - rod.price);
            setRods(prevRods => prevRods.map(r => 
                r.id === rodId ? { ...r, owned: true, equipped: true } : { ...r, equipped: false }
            ));
            showNotification(`Membeli dan menggunakan ${rod.name}`);
        }
    };

    const handleEquipRod = (rodId: string) => {
        setRods(prevRods => prevRods.map(r => ({
            ...r,
            equipped: r.id === rodId
        })));
        showNotification(`Menggunakan ${rods.find(r => r.id === rodId)?.name}.`);
    };

    // --- ENCHANTING HANDLERS ---
    const handleOpenEnchantingModal = () => {
        const today = new Date().toISOString().split('T')[0];
        if (lastEnchantRollDate !== today) {
            setLastEnchantRollDate(today);
            setEnchantRollsToday(0);
        }
        setPendingEnchantment(null);
        setIsEnchantingModalOpen(true);
    };

    const getRandomEnchantment = (): Enchantment => {
        const rand = Math.random() * 100;
        if (rand < 5) { // 5% chance for Exalted
            return EXALTED_ENCHANTMENTS[Math.floor(Math.random() * EXALTED_ENCHANTMENTS.length)];
        } else if (rand < 20) { // 15% chance for Cosmic
            return COSMIC_ENCHANTMENTS[Math.floor(Math.random() * COSMIC_ENCHANTMENTS.length)];
        } else { // 80% chance for Regular
            return REGULAR_ENCHANTMENTS[Math.floor(Math.random() * REGULAR_ENCHANTMENTS.length)];
        }
    };

    const handleRollEnchantment = () => {
        if (stonehengeRelicCount < 1) {
            showNotification("Tidak cukup Stonehenge Relic!");
            return;
        }
        if (enchantRollsToday >= 8) {
            showNotification("Anda telah mencapai batas roll harian.");
            return;
        }
        removeFromInventory('stonehenge-relic', 1);
        setEnchantRollsToday(prev => prev + 1);
        setPendingEnchantment(getRandomEnchantment());
    };

    const handleApplyEnchantment = () => {
        if (!pendingEnchantment || !equippedRod) return;

        setRods(prevRods => prevRods.map(r => {
            if (r.id === equippedRod.id) {
                const newRod = { ...r };
                if (pendingEnchantment.type === 'cosmic') {
                    newRod.cosmicEnchantment = pendingEnchantment;
                } else {
                    newRod.enchantment = pendingEnchantment;
                }
                return newRod;
            }
            return r;
        }));

        showNotification(`${pendingEnchantment.name} telah diterapkan pada ${equippedRod.name}!`);
        setPendingEnchantment(null);
    };
    
    // --- Data Persistence ---
    const resetGameState = () => {
        setMoney(100);
        setTotalCaught(0);
        setInventory([]);
        setFavorites([]);
        setPlayer(initialPlayerState);
        setFishCollection({});
        setRods(FISHING_RODS);
        setShopBaits(BAITS);
        setShopPotions(POTIONS);
        setCurrentLocation(LOCATIONS[0].id);
        setActiveBait(null);
        setActiveBaitDurability(null);
        setActivePotions([]);
    };

    const loadGameState = (currentUser: User) => {
        const savedStateJSON = localStorage.getItem(`fishing_game_save_${currentUser.username}`);
        if (savedStateJSON) {
            try {
                const savedState = JSON.parse(savedStateJSON);
                
                // Use saved data with fallbacks to initial state
                setMoney(savedState.money ?? 100);
                setTotalCaught(savedState.totalCaught ?? 0);
                setInventory(savedState.inventory ?? []);
                setFavorites(savedState.favorites ?? []);

                // Safely merge player state
                const loadedPlayer = savedState.player || {};
                setPlayer({
                    ...initialPlayerState,
                    ...loadedPlayer,
                    baseLuck: loadedPlayer.baseLuck ?? 1,
                    skills: {
                        ...initialPlayerState.skills,
                        ...(loadedPlayer.skills || {})
                    }
                });
                 // Safely deserialize Sets from arrays
                const loadedCollection = savedState.fishCollection || {};
                Object.keys(loadedCollection).forEach(key => {
                    if(loadedCollection[key].mutations && Array.isArray(loadedCollection[key].mutations)) {
                         loadedCollection[key].mutations = new Set(loadedCollection[key].mutations);
                    } else {
                         loadedCollection[key].mutations = new Set();
                    }
                });
                setFishCollection(loadedCollection);

                setRods(savedState.rods ?? FISHING_RODS);
                setShopBaits(savedState.shopBaits ?? BAITS);
                setShopPotions(savedState.shopPotions ?? POTIONS);
                setCurrentLocation(savedState.currentLocation ?? LOCATIONS[0].id);
                
                showNotification(`Permainan dimuat untuk ${currentUser.username}.`);
            } catch(e) {
                console.error("Failed to load game state:", e);
                resetGameState();
            }
        } else {
            // First time login for this user
            resetGameState();
            addToInventory(BAITS.find(b => b.id === 'umpan-cacing')!, 3);
            addToInventory(BAITS.find(b => b.id === 'umpan-roti')!, 2);
            addToInventory(POTIONS.find(p => p.id === 'ramuan-keberuntungan')! as InventoryItem, 1);
        }
    };
    
    // --- Manual Save/Load Handlers ---
    const saveGameState = useCallback(() => {
        if (!user) return;
        
        const collectionForSaving: { [key: string]: any } = {};
        Object.keys(fishCollection).forEach(key => {
            collectionForSaving[key] = { ...fishCollection[key], mutations: Array.from(fishCollection[key].mutations) };
        });

        const gameState = {
            money, totalCaught, inventory, favorites, player,
            fishCollection: collectionForSaving,
            rods, shopBaits, shopPotions, currentLocation
        };

        try {
            localStorage.setItem(`fishing_game_save_${user.username}`, JSON.stringify(gameState));
        } catch (e) {
            console.error("Failed to save game state:", e);
        }
    }, [user, money, totalCaught, inventory, favorites, player, fishCollection, rods, shopBaits, shopPotions, currentLocation]);

    const handleManualSave = () => {
        if (!user) return;
        saveGameState();
        showNotification('Data game berhasil disimpan!');
    };

    const handleManualLoad = () => {
        if (!user) return;
        if (window.confirm('Apakah Anda yakin ingin memuat data terakhir? Progress saat ini yang belum disimpan akan hilang.')) {
            loadGameState(user);
        }
    };


    // --- AUTH HANDLERS ---
    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('fishing_game_users') || '[]');
        if (users.some((u: any) => u.username === username)) {
            showNotification('Username sudah ada!');
            return;
        }
        const newUser: User = { username, password, avatar: '👤' };
        users.push(newUser);
        localStorage.setItem('fishing_game_users', JSON.stringify(users));
        localStorage.setItem('fishing_game_currentUser', JSON.stringify(newUser));
        setUser(newUser);
        loadGameState(newUser);
        showNotification('Registrasi berhasil! Anda sudah masuk.');
        setUsername('');
        setPassword('');
        setIsAuthModalOpen(false);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('fishing_game_users') || '[]');
        const foundUser = users.find((u: any) => u.username === username && u.password === password);
        if (foundUser) {
            const userToLogin = { ...foundUser, avatar: foundUser.avatar || '👤' };
            localStorage.setItem('fishing_game_currentUser', JSON.stringify(userToLogin));
            setUser(userToLogin);
            loadGameState(userToLogin);
            showNotification(`Selamat datang kembali, ${username}!`);
            setUsername('');
            setPassword('');
            setIsAuthModalOpen(false);
        } else {
            showNotification('Username atau password salah!');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('fishing_game_currentUser');
        setUser(null);
        setIsAccountMenuOpen(false);
        resetGameState();
        showNotification('Anda telah keluar.');
    };
    
    const handleChangeAvatar = (newAvatar: string) => {
        if (!user) return;

        const updatedUser = { ...user, avatar: newAvatar };
        setUser(updatedUser);

        const users = JSON.parse(localStorage.getItem('fishing_game_users') || '[]');
        const userIndex = users.findIndex((u: any) => u.username === user.username);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], avatar: newAvatar };
            localStorage.setItem('fishing_game_users', JSON.stringify(users));
            localStorage.setItem('fishing_game_currentUser', JSON.stringify(updatedUser));
        }
        setIsAvatarModalOpen(false);
        showNotification("Avatar berhasil diubah!");
    };


    // --- USEEFFECT HOOKS ---
    useEffect(() => {
        const loggedInUser = localStorage.getItem('fishing_game_currentUser');
        if (loggedInUser) {
            const parsedUser = JSON.parse(loggedInUser);
            if (!parsedUser.avatar) parsedUser.avatar = '👤';
            setUser(parsedUser);
            loadGameState(parsedUser);
        }
        
        const savedDate = localStorage.getItem('lastEnchantRollDate');
        const today = new Date().toISOString().split('T')[0];
        if (savedDate === today) {
            setEnchantRollsToday(parseInt(localStorage.getItem('enchantRollsToday') || '0', 10));
        }
        setLastEnchantRollDate(today);
    }, []);

    // Save enchanting progress to local storage
    useEffect(() => {
        if (lastEnchantRollDate) {
            localStorage.setItem('lastEnchantRollDate', lastEnchantRollDate);
            localStorage.setItem('enchantRollsToday', enchantRollsToday.toString());
        }
    }, [enchantRollsToday, lastEnchantRollDate]);

    // Auto-save game state on change
    useEffect(() => {
        saveGameState();
    }, [saveGameState]);


    useEffect(() => {
        const interval = setInterval(() => {
            setActivePotions(prev => prev.filter(p => {
                const isExpired = p.expiresAt <= Date.now();
                if (isExpired) showNotification(`Efek ${p.name} telah habis.`);
                return !isExpired;
            }));
             if (activeEvent && activeEvent.expiresAt <= Date.now()) {
                showNotification(`Efek ${activeEvent.name} telah berakhir.`);
                setActiveEvent(null);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [showNotification, activeEvent]);
    
    useEffect(() => {
        const decayInterval = setInterval(() => {
            const decay = <T extends Bait | Potion>(item: T): T => {
                if (item.currentPrice > item.basePrice) {
                    return { ...item, currentPrice: Math.max(item.basePrice, item.currentPrice - 1) };
                }
                return item;
            };
            setShopBaits(prev => prev.map(decay));
            setShopPotions(prev => prev.map(decay));
        }, 20000);
        return () => clearInterval(decayInterval);
    }, []);
    
    // Close account menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
                setIsAccountMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Auto-fishing loop
    useEffect(() => {
        if (autoFishTimeoutRef.current) clearTimeout(autoFishTimeoutRef.current);
    
        if (!isAutoFishing || player.level < 5) return;
    
        if (!activeBait) {
            if (isAutoFishing) {
                showNotification("Auto-fishing dihentikan: Umpan habis.");
                setIsAutoFishing(false);
            }
            return;
        }
    
        if (fishingPhase === 'idle') {
            autoFishTimeoutRef.current = setTimeout(() => handleCast(), 2000);
        } else if (fishingPhase === 'biting') {
             autoFishTimeoutRef.current = setTimeout(() => handleFishingAction(), 500);
        } else if (fishingPhase === 'reeling') {
             autoFishTimeoutRef.current = setTimeout(() => handleFishingAction(), 300);
        }
    
        return () => {
            if (autoFishTimeoutRef.current) clearTimeout(autoFishTimeoutRef.current);
        };
    }, [isAutoFishing, fishingPhase, activeBait, player.level, handleCast, handleFishingAction, showNotification]);

    // Day/Night and time cycle
    useEffect(() => {
        const cycleInterval = setInterval(() => {
            const totalMsInCycle = 12 * 60 * 60 * 1000; // 12 hours
            const timeIntoCycle = Date.now() % totalMsInCycle;

            const isDayTime = timeIntoCycle < totalMsInCycle / 2;
            setIsDay(isDayTime);

            const totalSecondsInDay = 24 * 60; // 1440 minutes in a game day
            const gameTimeProgress = timeIntoCycle / totalMsInCycle;
            const currentMinuteInGame = Math.floor(gameTimeProgress * totalSecondsInDay);
            
            const hours = Math.floor(currentMinuteInGame / 60).toString().padStart(2, '0');
            const minutes = (currentMinuteInGame % 60).toString().padStart(2, '0');
            setInGameTime(`${hours}:${minutes}`);

        }, 1000);
        return () => clearInterval(cycleInterval);
    }, []);

    // Weather cycle
    useEffect(() => {
        const weatherInterval = setInterval(() => {
            setWeather(prevWeather => {
                const rand = Math.random();
                if (prevWeather === 'sunny') {
                    return rand < 0.2 ? 'rainy' : 'sunny'; // 20% chance to rain
                } else if (prevWeather === 'rainy') {
                    if (rand < 0.15) return 'stormy'; // 15% chance of storm
                    if (rand < 0.65) return 'sunny'; // 50% chance to clear up
                    return 'rainy';
                } else { // stormy
                    return rand < 0.7 ? 'rainy' : 'stormy'; // 70% chance to become rainy
                }
            });
        }, 15 * 60 * 1000); // Change weather every 15 minutes
        return () => clearInterval(weatherInterval);
    }, []);

    // Random events cycle
    useEffect(() => {
        const eventInterval = setInterval(() => {
            if (activeEvent) return; // Don't start a new event if one is active

            if (Math.random() < 0.1) { // 10% chance every 5 minutes
                const possibleEvents = GAME_EVENTS.filter(e => {
                    if (e.appliesTo === 'all') return true;
                    return isDay ? e.appliesTo === 'day' : e.appliesTo === 'night';
                });
                if (possibleEvents.length > 0) {
                    const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
                    setActiveEvent({
                        name: event.name,
                        description: event.description,
                        expiresAt: Date.now() + event.duration * 1000,
                        effects: event.effects
                    });
                    showNotification(`Acara dimulai: ${event.name}!`);
                }
            }
        }, 5 * 60 * 1000); // Check for event every 5 minutes
        return () => clearInterval(eventInterval);
    }, [activeEvent, isDay, showNotification]);

    // Passive luck gain
    useEffect(() => {
        const luckInterval = setInterval(() => {
            if (user) {
                setPlayer(prev => ({
                    ...prev,
                    baseLuck: parseFloat(((prev.baseLuck || 0) + 0.2).toFixed(1))
                }));
            }
        }, 60000); // Every 60 seconds
        return () => clearInterval(luckInterval);
    }, [user]);

    // Clear bulk selection when changing shop filters or tabs
    useEffect(() => {
        setIsBulkSellMode(false);
        setSelectedFishToSell([]);
    }, [shopFilter, activeTab]);


    // --- RENDER SUB-COMPONENTS ---
    const renderTabContent = () => {
        const finalInventory = inventory.reduce((acc, item) => {
             if (item.type !== 'fish') {
                const existing = acc.find(i => i.id === item.id);
                if (existing) {
                    existing.count = (existing.count || 1) + (item.count || 1) -1;
                } else {
                    acc.push({...item});
                }
             } else {
                acc.push(item);
             }
             return acc;
        }, [] as InventoryItem[]);
        
        const weatherIcons = { sunny: '☀️', rainy: '🌧️', stormy: '⛈️' };

        switch(activeTab) {
            case Tab.Info: return (
                <div>
                    <h3 className="text-xl font-bold mb-4 text-[#e0b784]">Info & Status</h3>
                     <div className="w-full p-2 bg-inset rounded-md text-center mb-2 border border-[#816b5a]/50">
                        <div className="grid grid-cols-3 gap-2 text-sm">
                             <div className="flex items-center justify-center gap-2">
                                <span className="text-xl">{isDay ? '☀️' : '🌙'}</span>
                                <div>
                                    <div className="font-bold">{inGameTime}</div>
                                    <div className="text-xs text-stone-400">{isDay ? 'Siang' : 'Malam'}</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-xl">{weatherIcons[weather]}</span>
                                <div>
                                    <div className="font-bold capitalize">{weather}</div>
                                    <div className="text-xs text-stone-400">Cuaca</div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-amber-300">
                                 {activeEvent ? (
                                    <>
                                        <span className="text-xl animate-pulse">✨</span>
                                        <div>
                                            <div className="font-bold">{activeEvent.name}</div>
                                            <div className="text-xs text-amber-400/80">Acara Aktif</div>
                                        </div>
                                    </>
                                ) : (
                                     <div className="text-stone-400 italic text-center col-span-1">Tenang...</div>
                                )}
                            </div>
                        </div>
                         {activeEvent && <p className="text-xs text-center mt-2 text-amber-200/90 italic">"{activeEvent.description}"</p>}
                    </div>

                    <div className="w-full p-2 bg-inset rounded-md text-center mb-4 border border-[#816b5a]/50">
                        <h3 className="font-bold text-[#e0b784]">{equippedRod.name}</h3>
                        <div className="text-xs text-stone-400">Luck: {totalLuck.toFixed(0)}% | Kapasitas: {equippedRodStats.weight === Infinity ? '∞' : equippedRodStats.weight.toLocaleString()}kg | Kecepatan: {equippedRodStats.speed}% | Ketahanan: {equippedRodStats.endurance}%</div>
                        {equippedRod.enchantment && <p className="text-xs text-cyan-300">✨ {equippedRod.enchantment.name}</p>}
                        {equippedRod.cosmicEnchantment && <p className="text-xs text-purple-300">🌌 {equippedRod.cosmicEnchantment.name}</p>}
                    </div>
                </div>
            );
            case Tab.Inventory:
                const sortedInventory = finalInventory
                    .filter(item => {
                        if (inventoryFilter === 'all') return true;
                        if (inventoryFilter === 'fish') return item.type === 'fish';
                        return item.type === inventoryFilter;
                    })
                    .filter(item => item.name.toLowerCase().includes(inventorySearch.toLowerCase()))
                    .sort((a, b) => {
                        const aIsFav = favorites.includes(a.id) && (a.type === 'fish' || a.id === 'stonehenge-relic');
                        const bIsFav = favorites.includes(b.id) && (b.type === 'fish' || b.id === 'stonehenge-relic');
                        if (aIsFav && !bIsFav) return -1;
                        if (!aIsFav && bIsFav) return 1;
                        return 0;
                    });

                return (
                     <div>
                        <div className="flex mb-3 bg-[#2a2627]/70 rounded-md overflow-x-auto">
                            <button onClick={() => setInventoryFilter('all')} className={`flex-1 p-2 text-center text-xs sm:text-sm font-semibold cursor-pointer transition-colors capitalize whitespace-nowrap ${inventoryFilter === 'all' ? 'bg-[#816b5a]/50 text-[#e0b784]' : 'hover:bg-white/10 text-stone-400'}`}>Semua</button>
                            <button onClick={() => setInventoryFilter('fish')} className={`flex-1 p-2 text-center text-xs sm:text-sm font-semibold cursor-pointer transition-colors capitalize whitespace-nowrap ${inventoryFilter === 'fish' ? 'bg-[#816b5a]/50 text-[#e0b784]' : 'hover:bg-white/10 text-stone-400'}`}>Ikan</button>
                            <button onClick={() => setInventoryFilter('bait')} className={`flex-1 p-2 text-center text-xs sm:text-sm font-semibold cursor-pointer transition-colors capitalize whitespace-nowrap ${inventoryFilter === 'bait' ? 'bg-[#816b5a]/50 text-[#e0b784]' : 'hover:bg-white/10 text-stone-400'}`}>Umpan</button>
                            <button onClick={() => setInventoryFilter('potion')} className={`flex-1 p-2 text-center text-xs sm:text-sm font-semibold cursor-pointer transition-colors capitalize whitespace-nowrap ${inventoryFilter === 'potion' ? 'bg-[#816b5a]/50 text-[#e0b784]' : 'hover:bg-white/10 text-stone-400'}`}>Ramuan</button>
                            <button onClick={() => setInventoryFilter('material')} className={`flex-1 p-2 text-center text-xs sm:text-sm font-semibold cursor-pointer transition-colors capitalize whitespace-nowrap ${inventoryFilter === 'material' ? 'bg-[#816b5a]/50 text-[#e0b784]' : 'hover:bg-white/10 text-stone-400'}`}>Bahan</button>
                        </div>
                         <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Cari item..."
                                value={inventorySearch}
                                onChange={(e) => setInventorySearch(e.target.value)}
                                className="w-full bg-[#2a2627]/70 p-2 rounded border border-[#816b5a]/50 focus:outline-none focus:ring-2 focus:ring-[#e0b784]/50 transition-all placeholder:text-stone-400"
                            />
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {sortedInventory.map((item, index) => {
                                const isFavorite = favorites.includes(item.id) && (item.type === 'fish' || item.id === 'stonehenge-relic');
                                return <ItemCard key={`${item.id}-${index}`} item={item} onClick={() => setSelectedItem(item)} activeBait={activeBait} activeBaitDurability={activeBaitDurability} isFavorite={isFavorite} />;
                            })}
                        </div>
                        {sortedInventory.length === 0 && <p className="text-center text-stone-400 mt-4">Tidak ada item yang cocok.</p>}
                     </div>
                );
            case Tab.Shop: 
                const fishByRarity = inventory.reduce((acc, item) => {
                    if (item.type === 'fish' && item.rarity) {
                        if (!acc[item.rarity]) acc[item.rarity] = 0;
                        acc[item.rarity]! += calculateFishValue(item);
                    }
                    return acc;
                }, {} as { [key in Rarity]?: number });

                const fishToSellFiltered = inventory.filter(item => item.type === 'fish' && item.name.toLowerCase().includes(shopSearch.toLowerCase()));
                const baitsToBuyFiltered = shopBaits.filter(item => item.name.toLowerCase().includes(shopSearch.toLowerCase()));
                const potionsToBuyFiltered = shopPotions.filter(item => item.name.toLowerCase().includes(shopSearch.toLowerCase()));

                const fishGroupedByRarity = fishToSellFiltered.reduce((acc, fish) => {
                    if (!fish.rarity) return acc;
                    if (!acc[fish.rarity]) acc[fish.rarity] = [];
                    acc[fish.rarity].push(fish);
                    return acc;
                }, {} as Record<Rarity, InventoryItem[]>);

                const RARITY_ORDER: Rarity[] = ["executors", "dev", "anonymous", "mysterious", "secret", "mythic", "legendary", "epic", "rare", "uncommon", "common"];

                const sortedRarityKeys = (Object.keys(fishGroupedByRarity) as Rarity[]).sort((a, b) => {
                    return RARITY_ORDER.indexOf(a) - RARITY_ORDER.indexOf(b);
                });
                
                const totalSelectedValue = inventory
                    .filter(item => selectedFishToSell.includes(item.id))
                    .reduce((sum, fish) => sum + calculateFishValue(fish), 0);

                return (
                <div className="relative flex flex-col h-full">
                     <div className="flex mb-3 bg-[#2a2627]/70 rounded-md overflow-x-auto">
                        <button onClick={() => { setShopFilter('sell'); setShopSearch(''); }} className={`flex-1 p-2 text-center text-xs sm:text-sm font-semibold cursor-pointer transition-colors capitalize whitespace-nowrap ${shopFilter === 'sell' ? 'bg-[#816b5a]/50 text-[#e0b784]' : 'hover:bg-white/10 text-stone-400'}`}>Jual Ikan</button>
                        <button onClick={() => { setShopFilter('bait'); setShopSearch(''); }} className={`flex-1 p-2 text-center text-xs sm:text-sm font-semibold cursor-pointer transition-colors capitalize whitespace-nowrap ${shopFilter === 'bait' ? 'bg-[#816b5a]/50 text-[#e0b784]' : 'hover:bg-white/10 text-stone-400'}`}>Beli Umpan</button>
                        <button onClick={() => { setShopFilter('potion'); setShopSearch(''); }} className={`flex-1 p-2 text-center text-xs sm:text-sm font-semibold cursor-pointer transition-colors capitalize whitespace-nowrap ${shopFilter === 'potion' ? 'bg-[#816b5a]/50 text-[#e0b784]' : 'hover:bg-white/10 text-stone-400'}`}>Beli Ramuan</button>
                     </div>
                     <div className="mb-4">
                        <input
                            type="text"
                            placeholder={`Cari ${shopFilter === 'sell' ? 'ikan' : shopFilter === 'bait' ? 'umpan' : 'ramuan'}...`}
                            value={shopSearch}
                            onChange={(e) => setShopSearch(e.target.value)}
                            className="w-full bg-[#2a2627]/70 p-2 rounded border border-[#816b5a]/50 focus:outline-none focus:ring-2 focus:ring-[#e0b784]/50 transition-all placeholder:text-stone-400"
                        />
                    </div>

                    <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                        {shopFilter === 'sell' && (
                            <div>
                                <h4 className="text-lg font-semibold mb-2 border-b border-[#816b5a]/50 pb-1">Jual Cepat Berdasarkan Kelangkaan</h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                                    {(Object.keys(fishByRarity) as Rarity[]).map(rarity => (
                                        <button key={rarity} onClick={() => handleSellRarity(rarity)} className="bg-green-800/80 hover:bg-green-700/80 text-white px-2 py-2 rounded text-xs capitalize transition-colors">
                                            Jual Semua {rarity}<br/>({fishByRarity[rarity]} Koin)
                                        </button>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-4 mb-2 border-b border-[#816b5a]/50 pb-1">
                                    <h4 className="text-lg font-semibold">Jual Ikan Individual</h4>
                                    <button
                                        onClick={() => {
                                            setIsBulkSellMode(prev => !prev);
                                            setSelectedFishToSell([]);
                                        }}
                                        className={`px-3 py-1 text-sm rounded transition-colors ${isBulkSellMode ? 'bg-sky-600 text-white' : 'bg-[#2a2627]/70'}`}
                                    >
                                        {isBulkSellMode ? 'Batal' : 'Pilih Beberapa'}
                                    </button>
                                </div>
                                {sortedRarityKeys.map(rarity => {
                                    const isCollapsed = collapsedRarities[rarity];
                                    const fishInRarity = fishGroupedByRarity[rarity];
                                    if (!fishInRarity || fishInRarity.length === 0) return null;

                                    return (
                                        <div key={rarity} className="mb-3 bg-inset rounded-md">
                                            <div
                                                onClick={() => toggleRarityCollapse(rarity)}
                                                className={`p-2 rounded-t-md cursor-pointer flex justify-between items-center font-bold text-lg ${RARITY_COLORS[rarity]} bg-[#2a2627]/70`}
                                            >
                                                <span className="capitalize">{rarity}</span>
                                                <div className="flex items-center gap-2">
                                                    <span>{fishInRarity.length} Ikan</span>
                                                    <span className={`transform transition-transform ${isCollapsed ? '-rotate-90' : ''}`}>▼</span>
                                                </div>
                                            </div>
                                            {!isCollapsed && (
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 bg-inset rounded-b-md">
                                                    {fishInRarity.map(fish => (
                                                        <div
                                                            key={fish.id}
                                                            onClick={() => isBulkSellMode ? handleToggleFishSelection(fish.id) : handleSellFish(fish)}
                                                            className={`relative p-2 rounded-md text-center cursor-pointer transition-all border-2 ${isBulkSellMode && selectedFishToSell.includes(fish.id) ? 'border-sky-400 scale-105 bg-sky-900/50' : 'border-transparent'} bg-[#2a2627]/50 hover:bg-white/10`}
                                                        >
                                                            <div className="text-2xl h-8 flex items-center justify-center">{fish.icon && fish.icon.startsWith('http') ? <img src={fish.icon} alt={fish.name} className="max-h-full max-w-full object-contain" /> : fish.icon || '🐟'}</div>
                                                            <p className="text-xs truncate font-semibold">{fish.name}</p>
                                                            <p className="text-xs text-stone-400">{fish.weight?.toFixed(2)}kg</p>
                                                            <p className="text-sm font-bold text-yellow-400">{calculateFishValue(fish)} Koin</p>
                                                            {!isBulkSellMode && <button className="mt-1 w-full text-xs py-1 bg-amber-600 hover:bg-amber-700 rounded transition-colors">Jual</button>}
                                                            {isBulkSellMode && (
                                                                <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center border-2 border-stone-500">
                                                                    {selectedFishToSell.includes(fish.id) && <div className="w-3 h-3 rounded-full bg-sky-400"></div>}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                                {fishToSellFiltered.length === 0 && <p className="text-center text-stone-400 mt-4">Tidak ada ikan untuk dijual.</p>}
                            </div>
                        )}
                        {shopFilter === 'bait' && (
                            <div>
                                {baitsToBuyFiltered.map(item => (
                                    <div key={item.id} className="flex justify-between items-center p-2 bg-[#2a2627]/50 rounded mb-2">
                                        <div>
                                            <p>{item.name}</p>
                                            <p className="text-sm text-yellow-400">{item.currentPrice} Koin</p>
                                        </div>
                                        <button onClick={() => {
                                            if (money >= item.currentPrice) {
                                                setMoney(m => m - item.currentPrice);
                                                addToInventory(item as InventoryItem, 1);
                                                showNotification(`Membeli ${item.name}`);
                                                const newPrice = getNextPrice(item.currentPrice, item.priceIncrease);
                                                setShopBaits(prev => prev.map(b => b.id === item.id ? {...b, currentPrice: newPrice} : b));
                                            } else { showNotification("Koin tidak cukup!"); }
                                        }} className="bg-teal-800 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm font-bold transition-colors">Beli</button>
                                    </div>
                                ))}
                                {baitsToBuyFiltered.length === 0 && <p className="text-center text-stone-400 mt-4">Tidak ada umpan yang cocok.</p>}
                            </div>
                        )}
                         {shopFilter === 'potion' && (
                            <div>
                                {potionsToBuyFiltered.map(item => (
                                    <div key={item.id} className="flex justify-between items-center p-2 bg-[#2a2627]/50 rounded mb-2">
                                        <div>
                                            <p>{item.name}</p>
                                            <p className="text-sm text-yellow-400">{item.currentPrice} Koin</p>
                                        </div>
                                        <button onClick={() => {
                                            if (money >= item.currentPrice) {
                                                setMoney(m => m - item.currentPrice);
                                                addToInventory(item as InventoryItem, 1);
                                                showNotification(`Membeli ${item.name}`);
                                                const newPrice = getNextPrice(item.currentPrice, item.priceIncrease);
                                                setShopPotions(prev => prev.map(p => p.id === item.id ? {...p, currentPrice: newPrice} : p));
                                            } else { showNotification("Koin tidak cukup!"); }
                                        }} className="bg-teal-800 hover:bg-teal-700 text-white px-3 py-1 rounded text-sm font-bold transition-colors">Beli</button>
                                    </div>
                                ))}
                                {potionsToBuyFiltered.length === 0 && <p className="text-center text-stone-400 mt-4">Tidak ada ramuan yang cocok.</p>}
                            </div>
                        )}
                    </div>

                    {isBulkSellMode && selectedFishToSell.length > 0 && (
                        <div className="mt-auto p-3 bg-panel border-t-2 border-[#816b5a] flex justify-between items-center">
                            <div>
                                <p>Terpilih: {selectedFishToSell.length} Ikan</p>
                                <p className="font-bold text-yellow-300">Total: {totalSelectedValue} Koin</p>
                            </div>
                            <button onClick={handleSellSelected} className="px-4 py-2 bg-green-800 hover:bg-green-700 text-white rounded font-bold">
                                Jual Terpilih
                            </button>
                        </div>
                    )}
                </div>
            );
            case Tab.Map: return (
                <div>
                    <div className="relative w-full h-52 bg-[#2a2627]/50 rounded-lg overflow-hidden border border-[#816b5a]/50 p-4">
                        {LOCATIONS.map((loc, index) => {
                            const angle = (index / LOCATIONS.length) * 2 * Math.PI, radiusX = 40, radiusY = 25, x = 50 + radiusX * Math.cos(angle), y = 50 + radiusY * Math.sin(angle);
                            const isCurrent = loc.id === currentLocation;
                            const canAccess = equippedRod.weight >= (loc.difficulty * 10);
                            return (
                                <div key={loc.id} title={`${loc.name}${loc.difficulty < 999 ? ` (Difficulty: ${loc.difficulty})` : ''}`}
                                     onClick={() => {
                                        if (loc.isActionLocation) {
                                            if (loc.id === 'enchanting-altar') handleOpenEnchantingModal();
                                        } else if (canAccess) {
                                            setCurrentLocation(loc.id);
                                        } else {
                                            showNotification("Joran tidak cukup kuat for lokasi ini.");
                                        }
                                     }}
                                     className={`absolute text-2xl transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300
                                        ${isCurrent && !loc.isActionLocation ? 'text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.7)] scale-125' : canAccess ? 'text-amber-300 hover:text-amber-200' : 'text-stone-600 cursor-not-allowed'}
                                     `}
                                     style={{ left: `${x}%`, top: `${y}%` }}
                                >
                                    {isCurrent && !loc.isActionLocation ? '🏯' : loc.icon}
                                </div>
                            );
                        })}
                    </div>
                    <p className="mt-4 text-center text-lg">Lokasi saat ini: <span className="font-bold text-[#e0b784]">{LOCATIONS.find(l => l.id === currentLocation)?.name}</span></p>
                </div>
            );
            case Tab.Skills: return (
                <div>
                    <h3 className="text-xl font-bold mb-4 text-[#e0b784]">Skills ({player.skillPoints} Poin Tersedia)</h3>
                    {(Object.keys(player.skills)).map(skillKeyStr => {
                        const skillKey = skillKeyStr as keyof typeof player.skills;
                        const skill = player.skills[skillKey];
                        return (
                             <div key={skillKey} className="flex justify-between items-center p-3 bg-[#2a2627]/50 rounded mb-2 border border-transparent hover:border-[#816b5a]/70 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">{skill.icon}</span>
                                    <div>
                                        <h4 className="font-semibold text-lg">{skill.name}</h4>
                                        <p className="text-sm">Level <span className="text-yellow-400 font-bold text-base">{skill.level}</span></p>
                                    </div>
                                </div>
                                <button onClick={() => handleUpgradeSkill(skillKey)} disabled={player.skillPoints <= 0} className="bg-teal-800 hover:bg-teal-700 text-white px-4 py-2 rounded text-sm font-bold disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">Tingkatkan</button>
                            </div>
                        );
                    })}
                </div>
            );
            case Tab.Rods: return (
                <div>
                    <h3 className="text-xl font-bold mb-4 text-[#e0b784]">Koleksi Joran</h3>
                    {rods.map(rod => {
                        const rodStats = rod.id === equippedRod.id ? equippedRodStats : { luck: rod.luck, weight: rod.weight, speed: rod.speed, endurance: rod.endurance };
                        return (
                            <div key={rod.id} className={`p-3 bg-[#2a2627]/50 rounded mb-2 transition-all ${rod.equipped ? 'border-2 border-amber-400' : 'border-2 border-transparent'}`}>
                                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div className='flex-grow'>
                                        <h4 className="font-semibold text-lg">{rod.name}</h4>
                                        <p className="text-xs text-gray-400">
                                            Luck: {rodStats.luck}% | Kapasitas: {rodStats.weight === Infinity ? '∞' : rodStats.weight.toLocaleString()}kg | Kecepatan: {rodStats.speed}% | Ketahanan: {rodStats.endurance}%
                                        </p>
                                        {rod.description && <p className="text-sm mt-1 text-stone-300 italic">{rod.description}</p>}
                                        {rod.enchantment && <p className="text-sm mt-1 text-cyan-300">✨ {rod.enchantment.name}</p>}
                                        {rod.cosmicEnchantment && <p className="text-sm mt-1 text-purple-300">🌌 {rod.cosmicEnchantment.name}</p>}
                                    </div>
                                    <div className="mt-2 sm:mt-0 sm:ml-4 flex-shrink-0">
                                    {rod.owned ? (
                                        <button onClick={() => handleEquipRod(rod.id)} disabled={rod.equipped} className="bg-green-800 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-bold disabled:bg-gray-600/50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto">
                                            {rod.equipped ? 'Dipakai' : 'Pakai'}
                                        </button>
                                    ) : (
                                        rod.unlockDescription ? (
                                            <button disabled className="bg-gray-600 cursor-not-allowed text-white px-3 py-1 rounded text-sm font-bold w-full sm:w-auto">
                                                {rod.unlockDescription}
                                            </button>
                                        ) : (
                                            <button onClick={() => handleBuyRod(rod.id)} disabled={money < rod.price} className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1 rounded text-sm font-bold disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors w-full sm:w-auto">
                                                Beli ({rod.price.toLocaleString()})
                                            </button>
                                        )
                                    )}
                                    </div>
                                 </div>
                            </div>
                        )
                    })}
                </div>
            );
            default: return null;
        }
    };

    const fishingButtonText = useMemo(() => {
        switch(fishingPhase) {
            case 'idle':
            case 'caught':
            case 'escaped':
                return 'Lempar';
            case 'biting':
                return 'Tarik!';
            case 'reeling':
                return 'Tarik Terus!';
            default:
                return '...';
        }
    }, [fishingPhase]);

    const isFishingButtonDisabled = useMemo(() => {
        if (isAutoFishing) {
            return true;
        }
        // The button should only be enabled when direct user action is required 
        // ('idle' to cast, 'biting'/'reeling' to reel). It is disabled during
        // automatic transitions or while waiting.
        switch (fishingPhase) {
            case 'idle':
            case 'biting':
            case 'reeling':
                return false; // Enabled for user action
            default:
                return true; // Disabled for 'casting', 'waiting', 'caught', 'escaped'
        }
    }, [isAutoFishing, fishingPhase]);
// FIX: The logic for disabling the auto-fish toggle was complex and could lead to a TypeScript type comparison error where the type of `fishingPhase` was incorrectly narrowed.
// Replacing the logic with a clear switch statement resolves this potential issue by making the control flow explicit for the type checker.
    const isAutoFishToggleDisabled = useMemo(() => {
        // The toggle can always be turned off.
        if (isAutoFishing) {
            return false;
        }
        // It can only be turned on when the player is idle.
        switch (fishingPhase) {
            case 'idle':
                return false; // Can enable
            default:
                return true; // Cannot enable during an active fishing phase
        }
    }, [isAutoFishing, fishingPhase]);

    // --- MAIN RENDER ---
    return (
        <div className={`max-w-7xl mx-auto p-2 sm:p-5 font-sans text-[#f5e6d3] min-h-screen overflow-hidden transition-colors duration-1000 ${!isDay ? 'theme-night' : ''}`}>
            <SakuraFall />
            <header className="relative flex justify-between items-center mb-5 p-4 bg-panel rounded-lg border-2 border-[#816b5a]">
                 <div className="flex-1 text-center lg:text-left flex items-center gap-4">
                    <span className="text-5xl hidden sm:inline">🏯</span>
                    <div>
                        <h1 className="text-4xl font-bold mb-1 text-shadow-lg text-[#e0b784] tracking-wider">漁師の物語</h1>
                        <p className="text-sm text-stone-400 hidden md:block">The Fisherman's Tale - Tangkap ikan, tingkatkan peralatan!</p>
                    </div>
                </div>

                <div ref={accountMenuRef} className="flex items-center gap-2">
                     <button onClick={() => setIsSettingsModalOpen(true)} className="w-12 h-12 bg-[#2a2627]/70 rounded-full border border-white/20 flex items-center justify-center text-2xl hover:bg-white/10 transition-colors">
                        <span role="img" aria-label="Settings">⚙️</span>
                    </button>
                    <button onClick={() => setIsAccountMenuOpen(prev => !prev)} className="w-12 h-12 bg-[#2a2627]/70 rounded-full border border-white/20 flex items-center justify-center text-2xl hover:bg-white/10 transition-colors">
                        {user?.avatar || '👤'}
                    </button>
                    {isAccountMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-panel/90 backdrop-blur-sm border border-[#816b5a] rounded-lg shadow-lg z-20 py-2">
                            {user ? (
                                <>
                                    <p className="px-4 py-2 text-[#e0b784] font-semibold border-b border-white/10 truncate">{user.username}</p>
                                    <button onClick={() => { setIsPlayerStatsModalOpen(true); setIsAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">Statistik Pemain</button>
                                    <button onClick={() => { setIsCollectionModalOpen(true); setIsAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">Koleksi Saya</button>
                                    <button onClick={() => { setIsAvatarModalOpen(true); setIsAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">Ganti Avatar</button>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:bg-white/10 transition-colors">Keluar</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => { setAuthView('login'); setIsAuthModalOpen(true); setIsAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">Masuk</button>
                                    <button onClick={() => { setAuthView('register'); setIsAuthModalOpen(true); setIsAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-white/10 transition-colors">Daftar</button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </header>

            <main className="flex flex-col lg:flex-row gap-5">
                <section className="flex-grow lg:w-1/2 bg-panel rounded-lg p-4 flex flex-col items-center border-2 border-[#816b5a]">
                    <h2 className="text-2xl font-bold mb-2 text-[#e0b784]">Area Memancing</h2>
                    
                    <div id="water" className="relative w-full h-80 animated-water rounded-lg overflow-hidden my-4 border-2 border-[#816b5a] shadow-inner shadow-black/50">
                        
                        {animationMode === 'full' && (
                             <div className={`fishing-rod-container rod-style-${equippedRod.visual || 'wood'} ${fishingPhase !== 'idle' ? 'is-fishing' : ''} action-${rodAction}`}>
                                <div className="fishing-hand"></div>
                                <div className="fishing-rod"></div>
                                <div className="fishing-reel">
                                    <div className="reel-handle"></div>
                                </div>
                            </div>
                        )}

                        {fishingPhase !== 'idle' && (
                            <div className={`fishing-line-container ${fishingPhase !== 'idle' ? 'is-fishing' : ''} action-${rodAction}`}>
                                <div className="fishing-line" style={{ height: '280px' }}>
                                    <div className="fishing-hook"></div>
                                </div>
                            </div>
                        )}
                        

                        {fishPosition && <div className="absolute w-10 h-5 rounded-full" style={{ background: 'rgba(0,0,0,0.4)', top: `${fishPosition.y}%`, left: `${fishPosition.x}%`, transition: 'top 0.1s linear, left 0.1s linear' }}></div>}
                        {caughtFishAnimation && <div key={caughtFishAnimation.key} className="w-10 h-5 rounded-full absolute left-1/2 bottom-0 animate-caught" style={caughtFishAnimation.style}></div>}
                    </div>

                    <div className="w-full flex justify-center gap-4 my-2">
                        <button 
                            onClick={fishingPhase === 'idle' ? handleCast : handleFishingAction} 
                            disabled={isFishingButtonDisabled} 
                            className="px-6 py-3 bg-red-800 text-white rounded-md font-bold text-lg transition-all hover:bg-red-700 hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {fishingButtonText}
                        </button>
                    </div>

                    {player.level >= 5 && (
                        <div className="flex items-center justify-center mt-2">
                            <label htmlFor="auto-fish-toggle" className="mr-2 font-semibold">Auto Fishing:</label>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input 
                                    type="checkbox" 
                                    name="auto-fish-toggle" 
                                    id="auto-fish-toggle" 
                                    checked={isAutoFishing}
                                    onChange={() => setIsAutoFishing(prev => !prev)}
                                    disabled={isAutoFishToggleDisabled}
                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                />
                                <label 
                                    htmlFor="auto-fish-toggle" 
                                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-500 cursor-pointer"
                                ></label>
                            </div>
                        </div>
                    )}

                    <div className="w-full my-2">
                        <div className="w-full h-5 bg-inset rounded-full overflow-hidden border border-white/10 p-0.5">
                        {fishingPhase === 'biting' ? (
                             <div className="h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full" style={{width: `${biteWindow}%`, transition: 'width 0.1s linear'}}></div>
                        ) : fishingPhase === 'reeling' ? (
                             <div className="h-full bg-gradient-to-r from-teal-400 to-sky-500 rounded-full" style={{width: `${reelingProgress}%`, transition: 'width 0.1s linear'}}></div>
                        ) : (
                             <div className="h-full" style={{width: `0%`}}></div>
                        )}
                        </div>
                        <p className="text-center text-sm mt-1 h-5">{fishingStatus}</p>
                    </div>
                     <div className="w-full my-2">
                        <div className="w-full h-5 bg-inset rounded-full overflow-hidden border border-white/10 p-0.5"><div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-300" style={{width: `${(player.xp / getRequiredXP(player.level)) * 100}%`}}></div></div>
                         <p className="text-center text-sm mt-1">Level {player.level} XP: {player.xp}/{getRequiredXP(player.level)}</p>
                    </div>
                </section>

                <section className="flex-grow lg:w-1/2 bg-panel rounded-lg p-4 border-2 border-[#816b5a] flex flex-col">
                     <div className="flex mb-3 bg-inset rounded-md overflow-x-auto">
                        {Object.values(Tab).map(tab => (
                             <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 p-2 text-center text-xs sm:text-sm font-semibold cursor-pointer transition-colors capitalize whitespace-nowrap ${activeTab === tab ? 'bg-[#816b5a]/50 text-[#e0b784]' : 'hover:bg-white/10 text-stone-400'}`}>
                                {tab}
                             </button>
                        ))}
                     </div>
                     <div className="tab-content flex-grow overflow-y-auto pr-2 relative">
                        {renderTabContent()}
                     </div>
                </section>
            </main>

            {notification && (
                <div className="fixed top-5 right-5 p-4 modal-panel rounded-lg z-50 animate-slide-in">
                    {notification}
                </div>
            )}

            {showLevelUp && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="modal-panel p-8 rounded-lg text-center shadow-2xl shadow-amber-500/50 animate-pulse-slow border-amber-500">
                        <h2 className="text-4xl font-bold text-yellow-300 mb-2">Level Up!</h2>
                        <p className="text-xl mb-4">Selamat! Anda sekarang Level <span className="font-bold">{player.level}</span></p>
                        <div className="bg-black/30 p-4 rounded-md">
                            <p className="font-semibold">Hadiah:</p>
                            <p>+1 Skill Point</p>
                            <p>+{50 * player.level} Koin</p>
                        </div>
                        <button onClick={() => setShowLevelUp(false)} className="mt-6 px-6 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-colors">Tutup</button>
                    </div>
                 </div>
            )}

            {selectedItem && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSelectedItem(null)}>
                    <div className="modal-panel p-6 rounded-lg w-72 flex flex-col gap-3" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-center text-[#e0b784]">{selectedItem.name}</h3>
                        {(selectedItem.type === 'bait' || selectedItem.type === 'potion') && <button onClick={() => handleItemUse(selectedItem)} className="w-full py-2 bg-green-800 hover:bg-green-700 rounded font-bold transition-colors">Gunakan</button>}
                        {(selectedItem.type === 'fish' || selectedItem.id === 'stonehenge-relic') && (
                            <button onClick={() => {
                                setFavorites(f => f.includes(selectedItem.id) ? f.filter(id => id !== selectedItem.id) : [...f, selectedItem.id]);
                                setSelectedItem(null);
                            }} className="w-full py-2 bg-teal-800 hover:bg-teal-700 rounded font-bold transition-colors">{favorites.includes(selectedItem.id) ? 'Hapus Favorit' : 'Tambah Favorit'}</button>
                        )}
                        <button onClick={() => setSelectedItem(null)} className="w-full py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors">Batal</button>
                    </div>
                </div>
            )}
            
            {isAuthModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setIsAuthModalOpen(false)}>
                    <div className="modal-panel p-6 rounded-lg w-80" onClick={e => e.stopPropagation()}>
                        <div className="flex mb-4 border-b border-[#816b5a]/50">
                            <button onClick={() => setAuthView('login')} className={`flex-1 p-2 text-center text-lg font-semibold transition-colors ${authView === 'login' ? 'text-white border-b-2 border-amber-400' : 'text-stone-400'}`}>Masuk</button>
                            <button onClick={() => setAuthView('register')} className={`flex-1 p-2 text-center text-lg font-semibold transition-colors ${authView === 'register' ? 'text-white border-b-2 border-amber-400' : 'text-stone-400'}`}>Daftar</button>
                        </div>
                        <form onSubmit={authView === 'login' ? handleLogin : handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Username</label>
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-black/30 p-2 rounded border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/30 p-2 rounded border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all" required />
                            </div>
                            <button type="submit" className="w-full py-2 bg-teal-800 hover:bg-teal-700 rounded font-bold transition-colors">
                                {authView === 'login' ? 'Masuk' : 'Daftar'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isAvatarModalOpen && (
                 <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setIsAvatarModalOpen(false)}>
                    <div className="modal-panel p-6 rounded-lg" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-center mb-4 text-[#e0b784]">Pilih Avatar</h3>
                        <div className="grid grid-cols-5 gap-4">
                            {AVATARS.map(avatar => (
                                <button key={avatar} onClick={() => handleChangeAvatar(avatar)} className={`w-16 h-16 text-4xl rounded-full flex items-center justify-center transition-all hover:bg-white/20 ${user?.avatar === avatar ? 'bg-teal-800/50' : 'bg-black/30'}`}>
                                    {avatar}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {isPlayerStatsModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setIsPlayerStatsModalOpen(false)}>
                    <div className="modal-panel p-6 rounded-lg w-80" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-center mb-4 text-[#e0b784]">Statistik Pemain</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                                <span className="font-semibold">Koin:</span>
                                <span className="font-bold text-lg text-yellow-300">{money.toLocaleString()} 💰</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                                <span className="font-semibold">Level:</span>
                                <span className="font-bold text-lg text-purple-300">{player.level} ⭐</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                                <span className="font-semibold">Keberuntungan Dasar:</span>
                                <span className="font-bold text-lg text-cyan-300">{player.baseLuck?.toFixed(1) || 0} 🎲</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                                <span className="font-semibold">Total Keberuntungan:</span>
                                <span className="font-bold text-lg text-green-300">{totalLuck.toFixed(0)}% 🍀</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/20 p-2 rounded">
                                <span className="font-semibold">Poin Skill:</span>
                                <span className="font-bold text-lg text-sky-300">{player.skillPoints} ✨</span>
                            </div>
                        </div>
                        <button onClick={() => setIsPlayerStatsModalOpen(false)} className="mt-6 w-full py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors">Tutup</button>
                    </div>
                </div>
            )}

            {isCollectionModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setIsCollectionModalOpen(false)}>
                    <div className="modal-panel p-6 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-[#e0b784]">Buku Koleksi Ikan</h3>
                            <button onClick={() => setIsCollectionModalOpen(false)} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <StatCard label="Total Tangkapan" value={totalCaught} />
                            <StatCard label="XP Saat Ini" value={player.xp} />
                        </div>
                        <div className="overflow-y-auto pr-2 tab-content">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {FISH_TYPES.map(fishType => {
                                    const collectionData = fishCollection[fishType.id];
                                    const isDiscovered = !!collectionData;

                                    return (
                                        <div key={fishType.id} className={`p-3 rounded-lg text-center transition-all duration-300 ${isDiscovered ? 'bg-[#2a2627]/50' : 'bg-black/40'}`}>
                                            <div className={`text-4xl transition-all duration-500 h-10 w-10 mx-auto flex items-center justify-center ${!isDiscovered ? 'opacity-20 grayscale scale-90' : ''}`}>
                                                {isDiscovered ? (
                                                    fishType.icon.startsWith('http') ? (
                                                        <img src={fishType.icon} alt={fishType.name} className="max-h-full max-w-full object-contain" />
                                                    ) : (
                                                        fishType.icon
                                                    )
                                                ) : '❓'}
                                            </div>
                                            <div className={`font-bold mt-1 text-xs sm:text-sm ${isDiscovered ? RARITY_COLORS[fishType.rarity] : 'text-gray-600'}`}>
                                                {isDiscovered ? fishType.name : '???'}
                                            </div>
                                            {isDiscovered && (
                                                <div className="text-xs mt-1 text-gray-400">
                                                    <p>Tertangkap: {collectionData.count}</p>
                                                    <p>Terberat: {collectionData.heaviest.toFixed(2)}kg</p>
                                                    {collectionData.mutations.size > 0 && (
                                                        <p title={Array.from(collectionData.mutations).join(', ')}>
                                                            Mutasi: {collectionData.mutations.size}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isEnchantingModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setIsEnchantingModalOpen(false)}>
                    <div className="modal-panel p-6 rounded-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-[#e0b784]">Enchanting Altar</h3>
                            <button onClick={() => setIsEnchantingModalOpen(false)} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
                        </div>
                        <div className="text-center mb-4 p-3 bg-black/20 rounded">
                            <p>Joran Aktif: <span className="font-bold text-amber-300">{equippedRod.name}</span></p>
                            <p>Stonehenge Relics: <span className="font-bold text-lime-400">{stonehengeRelicCount} 💎</span></p>
                            <p>Roll Harian Tersisa: <span className="font-bold text-sky-400">{8 - enchantRollsToday} / 8</span></p>
                        </div>

                        {pendingEnchantment ? (
                            <div className="text-center p-4 bg-black/30 rounded border-2 border-amber-400/50">
                                <h4 className="text-xl font-bold text-amber-300">{pendingEnchantment.name}</h4>
                                <p className="capitalize text-sm text-stone-400 mb-2">({pendingEnchantment.type} Enchantment)</p>
                                <p className="mb-2">{pendingEnchantment.description}</p>
                                <p className="text-xs italic text-stone-400">{pendingEnchantment.tips}</p>
                                <div className="flex gap-4 mt-4">
                                    <button onClick={handleApplyEnchantment} className="flex-1 py-2 bg-green-800 hover:bg-green-700 rounded font-bold transition-colors">Terapkan</button>
                                    <button onClick={() => setPendingEnchantment(null)} className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 rounded font-bold transition-colors">Buang</button>
                                </div>
                            </div>
                        ) : (
                             <button 
                                onClick={handleRollEnchantment} 
                                disabled={stonehengeRelicCount < 1 || enchantRollsToday >= 8}
                                className="w-full py-3 bg-teal-800 hover:bg-teal-700 rounded font-bold text-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                Roll Enchantment (1 💎)
                            </button>
                        )}
                    </div>
                </div>
            )}

            {isSettingsModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setIsSettingsModalOpen(false)}>
                    <div className="modal-panel p-6 rounded-lg w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-center mb-4 text-[#e0b784]">Pengaturan</h3>
                        <div className="flex justify-between items-center bg-black/20 p-3 rounded">
                            <div>
                                <p className="font-semibold">Mode Animasi Memancing</p>
                                <p className="text-xs text-stone-400">Mode sederhana dapat meningkatkan FPS.</p>
                            </div>
                            <div className="flex items-center">
                                <span className={`mr-2 text-sm font-semibold transition-colors ${animationMode === 'full' ? 'text-white' : 'text-stone-500'}`}>Penuh</span>
                                <div className="relative inline-block w-10 align-middle select-none">
                                    <input 
                                        type="checkbox" 
                                        name="animation-toggle" 
                                        id="animation-toggle" 
                                        checked={animationMode === 'simple'}
                                        onChange={() => setAnimationMode(prev => prev === 'full' ? 'simple' : 'full')}
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                    />
                                    <label htmlFor="animation-toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-500 cursor-pointer"></label>
                                </div>
                                <span className={`ml-2 text-sm font-semibold transition-colors ${animationMode === 'simple' ? 'text-white' : 'text-stone-500'}`}>Sederhana</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                             <button
                                onClick={handleManualSave}
                                disabled={!user}
                                className="w-full py-2 bg-teal-800 hover:bg-teal-700 rounded font-bold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                Simpan Data Game
                            </button>
                            <button
                                onClick={handleManualLoad}
                                disabled={!user}
                                className="w-full py-2 bg-sky-800 hover:bg-sky-700 rounded font-bold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                            >
                                Muat Data Game
                            </button>
                        </div>
                        <button onClick={() => setIsSettingsModalOpen(false)} className="mt-6 w-full py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors">Tutup</button>
                    </div>
                </div>
            )}

            {isChangelogModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setIsChangelogModalOpen(false)}>
                    <div className="modal-panel p-6 rounded-lg w-full max-w-2xl h-[70vh] flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#816b5a]/50">
                            <h3 className="text-2xl font-bold text-[#e0b784]">Informasi Pembaruan</h3>
                            <button onClick={() => setIsChangelogModalOpen(false)} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
                        </div>
                        <div className="overflow-y-auto pr-4 -mr-4 tab-content flex-grow">
                            {CHANGELOG_DATA.map(log => (
                                <div key={log.version} className="mb-6 last:mb-0">
                                    <h4 className="text-xl font-semibold text-amber-300 border-b border-white/10 pb-1 mb-2">
                                        Versi {log.version} <span className="text-sm font-normal text-stone-400">- {log.date}</span>
                                    </h4>
                                    {log.adds && log.adds.length > 0 && (
                                        <div className="mb-3">
                                            <p className="font-bold text-green-400">✅ Penambahan:</p>
                                            <ul className="list-disc list-inside text-stone-300 text-sm pl-2 space-y-1">
                                                {log.adds.map((item, index) => <li key={`add-${index}`}>{item}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {log.changes && log.changes.length > 0 && (
                                        <div className="mb-3">
                                            <p className="font-bold text-sky-400">🔧 Perubahan:</p>
                                            <ul className="list-disc list-inside text-stone-300 text-sm pl-2 space-y-1">
                                                {log.changes.map((item, index) => <li key={`change-${index}`}>{item}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {log.removals && log.removals.length > 0 && (
                                        <div>
                                            <p className="font-bold text-red-400">❌ Pengurangan:</p>
                                            <ul className="list-disc list-inside text-stone-300 text-sm pl-2 space-y-1">
                                                {log.removals.map((item, index) => <li key={`remove-${index}`}>{item}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="absolute bottom-2 left-4 text-xs text-stone-500">
                            Versi {GAME_VERSION}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .sakura-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
                .petal { position: absolute; top: -10%; color: #ffb7c5; opacity: 0.8; animation-name: fall; animation-timing-function: linear; animation-iteration-count: infinite; }
                .petal-sway { position: absolute; width: 100%; animation-name: sway; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate; }
                @keyframes fall {
                    to { transform: translateY(105vh) rotate(360deg); }
                }
                @keyframes sway {
                   from { transform: translateX(-20px); } to { transform: translateX(20px); }
                }
                .toggle-checkbox:checked { right: 0; border-color: #9a3434; }
                .toggle-checkbox:checked + .toggle-label { background-color: #9a3434; }
                .animate-swim { animation: swim 3s infinite; }
                @keyframes caught {
                    0% { transform: translateY(0) translateX(-50%) scale(1); opacity: 1; } 100% { transform: translateY(-300px) translateX(-50%) scale(0.5); opacity: 0; }
                }
                .animate-caught { animation: caught 2s forwards; }
                @keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                .animate-slide-in { animation: slide-in 0.5s forwards; }
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(251, 191, 36, 0.5); } 50% { transform: scale(1.02); box-shadow: 0 0 30px rgba(251, 191, 36, 0.8); }
                }
                .animate-pulse-slow { animation: pulse-slow 2s infinite; }
                .grayscale { filter: grayscale(100%); }

                /* Rod Animations */
                .fishing-rod-container {
                    position: absolute;
                    bottom: -15px;
                    right: -115px;
                    width: 280px;
                    height: 280px;
                    transform-origin: 20px 260px;
                    transform: rotate(45deg);
                    transition: transform 0.5s ease-out;
                    pointer-events: none;
                    z-index: 5;
                }
                .fishing-rod {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 8px;
                    height: 100%;
                    border-radius: 4px;
                    box-shadow: 0 0 4px rgba(0,0,0,0.5);
                    transition: background 0.5s ease;
                }
                .fishing-reel {
                    position: absolute;
                    bottom: 35px;
                    left: -11px;
                    width: 26px;
                    height: 26px;
                    background: #606060;
                    border: 2px solid #333;
                    border-radius: 50%;
                    z-index: 10;
                }
                .reel-handle {
                    position: absolute;
                    top: -8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 5px;
                    height: 15px;
                    background: #444;
                    border-radius: 2px;
                }
                .fishing-hand {
                    position: absolute;
                    bottom: 18px;
                    left: -20px;
                    width: 45px;
                    height: 35px;
                    background-color: #c58c85;
                    border: 2px solid #a56d67;
                    border-radius: 12px 12px 18px 18px;
                    box-shadow: inset 0 -6px 0 rgba(0,0,0,0.1);
                    transform: rotate(-5deg);
                    z-index: 9;
                }
                .fishing-hand::after {
                    content: '';
                    position: absolute;
                    top: -10px;
                    left: 10px;
                    width: 18px;
                    height: 18px;
                    background-color: #c58c85;
                    border: 2px solid #a56d67;
                    border-radius: 50%;
                }
                .fishing-line {
                    position: absolute;
                    top: 0;
                    left: 0.5px;
                    width: 1px;
                    background: rgba(255, 255, 255, 0.5);
                    transform-origin: top center;
                    transition: height 0.5s ease;
                }
                .fishing-hook {
                    position: absolute;
                    bottom: -8px;
                    left: -3px;
                    width: 8px;
                    height: 8px;
                    border-bottom: 2px solid silver;
                    border-left: 2px solid silver;
                    border-radius: 0 0 0 8px;
                    transform: rotate(-45deg);
                }
                
                /* Line Only Container */
                .fishing-line-container {
                    position: absolute;
                    top: -20px;
                    left: 50%;
                    margin-left: -0.5px;
                    height: 340px;
                    transform-origin: top center;
                    transition: transform 0.5s ease-out;
                    z-index: 5;
                    pointer-events: none;
                }

                /* Shared Animations */
                .fishing-rod-container.is-fishing, .fishing-line-container.is-fishing { animation: rod-bobbing 4s infinite ease-in-out; }
                .fishing-rod-container.action-casting, .fishing-line-container.action-casting { animation: rod-cast 0.6s ease-out forwards; }
                .fishing-rod-container.action-reeling .fishing-rod, .fishing-line-container.action-reeling { animation: rod-shake 0.2s infinite; }
                .fishing-rod-container.action-reeling .reel-handle { animation: reel-spin 0.1s infinite linear; }
                .fishing-rod-container.action-escaped, .fishing-line-container.action-escaped { animation: rod-snap-back 0.4s ease-out forwards; }
                .fishing-rod-container.action-caught, .fishing-line-container.action-caught { animation: rod-pull-up 0.5s ease-in forwards; }


                /* Keyframes for Animations */
                @keyframes rod-cast {
                    0% { transform: rotate(45deg); }
                    50% { transform: rotate(-45deg); }
                    100% { transform: rotate(-10deg); }
                }
                @keyframes rod-bobbing {
                    0%, 100% { transform: rotate(-10deg); }
                    50% { transform: rotate(-15deg); }
                }
                .fishing-rod-container.action-reeling .fishing-rod { animation-name: rod-shake-full; }
                @keyframes rod-shake-full { /* For full rod */
                    0%, 100% { transform: translate(1px, -1px) rotate(-0.5deg); }
                    50% { transform: translate(-1px, 1px) rotate(0.5deg); }
                }
                @keyframes rod-shake { /* For line only and as fallback */
                     0%, 100% { transform: rotate(-10deg) translateX(1px); }
                     50% { transform: rotate(-12deg) translateX(-1px); }
                }
                @keyframes reel-spin {
                    from { transform: translateX(-50%) rotate(0deg); }
                    to { transform: translateX(-50%) rotate(360deg); }
                }
                @keyframes rod-snap-back {
                    from { transform: rotate(-25deg); }
                    to { transform: rotate(45deg); }
                }
                 @keyframes rod-pull-up {
                    from { transform: rotate(-25deg); }
                    to { transform: rotate(60deg); }
                }

                /* Rod Visual Styles */
                .rod-style-wood .fishing-rod { background: linear-gradient(to top, #4a2c12, #8d6e63); }
                .rod-style-plastic .fishing-rod { background: linear-gradient(to top, #c83a3a, #e57373); }
                .rod-style-wood-lucky .fishing-rod { background: linear-gradient(to top, #4a2c12, #8d6e63); box-shadow: 0 0 10px #fdd835; }
                .rod-style-bamboo .fishing-rod { background: repeating-linear-gradient(#adce74 0 40px, #8a9a5b 40px 50px); }
                .rod-style-metal .fishing-rod { background: linear-gradient(to top, #616161, #bdbdbd); }
                .rod-style-carbon .fishing-rod { background: linear-gradient(45deg, #222 25%, #333 25%, #333 50%, #222 50%, #222 75%, #333 75%, #333 100%); background-size: 10px 10px; }
                .rod-style-steampunk .fishing-rod { background: linear-gradient(to top, #8c5a2b, #cd955c); }
                .rod-style-chrome .fishing-rod { background: linear-gradient(to top, #d4d4d4, #ffffff, #d4d4d4); }
                @keyframes cosmic-glow { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                .rod-style-cosmic .fishing-rod { background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); background-size: 200% 200%; animation: cosmic-glow 5s ease infinite; }
                .rod-style-celestial .fishing-rod { background: linear-gradient(to top, #fff59d, #ffffff); box-shadow: 0 0 15px #fffde7; }
                @keyframes prism-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                .rod-style-prism .fishing-rod { background: linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet); background-size: 400% 400%; animation: prism-shift 8s linear infinite; }
                .rod-style-nolife .fishing-rod { background: linear-gradient(to top, #430000, #b71c1c); box-shadow: 0 0 10px #ff1744; }
                .rod-style-heavenly .fishing-rod { background: #ffffff; box-shadow: 0 0 20px 5px #ffffff; }
                .rod-style-depths .fishing-rod { background: linear-gradient(to top, #004d40, #00897b); }
                .rod-style-kraken .fishing-rod { background: linear-gradient(to top, #311b92, #5e35b1); }
                @keyframes zeus-crackle { 0%, 100% { box-shadow: 0 0 10px #ffeb3b, 0 0 5px #fff; } 50% { box-shadow: 0 0 20px #ffeb3b, 0 0 10px #fff; } }
                .rod-style-zeus .fishing-rod { background: linear-gradient(to top, #0277bd, #4fc3f7); animation: zeus-crackle 1.5s infinite; }
                .rod-style-poseidon .fishing-rod { background: linear-gradient(to top, #00695c, #4db6ac); }
                .rod-style-spooky .fishing-rod { background: linear-gradient(to top, #ff7043, #212121); box-shadow: 0 0 15px #ff7043; }
                .rod-style-abyssal .fishing-rod { background: #000; box-shadow: 0 0 15px #1a237e; }
                @keyframes inferno-flicker { 0%, 100% { box-shadow: 0 0 15px #f44336; } 50% { box-shadow: 0 0 25px #ff5722; } }
                .rod-style-infernal .fishing-rod { background: #212121; animation: inferno-flicker 1s infinite; }
                .rod-style-crystal .fishing-rod { background: linear-gradient(135deg, #e0f7fa, #ffffff, #b2ebf2); opacity: 0.8; }
                .rod-style-ancient .fishing-rod { background: #a1887f; }
                .rod-style-seraphic .fishing-rod { background: linear-gradient(to top, #fff, #f1e7fe); box-shadow: 0 0 20px #e1c4ff; }
            `}</style>
        </div>
    );
}

// --- UI SUB-COMPONENTS ---

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-inset p-3 rounded-lg text-center border border-white/10">
        <div className="text-sm text-stone-400">{label}</div>
        <div className="text-2xl font-bold text-[#e0b784]">{value}</div>
    </div>
);

interface ItemCardProps {
    item: InventoryItem;
    onClick: () => void;
    activeBait: Bait | null;
    activeBaitDurability?: number | null;
    isFavorite?: boolean;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick, activeBait, activeBaitDurability, isFavorite }) => {
    const rarityClass = item.rarity ? RARITY_COLORS[item.rarity] : '';
    const rarityBorderClass = item.rarity ? `rarity-border-${item.rarity}` : 'border-gray-600/50';
    const mutationClass = item.mutation ? MUTATION_STYLES[item.mutation] : 'bg-inset';
    const isActiveBait = activeBait?.id === item.id;
    const durabilityPercent = (isActiveBait && activeBait && activeBaitDurability) ? (activeBaitDurability / activeBait.effect.durability) * 100 : 0;

    return (
        <div onClick={onClick} className={`relative p-2 rounded-md text-center cursor-pointer transition-all hover:bg-white/10 hover:scale-105 ${mutationClass} border-2 ${isActiveBait ? 'border-green-400' : rarityBorderClass}`}>
            {isFavorite && <div title="Favorit" className="absolute top-1 left-1 text-yellow-300 text-sm">⭐</div>}
            {item.mutation && <div title={item.mutation} className="absolute top-1 right-1 w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center font-bold text-white shadow-lg">M</div>}
            <div className="text-2xl h-8 flex items-center justify-center">
                {item.icon && (item.icon.startsWith('http') || item.icon.startsWith('https')) ? (
                    <img src={item.icon} alt={item.name} className="max-h-full max-w-full object-contain" />
                ) : (
                    item.icon || (item.type === 'fish' ? '🐟' : '📦')
                )}
            </div>
            <div className="text-xs truncate">{item.name}</div>
            {item.weight && <div className="text-xs text-yellow-400">{item.weight.toFixed(2)}kg</div>}
            {item.rarity && <div className={`text-xs font-bold capitalize ${rarityClass}`}>{item.rarity}</div>}
            {item.count && item.count > 1 && <div className="absolute bottom-1 right-1 bg-black/50 text-xs rounded-full px-1.5">{item.count}</div>}
            {isActiveBait && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30">
                    <div className="h-full bg-green-500" style={{width: `${durabilityPercent}%`}}></div>
                </div>
            )}
        </div>
    );
};
