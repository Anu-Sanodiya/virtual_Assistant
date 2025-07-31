const multer = require('multer')
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, './public');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,uploadPath)

    },
    filename:(req,file,cb)=>{
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
})
const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

module.exports = upload;