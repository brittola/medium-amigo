class Validator {
    hasEmptyField(...fields) {
        if (fields.includes(undefined)) return true;
        if (fields.includes("")) return true;
        return false;
    }
}

module.exports = new Validator();