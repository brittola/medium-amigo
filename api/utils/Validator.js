export default class Validator {
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