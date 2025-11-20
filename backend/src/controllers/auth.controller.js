// backend/src/controllers/auth.controller.js
const authService = require('../services/auth.service');

exports.register = async (req, res, next) => {
    try {
        const {full_name, email, password, phone} = req.body;

        const user = await authService.register({full_name, email, password, phone});

        // Sau khi đăng ký có thể auto login hoặc bắt user login lại
        // Ở đây cho đơn giản là yêu cầu login lại
        return res.status(201).json({
            success: true,
            message: 'Đăng ký thành công, vui lòng đăng nhập',
            data: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.loginSuccess = (req, res) => { // req.user có từ passport sau khi authenticate thành công
    const user = req.user;
    return res.json({
        success: true,
        message: 'Đăng nhập thành công',
        data: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        }
    });
};

exports.getMe = (req, res) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.status(401).json({success: false, message: 'Chưa đăng nhập'});
    }

    const user = req.user;
    return res.json({
        success: true,
        data: {
            id: user.id,
            full_name: user.full_name,
            email: user.email,
            role: user.role
        }
    });
};

exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) 
            return next(err);
        
        res.json({success: true, message: 'Đã đăng xuất'});
    });
};
