import bcrypt from 'bcryptjs';

export const hashPassword = (pass) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pass, salt);
};

export const paswordVerify = async (pass, hash) => {
    return bcrypt.compareSync(pass, hash);
}