import bcrypt from 'bcryptjs'
import User from "../models/User.js";
import AuthUtils from "../utils/auth.js";

class UserService {

    async create(data) {
        return await User.create(data);
    }

    async login({ email, password }) {
        const user = await User.findOne({ where: { email, is_deleted: false } });

        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const token = await AuthUtils.signToken({ id: user.id, email });

        return { token, name: user.name };
    }  
}

export default new UserService();