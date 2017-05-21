const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'app-server/public/userpics');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.replace(/^(.*?)((?:\.\w+)+)$/, `$1-${Date.now()}$2`));
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg'];

    if (allowed.indexOf(file.mimetype) === -1)
        return cb(null, false);
    cb(null, true);
};

module.exports = multer({
    storage: storage,
    limits: 5242880,
    fileFilter: fileFilter
});
