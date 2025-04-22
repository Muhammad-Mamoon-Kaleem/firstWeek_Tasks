import bcrypt  from 'bcrypt'

const encryptPassword = async (plainPassword) => {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(plainPassword, salt);
    return hashed;
};

export default encryptPassword
