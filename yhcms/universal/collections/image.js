import { FilesCollection } from 'meteor/ostrio:files';
import fs from 'fs';
import path from 'path';
// import svg2css from '../../../../svg2css';

const projPath = path.resolve('../../../../../');

const Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: true,
  storagePath: path.join(projPath, 'uploads'),
  fileBase64: '',
  onBeforeUpload: (file) => {
    if(file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  },
  onAfterUpload(file) {
    if (Meteor.isServer) {
      const fileString = fs.readFileSync(file.path);
      const base64 = new Buffer(fileString, 'binary').toString('base64');
      Images.update({'_id': file._id}, { downloadRoute: `data:image/png;base64, ${base64}` });
    }
  }
});



export default Images;
