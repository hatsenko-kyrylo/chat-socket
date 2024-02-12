import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secretHash = process.env.SECRET_HASH;

export default (req, res, next) => {
    // Delete 'Bearer'
    const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

    if (token) {
        try {
            // Token decryption
            const decoded = jwt.verify(token, secretHash);

            // Add to request
            req.userId = decoded._id;

            next();
        } catch (e) {
            return res.status(403).json({
                message: 'No access',
            });
        }
    } else {
        return res.status(403).json({
            message: 'No access',
        });
    }
};
