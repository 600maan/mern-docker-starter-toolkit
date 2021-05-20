const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const logger = require('../middlewares/logging');

router.post('/upload', (req, res) => {
  const uploadFile = req.files.file;
  const { imageTitle } = req.body;
  const currentTimeStamp = Math.floor(Date.now() / 1000); // in seconds
  const ext = uploadFile.name.substr(uploadFile.name.lastIndexOf('.') + 1);
  const name = `${imageTitle}_${currentTimeStamp}.${ext}`;
  uploadFile.mv(`${__dirname}/../public/files/${name}`, (err) => {
    if (err) {
      return res.status(500).json({ success: false, err });
    }
    return res.status(200).json({ success: true, name });
  });
});

router.delete('/:image', async (req, res) => {
  try {
    const toBeDeletedFileName = req.params.image;
    const fromFilePath = path.resolve(
      `${__dirname}/../public/files/${toBeDeletedFileName}`,
    );
    const splitted = toBeDeletedFileName.split('.');
    const toFilePath = path.resolve(
      `${__dirname}/../public/deleted/${splitted[0]}_${Date.now()}.${
        splitted[1]
      }`,
    );
    if (fs.existsSync(fromFilePath)) {
      await fs.renameSync(fromFilePath, toFilePath);
      return res.status(200).json({ success: true, toFilePath });
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error(error);
    return res.status(404).json({ success: false });
  }
});

router.get('/image/:imagename', (req, res) => {
  const file = req.params.imagename;
  const directory = `${__dirname}/../public/files/`;
  let filePath = path.resolve(`${directory}${file}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    filePath = path.resolve(`${directory}notfound.jpg`);
    res.sendFile(filePath);
  }
});

router.get('/get-logo', (req, res) => {
  const logoFileName = '_logo.png';
  const directory = `${__dirname}/../assets`;

  let filePath = path.resolve(`${directory}/${logoFileName}`);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    const publicDirectory = `${__dirname}/../public/files/`;
    filePath = path.resolve(`${publicDirectory}notfound.jpg`);
    res.sendFile(filePath);
  }
});

module.exports = router;
