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
    async create(data) {
        try {
            await User.create(data);
            return true;
        } catch (err) {
            throw err;
        }
    }
}

export default new UsersService();