// Anime Weapons Calculator Implementation

// Show/hide custom click rate input
document.getElementById('clickSpeed').addEventListener('change', function() {
    const customGroup = document.getElementById('customClickGroup');
    if (this.value === 'custom') {
        customGroup.style.display = 'block';
    } else {
        customGroup.style.display = 'none';
    }
});

/**
 * Calculate mastery farming time
 */
function calculateMasteryTime() {
    // Get input values
    const currentMastery = parseFloat(document.getElementById('currentMastery').value) || 0;
    const targetMastery = parseFloat(document.getElementById('targetMastery').value) || 0;
    const masteryPerClick = parseFloat(document.getElementById('masteryPerClick').value) || 1;
    const clickSpeed = document.getElementById('clickSpeed').value;
    const customClickRate = parseFloat(document.getElementById('customClickRate').value) || 10;

    // Validate inputs
    if (targetMastery <= 0) {
        showResult('masteryResult', '<p style="color: var(--error);">Please enter a valid target mastery.</p>');
        return;
    }

    if (masteryPerClick <= 0) {
        showResult('masteryResult', '<p style="color: var(--error);">Mastery per click must be greater than 0.</p>');
        return;
    }

    if (currentMastery >= targetMastery) {
        showResult('masteryResult', '<p style="color: var(--success);">You have already reached your target mastery!</p>');
        return;
    }

    // Calculate clicks per second
    const clicksPerSecond = getClicksPerSecond(clickSpeed, customClickRate);

    // Calculate farming time
    const result = calculateFarmingTime(currentMastery, targetMastery, masteryPerClick, clicksPerSecond);

    // Display results
    const html = `
        <h3>Farming Time Results</h3>
        <div class="result-item">
            <span class="result-label">Mastery Needed:</span>
            <span class="result-value">${toText(result.masteryNeeded)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Clicks Needed:</span>
            <span class="result-value">${toText(result.clicksNeeded)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Mastery Per Second:</span>
            <span class="result-value">${toText(result.masteryPerSecond)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Estimated Time:</span>
            <span class="result-value highlight">${result.timeFormatted}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Time (Counter Format):</span>
            <span class="result-value">${formatCounter(result.timeSeconds)}</span>
        </div>
    `;

    showResult('masteryResult', html);
}

/**
 * Calculate rank progression
 */
function calculateRank() {
    const currentRank = parseInt(document.getElementById('currentRank').value) || 0;
    const playerMastery = parseFloat(document.getElementById('playerMastery').value) || 0;

    // Validate inputs
    if (currentRank < 0 || currentRank > RANK.MAX) {
        showResult('rankResult', `<p style="color: var(--error);">Rank must be between 0 and ${RANK.MAX}.</p>`);
        return;
    }

    // Get rank information
    const rankInfo = getRankInfo(playerMastery);
    const allRanks = getAllRanks(playerMastery);

    // Build rank list HTML
    let rankListHTML = '<div class="rank-list">';

    // Show current rank info at the top
    const currentRankHTML = `
        <h3>Your Current Status</h3>
        <div class="result-item">
            <span class="result-label">Current Rank:</span>
            <span class="result-value highlight">Rank ${rankInfo.currentRank}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Current Buff:</span>
            <span class="result-value">${toText(rankInfo.currentBuff)}%</span>
        </div>
        <div class="result-item">
            <span class="result-label">Total Mastery:</span>
            <span class="result-value">${toText(rankInfo.currentMastery)}</span>
        </div>
    `;

    // Show next rank info if not max rank
    let nextRankHTML = '';
    if (rankInfo.nextRank !== null) {
        nextRankHTML = `
            <h3 style="margin-top: 20px;">Next Rank</h3>
            <div class="result-item">
                <span class="result-label">Next Rank:</span>
                <span class="result-value">Rank ${rankInfo.nextRank}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Next Buff:</span>
                <span class="result-value">${toText(rankInfo.nextBuff)}%</span>
            </div>
            <div class="result-item">
                <span class="result-label">Mastery Required:</span>
                <span class="result-value">${toText(rankInfo.nextRequirement)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Mastery Needed:</span>
                <span class="result-value warning">${toText(rankInfo.masteryToNext)}</span>
            </div>
        `;
    } else {
        nextRankHTML = `
            <h3 style="margin-top: 20px;">Next Rank</h3>
            <p style="color: var(--success); text-align: center; padding: 20px;">
                Congratulations! You've reached the maximum rank!
            </p>
        `;
    }

    // Show all ranks table
    allRanks.forEach(rank => {
        const className = rank.isCurrent ? 'rank-item current' : (rank.isUnlocked ? 'rank-item' : 'rank-item locked');
        const statusIcon = rank.isCurrent ? '⭐' : (rank.isUnlocked ? '✓' : '🔒');

        rankListHTML += `
            <div class="${className}">
                <span class="rank-number">${statusIcon} Rank ${rank.rank}</span>
                <span class="rank-requirement">${toText(rank.requirement)} Mastery</span>
                <span class="rank-buff">+${toText(rank.buff)}%</span>
            </div>
        `;
    });

    rankListHTML += '</div>';

    const html = currentRankHTML + nextRankHTML + '<h3 style="margin-top: 30px;">All Ranks</h3>' + rankListHTML;

    showResult('rankResult', html);
}

/**
 * Calculate star level from experience
 */
function calculateStarLevel() {
    const starExp = parseFloat(document.getElementById('starExp').value) || 0;
    const rarityOrder = parseInt(document.getElementById('rarityOrder').value) || 1;

    // Validate inputs
    if (starExp < 0) {
        showResult('starResult', '<p style="color: var(--error);">Star experience cannot be negative.</p>');
        return;
    }

    if (rarityOrder < 1 || rarityOrder > 10) {
        showResult('starResult', '<p style="color: var(--error);">Rarity order must be between 1 and 10.</p>');
        return;
    }

    // Calculate star level
    const level = getStarLevel(starExp, rarityOrder);
    const currentLevelExp = starRequiredExp(level, rarityOrder);
    const nextLevelExp = level < CONSTANTS.STAR_LEVEL_CAP ? starRequiredExp(level + 1, rarityOrder) : null;
    const expToNext = nextLevelExp ? nextLevelExp - starExp : 0;

    // Display results
    let html = `
        <h3>Star Level Results</h3>
        <div class="result-item">
            <span class="result-label">Current Level:</span>
            <span class="result-value highlight">${level}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Current Experience:</span>
            <span class="result-value">${toText(starExp)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Experience for Current Level:</span>
            <span class="result-value">${toText(currentLevelExp)}</span>
        </div>
    `;

    if (level < CONSTANTS.STAR_LEVEL_CAP) {
        html += `
            <div class="result-item">
                <span class="result-label">Experience for Next Level:</span>
                <span class="result-value">${toText(nextLevelExp)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Experience Needed:</span>
                <span class="result-value warning">${toText(expToNext)}</span>
            </div>
        `;
    } else {
        html += `
            <p style="color: var(--success); text-align: center; padding: 10px; margin-top: 10px;">
                Maximum star level reached!
            </p>
        `;
    }

    showResult('starResult', html);
}

/**
 * Calculate weapon mastery
 */
function calculateWeaponMastery() {
    const baseValue = parseFloat(document.getElementById('baseValue').value) || 0;
    const multiplier = parseFloat(document.getElementById('multiplier').value) || 0;

    // Validate inputs
    if (baseValue < 0 || multiplier < 0) {
        showResult('weaponResult', '<p style="color: var(--error);">Values cannot be negative.</p>');
        return;
    }

    // Calculate weapon mastery
    const mastery = getWeaponMastery(baseValue, multiplier);

    // Display results
    const html = `
        <h3>Weapon Mastery Results</h3>
        <div class="result-item">
            <span class="result-label">Base Value:</span>
            <span class="result-value">${toText(baseValue)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Multiplier:</span>
            <span class="result-value">${toText(multiplier)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Total Mastery:</span>
            <span class="result-value highlight">${toText(mastery)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Formula:</span>
            <span class="result-value" style="font-size: 0.9rem;">Base × (Multiplier + 1)</span>
        </div>
    `;

    showResult('weaponResult', html);
}

/**
 * Show result in a result container
 * @param {string} elementId - ID of the result element
 * @param {string} html - HTML content to display
 */
function showResult(elementId, html) {
    const resultElement = document.getElementById(elementId);
    resultElement.innerHTML = html;
    resultElement.classList.add('show');
}

// Add Enter key support for all inputs
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const card = this.closest('.calculator-card');
            const button = card.querySelector('.btn-primary');
            if (button) {
                button.click();
            }
        }
    });
});
