export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | "mythic" | "secret" | "mysterious" | "anonymous" | "dev" | "executors";

export type Mutation = "corrupt" | "galaxy" | "gemstone" | "ghost" | "lightning" | "fairy-dust" | "midnight" | "radioactive" | "stone" | "festive" | "frozen";

export interface FishType {
    id: string;
    name: string;
    rarity: Rarity;
    baseValue: number;
    color: string;
    xp: number;
    icon: string;
}

export type EnchantmentType = 'regular' | 'exalted' | 'cosmic';

export interface Enchantment {
    id:string;
    name: string;
    type: EnchantmentType;
    description: string;
    tips: string;
    // Explicit stat bonuses for calculations
    luck?: number;
    speed?: number;
    endurance?: number;
    xpBoost?: number;
    progressSpeed?: number;
    resilience?: number;
    mutationChance?: number;
    sizeIncrease?: number;
    control?: number;
    maxKg?: number;
}

export interface InventoryItem {
    id: string;
    name: string;
    type: 'fish' | 'bait' | 'potion' | 'material';
    count?: number;
    // Fish specific
    weight?: number;
    rarity?: Rarity;
    mutation?: Mutation | null;
    icon?: string;
    baseValue?: number;
    xp?: number;
    // Bait specific
    effect?: BaitEffect;
    pros?: string;
    cons?: string;
    // Potion specific
    duration?: number;
    potency?: number;
}

export interface BaitEffect {
    attraction: number;
    rareChance: number;
    biteSpeed: number;
    durability: number;
}

export interface Bait {
    id: string;
    name: string;
    type: 'bait';
    basePrice: number;
    currentPrice: number;
    priceIncrease: number;
    icon: string;
    effect: BaitEffect;
    pros: string;
    cons: string;
}

export interface Potion {
    id: string;
    name: string;
    type: 'potion';
    basePrice: number;
    currentPrice: number;
    priceIncrease: number;
    // FIX: Renamed from 'effect' to avoid type conflict with Bait.effect
    potency: number;
    duration: number;
}

export interface FishingRod {
    id: string;
    name: string;
    price: number;
    luck: number;
    weight: number;
    speed: number;
    endurance: number;
    description?: string;
    unlockDescription?: string;
    owned: boolean;
    equipped: boolean;
    enchantment?: Enchantment | null;
    cosmicEnchantment?: Enchantment | null;
    visual?: string;
}

export interface PlayerSkill {
    level: number;
    name: string;
    effect: number;
    icon: string;
}

export interface PlayerState {
    level: number;
    xp: number;
    skillPoints: number;
    baseLuck?: number;
    skills: {
        strength: PlayerSkill;
        luck: PlayerSkill;
        endurance: PlayerSkill;
        knowledge: PlayerSkill;
    };
}

export interface User {
    username: string;
    password: string;
    avatar: string;
}

export enum Tab {
    Info = 'info',
    Inventory = 'inventory',
    Shop = 'shop',
    Map = 'map',
    Skills = 'skills',
    Rods = 'rods',
}

export type Weather = 'sunny' | 'rainy' | 'stormy';

export interface GameEvent {
    id: string;
    name: string;
    description: string;
    duration: number; // in seconds
    appliesTo: 'day' | 'night' | 'all';
    effects: {
        luck?: number; // percentage bonus
        value?: number; // percentage bonus
        spawnRate?: { [key in Rarity]?: number }; // multiplier
    };
}