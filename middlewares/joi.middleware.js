const Joi = require("joi");



/**
 * This function crafts a function out of validation schema and prop.
 * 
 * @param {Joi.ObjectSchema} schema The schema that will be used to validate.
 * @param {"Body"|"Params"|"Query"|"Headers"} prop Determines which part of the req object is gonna be validated.
 * @returns A middleware function that uses the schema to validate.
 */
const checkJoi = (schema, prop = "Body") => (req, res, next) => {
    const { error } = schema.validate(req[prop]);
    if (error) return next(error);
    next();
}



module.exports = { checkJoi }