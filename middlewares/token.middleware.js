const { AppError } = require("../utils/app-error.util")
const { verifyToken } = require("../services/token.service");



/** 
 * Requires accessToken in Authorization headers. 
 * Adds: req.accessToken, req.accessTokenDoc, req.accessTokenPayload
 */
const checkAccessToken = async (req, res, next) => {
    try {
        // get accessToken
        const accessToken = req.headers['authorization']?.split(' ')[1]
        if (!accessToken) return next(new AppError(401, 'No access token provided'));

        // verify token
        const { payload, tokenDoc } = await verifyToken(accessToken, "Access", false);
        
        // save token on req
        req.accessToken = accessToken
        req.accessTokenDoc = tokenDoc
        req.accessTokenPayload = payload
        next()
    } catch (error) {
        // pass to error-middleware
        next(error)
    }
}

/** 
 * Requires refreshToken in request body. 
 * Adds: req.refreshToken, req.refreshTokenDoc, req.refreshTokenPayload
 */
const checkRefreshToken = async (req, res, next) => {
    try {
        // get refreshToken
        const refreshToken = req?.body.refreshToken
        if (!refreshToken) return next(new AppError(400, "No refresh token provided."))
        
        // verify refresh token
        const { payload, tokenDoc } = await verifyToken(refreshToken, "Refresh", false);

        // save token on req
        req.refreshToken = refreshToken
        req.refreshTokenDoc = tokenDoc
        req.refreshTokenPayload = payload
        next()
    } catch (error) {
		// pass to error-middleware
		next(error)
	}
}

/**
 * Requires x-api-key in headers
 * Adds: req.apiToken, req.apiTokenDoc, req.apiTokenPayload
 */
const checkApiKey = async (req, res, next) => {
    try {
        // get apiToken
        const apiToken = req.headers['x-api-key']
        if (!apiToken) return next(new AppError(403, "No api token provided."))
        
        // verify api token
        const { payload, tokenDoc } = await verifyToken(apiToken, "Api", false);

        // save token on req
        req.apiToken = apiToken
        req.apiTokenDoc = tokenDoc
        req.apiTokenPayload = payload
        next()
    } catch (error) {
		// pass to error-middleware
		next(error)
	}
}



module.exports = {
    checkAccessToken,
    checkRefreshToken,
    checkApiKey,
}