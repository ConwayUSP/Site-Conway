import trilhasConfig from '@data/trilhasConfig.json';

const KEY = 'trailProgress';

export function initializeProgressTracker() {
    const obj = {};
    for (const trailId in trilhasConfig) {
        obj[trailId] = {};
    }
    localStorage.setItem(KEY, JSON.stringify(obj));
}

function parseTrailProgress() {
    const parse = JSON.parse(localStorage.getItem(KEY));

    if (parse)
        return parse;

    initializeProgressTracker();
    return parseTrailProgress();
}

export function getPercentage(trailId) {
    const trailProgress = parseTrailProgress();
    const totalChapters = trilhasConfig[trailId].chapters.length;
    const completedChapters = Object.values(trailProgress[trailId]).filter(Boolean).length;
    return ((completedChapters / totalChapters) * 100).toFixed(2);
}

export function markAsRead(trailId, chapter) {
    const trailProgress = parseTrailProgress();
    trailProgress[trailId][chapter] = true;
    localStorage.setItem(KEY, JSON.stringify(trailProgress));
}

export function markAllAsRead(trailId) {
    const trailProgress = parseTrailProgress();
    const totalChapters = trilhasConfig[trailId].chapters.length;
    for (var i = 0; i < totalChapters; i++) {
        trailProgress[trailId][i] = true;
    }
    localStorage.setItem(KEY, JSON.stringify(trailProgress));
}

export function isChapterRead(trailId, chapter) {
    const trailProgress = parseTrailProgress();
    return trailProgress[trailId][chapter];
}