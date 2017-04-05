import { FilesCollection } from 'meteor/ostrio:files';
import path from 'path';
// import svg2css from '../../../../svg2css';

const projPath = path.resolve('../../../../../../');

const Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: true,
  storagePath: path.join(projPath, 'uploads/pngs'),
  onBeforeUpload: (file) => {
    if(file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  },
  onAfterUpload(file) {
    if (Meteor.isServer) {
      import { upload2qiniu } from '../../server/utils/upload2qiniu';
      upload2qiniu(file, Meteor.bindEnvironment(
        () => {
          Images.update({'_id': file._id}, { downloadRoute: 'http://onmck4leq.bkt.clouddn.com/' + file.name });
        }
      ));
    }
  }
});



export default Images;
