// query, params, body

export default class Validator {
    static validate(schema) {
        return (req, res, next) => {
            try {
                const keysResult = {};

                Object.keys(schema).forEach(key => {
                    const result = schema[key].validateSync(req[key]);

                    keysResult[key] = result;
                });

                Object.keys(keysResult).forEach(key => {
                    const reqKey = key === 'body' ? 'data' : 'filter';

                    req[reqKey] = keysResult[key];
                });

                next();
            } catch (err) {
                res.status(400).json({ errors: err.errors });
            }
        }
    }
}
