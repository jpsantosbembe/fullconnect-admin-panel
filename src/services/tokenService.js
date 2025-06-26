const TOKEN_KEYS = {
    ACCESS: 'accessToken',
    REFRESH: 'refreshToken',
};

export const setTokens = (tokens) => {
    if (tokens.accessToken) {
        localStorage.setItem(TOKEN_KEYS.ACCESS, tokens.accessToken);
    }
    if (tokens.refreshToken) {
        localStorage.setItem(TOKEN_KEYS.REFRESH, tokens.refreshToken);
    }
};

export const getAccessToken = () => {
    return localStorage.getItem(TOKEN_KEYS.ACCESS);
};

export const getRefreshToken = () => {
    return localStorage.getItem(TOKEN_KEYS.REFRESH);
};

export const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEYS.ACCESS);
    localStorage.removeItem(TOKEN_KEYS.REFRESH);
};

const tokenService = {
    setTokens,
    getAccessToken,
    getRefreshToken,
    clearTokens,
};

export default tokenService;