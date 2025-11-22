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
    // Get input values with suffix multipliers
    const currentMasteryBase = parseFloat(document.getElementById('currentMastery').value) || 0;
    const currentMasterySuffix = parseFloat(document.getElementById('currentMasterySuffix').value) || 1;
    const currentMastery = currentMasteryBase * currentMasterySuffix;

    const targetMasteryBase = parseFloat(document.getElementById('targetMastery').value) || 0;
    const targetMasterySuffix = parseFloat(document.getElementById('targetMasterySuffix').value) || 1;
    const targetMastery = targetMasteryBase * targetMasterySuffix;

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
            <span class="result-label">Click Speed:</span>
            <span class="result-value">${clicksPerSecond.toFixed(2)} clicks/sec</span>
        </div>
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
    const currentRankInput = document.getElementById('currentRank').value;
    const playerMasteryBase = parseFloat(document.getElementById('playerMastery').value) || 0;
    const playerMasterySuffix = parseFloat(document.getElementById('playerMasterySuffix').value) || 1;
    const playerMastery = playerMasteryBase * playerMasterySuffix;

    // Validate inputs
    if (playerMastery < 0) {
        showResult('rankResult', '<p style="color: var(--error);">Mastery cannot be negative.</p>');
        return;
    }

    // Get rank information - use manual input if provided, otherwise auto-detect
    let rankInfo;
    if (currentRankInput !== '' && currentRankInput !== null) {
        const manualRank = parseInt(currentRankInput);
        if (manualRank < 0 || manualRank > RANK.MAX) {
            showResult('rankResult', `<p style="color: var(--error);">Rank must be between 0 and ${RANK.MAX}.</p>`);
            return;
        }
        // Create custom rank info based on manual input
        const currentBuff = RANK.getBuff(manualRank);
        const nextRank = manualRank < RANK.MAX ? manualRank + 1 : null;
        const nextBuff = nextRank !== null ? RANK.getBuff(nextRank) : null;
        const nextRequirement = nextRank !== null ? RANK.getRequirement(nextRank) : null;
        const masteryToNext = nextRequirement !== null ? Math.max(0, nextRequirement - playerMastery) : 0;

        rankInfo = {
            currentRank: manualRank,
            currentBuff,
            nextRank,
            nextBuff,
            nextRequirement,
            masteryToNext,
            currentMastery: playerMastery
        };
    } else {
        // Auto-detect rank from mastery
        rankInfo = getRankInfo(playerMastery);
    }

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
