import multer from "multer";

const storage = multer.diskStorage({ destination: 'uploads/',

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`)
  }
    
 });
export const upload = multer({ storage: storage });