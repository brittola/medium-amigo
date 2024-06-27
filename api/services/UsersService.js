import User from "../models/User.js";

class UsersService {
    async findOne(email) {
        try {
            const user = await User.findOne({ where: { email, is_deleted: false } });
            return user;
        } catch (err) {
            throw err;
        }
    }
    async create(name, email, password) {
        try {
            await User.create({ name, email, password });
            return true;
        } catch (err) {
            throw err;
        }
    }
}

export default new UsersService();