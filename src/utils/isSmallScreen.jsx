function isSmallScreen(actualWidth = typeof window !== 'undefined' ? window.innerWidth : 1024) {
    return actualWidth < 1024
}

export default isSmallScreen
