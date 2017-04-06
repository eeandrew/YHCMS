import { FilesCollection } from 'meteor/ostrio:files';
import path from 'path';
import fs from 'fs';
// import svg2css from '../../../../svg2css';

const projPath = path.resolve('../../../../../../');

const Svgs = new FilesCollection({
  collectionName: 'Svgs',
  allowClientCode: true,
  storagePath: path.join(projPath, 'uploads/svgs'),
  onBeforeUpload: (file) => {
    console.log(file._id);
    if(file.size <= 10485760 && /svg/i.test(file.extension)) {
      return true;
    }else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  },
  onAfterUpload(file) {
    if (Meteor.isServer) {
      const src = fs.readFileSync(file.path, 'utf8');
      Svgs.update({'_id': file._id}, { downloadRoute: src });
    }
  }
});



export default Svgs;
