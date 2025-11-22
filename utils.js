// Anime Weapons Utility Functions
// Translated from Utils.lua

// Constants from CONSTANTS.lua and click.lua
const CONSTANTS = {
    FAST_CLICK_DEBOUNCE: 0.15,    // From CONSTANTS.lua - Fast manual click
    NORMAL_CLICK_DEBOUNCE: 0.2,   // From CONSTANTS.lua - Normal manual click
    AUTO_CLICK_DEBOUNCE: 0.03,    // From click.lua line 42 - Auto-click debounce
    STAR_LEVEL_CAP: 50,
};

// Number suffixes for formatting
const NUMBER_SUFFIXES = Object.freeze([
    "", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc",
    "Ud", "Dd", "Td", "Qad", "Qid", "Sxd", "Spd", "Ocd", "Nod", "Dec",
    "Und", "Duo", "Tri", "Qua", "Qui", "Six", "Sep", "Oct", "Nuo"
]);

// Rank system from Rankup.lua
const RANK = {
    MAX: 36,

    // Get mastery requirement for a rank
    getRequirement: function(rank) {
        if (rank === null || rank === undefined) return 0;
        return rank === 0 ? 30000 : 30000 * Math.pow(8.4, rank);
    },

    // Get buff for a rank
    getBuff: function(rank) {
        if (rank === null || rank === undefined) return 0;
        return rank === 0 ? 0 : 100 * Math.pow(2, rank - 1);
    }
};

// Utils functions from Utils.lua

/**
 * Format number to text with suffixes (K, M, B, T, etc.)
 * @param {number} num - The number to format
 * @param {number} precision - Decimal places (default: 2)
 * @returns {string} Formatted number string
 */
function toText(num, precision = 2) {
    if (typeof num !== 'number') return "0";
    if (num === 0) return "0";
    if (!isFinite(num)) return "∞";

    const absNum = Math.abs(num);
    const logValue = Math.log(absNum) / Math.log(1000);
    const tier = Math.floor(logValue);

    if (tier < 0) {
        return num.toFixed(precision);
    }

    const suffix = NUMBER_SUFFIXES[tier] || `e+${tier}`;
    const scaled = num / Math.pow(1000, tier);
    let formatted = scaled.toFixed(precision);

    // Remove trailing zeros
    if (precision > 0) {
        formatted = formatted.replace(/\.?0+$/, '');
    }

    return formatted + suffix;
}

/**
 * Calculate weapon mastery
 * @param {number} baseValue - Base value
 * @param {number} multiplier - Multiplier value
 * @returns {number} Calculated mastery
 */
function getWeaponMastery(baseValue, multiplier) {
    if (baseValue && multiplier !== null && multiplier !== undefined) {
        return baseValue * (multiplier + 1);
    }
    return 0;
}

/**
 * Calculate required exp for star level
 * @param {number} level - Star level
 * @param {number} rarityOrder - Rarity order
 * @returns {number} Required experience
 */
function starRequiredExp(level, rarityOrder) {
    if (level) {
        return Math.pow(level, 1.1) * (level + 1) * rarityOrder * 10;
    }
    return 0;
}

/**
 * Get star level from experience
 * @param {number} exp - Current experience
 * @param {number} rarityOrder - Rarity order
 * @returns {number} Star level
 */
function getStarLevel(exp, rarityOrder) {
    if (!exp) return 0;

    let totalExp = 0;
    let level = 0;

    while (totalExp <= exp && level < CONSTANTS.STAR_LEVEL_CAP) {
        level++;
        totalExp = starRequiredExp(level, rarityOrder);
    }

    return level;
}

/**
 * Format seconds to readable time string
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTimer(seconds) {
    if (seconds < 60) {
        return `${seconds.toFixed(1)}s`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        if (secs === 0) {
            return `${minutes}m`;
        } else {
            return `${minutes}m ${Math.floor(secs)}s`;
        }
    } else {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (minutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${minutes}m`;
        }
    }
}

/**
 * Format counter as HH:MM or HH:MM:SS
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted counter string
 */
function formatCounter(seconds) {
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (seconds < 3600) {
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    const hours = Math.floor(seconds / 3600);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Get clicks per second based on click type
 * @param {string} type - Click type ('auto', 'fast', 'normal', or 'custom')
 * @param {number} customValue - Custom clicks per second (if type is 'custom')
 * @returns {number} Clicks per second
 *
 * Click speeds based on game code:
 * - Auto: 33.33 clicks/sec (0.03s debounce from click.lua:42)
 * - Fast: 6.67 clicks/sec (0.15s debounce from CONSTANTS.lua)
 * - Normal: 5 clicks/sec (0.2s debounce from CONSTANTS.lua)
 *
 * Note: These are theoretical maximum speeds. Actual in-game performance
 * may vary due to network latency and server processing.
 */
function getClicksPerSecond(type, customValue = 1) {
    switch (type) {
        case 'auto':
            return 1 / CONSTANTS.AUTO_CLICK_DEBOUNCE; // ~33.33 clicks/sec
        case 'fast':
            return 1 / CONSTANTS.FAST_CLICK_DEBOUNCE; // ~6.67 clicks/sec
        case 'normal':
            return 1 / CONSTANTS.NORMAL_CLICK_DEBOUNCE; // 5 clicks/sec
        case 'custom':
            return customValue;
        default:
            return 5; // Default to normal
    }
}

/**
 * Calculate time to farm mastery
 * @param {number} currentMastery - Current mastery amount
 * @param {number} targetMastery - Target mastery amount
 * @param {number} masteryPerClick - Mastery gained per click
 * @param {number} clicksPerSecond - Clicks per second
 * @returns {object} Result object with time and statistics
 */
function calculateFarmingTime(currentMastery, targetMastery, masteryPerClick, clicksPerSecond) {
    const masteryNeeded = targetMastery - currentMastery;

    if (masteryNeeded <= 0) {
        return {
            masteryNeeded: 0,
            clicksNeeded: 0,
            timeSeconds: 0,
            timeFormatted: "Already achieved!"
        };
    }

    const clicksNeeded = Math.ceil(masteryNeeded / masteryPerClick);
    const timeSeconds = clicksNeeded / clicksPerSecond;

    return {
        masteryNeeded,
        clicksNeeded,
        timeSeconds,
        timeFormatted: formatTimer(timeSeconds),
        masteryPerSecond: masteryPerClick * clicksPerSecond
    };
}

/**
 * Get rank information based on current mastery
 * @param {number} mastery - Current total mastery
 * @returns {object} Rank information
 */
function getRankInfo(mastery) {
    let currentRank = 0;

    // Find current rank
    for (let rank = 0; rank <= RANK.MAX; rank++) {
        const requirement = RANK.getRequirement(rank);
        if (mastery >= requirement) {
            currentRank = rank;
        } else {
            break;
        }
    }

    const nextRank = currentRank < RANK.MAX ? currentRank + 1 : null;
    const currentBuff = RANK.getBuff(currentRank);
    const nextBuff = nextRank !== null ? RANK.getBuff(nextRank) : null;
    const nextRequirement = nextRank !== null ? RANK.getRequirement(nextRank) : null;
    const masteryToNext = nextRequirement !== null ? nextRequirement - mastery : 0;

    return {
        currentRank,
        currentBuff,
        nextRank,
        nextBuff,
        nextRequirement,
        masteryToNext,
        currentMastery: mastery
    };
}

/**
 * Get all ranks with their requirements and buffs
 * @param {number} currentMastery - Current player mastery
 * @returns {array} Array of rank objects
 */
function getAllRanks(currentMastery = 0) {
    const ranks = [];

    for (let rank = 0; rank <= RANK.MAX; rank++) {
        const requirement = RANK.getRequirement(rank);
        const buff = RANK.getBuff(rank);
        const isUnlocked = currentMastery >= requirement;
        const isCurrent = isUnlocked && (rank === RANK.MAX || currentMastery < RANK.getRequirement(rank + 1));

        ranks.push({
            rank,
            requirement,
            buff,
            isUnlocked,
            isCurrent
        });
    }

    return ranks;
}
