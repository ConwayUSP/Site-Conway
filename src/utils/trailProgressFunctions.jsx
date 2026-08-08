export function initializeProgressTracker() {
    localStorage.setItem('opengl', JSON.stringify(Array(11).fill(false)));
    localStorage.setItem('github', JSON.stringify(Array(13).fill(false)));
    localStorage.setItem('craylib', JSON.stringify(Array(6).fill(false)));
    localStorage.setItem('cpp', JSON.stringify(Array(29).fill(false)));
    localStorage.setItem('lualove', JSON.stringify(Array(5).fill(false)));
    localStorage.setItem('jogos2d', JSON.stringify(Array(8).fill(false)));
    localStorage.setItem('jogos3d', JSON.stringify(Array(4).fill(false)));
    localStorage.setItem('rustgodot', JSON.stringify(Array(21).fill(false)));
    localStorage.setItem('phaser', JSON.stringify(Array(8).fill(false)));
}

export function getPercentage(trailId) {
    var trailProgress = JSON.parse(localStorage.getItem(trailId));
    var totalChapters = trailProgress.length;
    var completedChapters = trailProgress.filter(Boolean).length;
    return ((completedChapters / totalChapters) * 100).toFixed(2);
}

export function markAsRead(trailId, chapter) {
    var trailProgress = JSON.parse(localStorage.getItem(trailId));
    trailProgress[chapter] = true;
    localStorage.setItem(trailId, JSON.stringify(trailProgress));
}

export function isChapterRead(trailId, chapter) {
    var trailProgress = JSON.parse(localStorage.getItem(trailId));
    return trailProgress[chapter];
}