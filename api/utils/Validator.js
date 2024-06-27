export default class Validator {
    static hasEmptyField(...fields) {
        if (fields.includes(undefined)) return true;
        if (fields.includes("")) return true;
        return false;
    }

    static removeEmptyFields(data) {
        const updatedFields = {};

        for (const key in data) {
            if (data[key] !== null && data[key] !== undefined && data[key] !== '') {
                updatedFields[key] = data[key];
            }
        }

        return updatedFields;
    }
}