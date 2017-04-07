import { FilesCollection } from 'meteor/ostrio:files';
import path from 'path';
import config from '../../config.json';
import fs from 'fs';
import { exec } from 'child_process';
import DBimage from './DBimage';

const projPath = config.uplaodPath;

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
  onInitiateUpload: (file) => {
    DBimage.insert({ fileId: file._id, projId: file.meta.projId, percent: 60, uploading: true, ext: file.ext, extension: file.extension, extensionWithDot: file.extensionWithDot,
      meta: file.meta, mime: file.mime, 'mime-type': file['mime-type'], name: file.name, size: file.size, type: file.type });
  },
  onAfterUpload(file) {
    if (Meteor.isServer) {
      // Images.remove({});
      import { upload2qiniu } from '../../server/utils/upload2qiniu';
      upload2qiniu(file, Meteor.bindEnvironment(
        () => {
          DBimage.update({ fileId: file._id }, { $set: { percent: 100 } });
          const projPngPath = path.join(projPath, `uploads/pngs/${file.meta.proj}`);
          if (!fs.existsSync(projPngPath)) {
            fs.mkdirSync(projPngPath);
          }
          exec(`mv ${file.path} ${projPngPath}/${file.name}`);
          setTimeout(Meteor.bindEnvironment(
            () => {
              DBimage.update({ fileId: file._id }, { $set: { src: 'http://onmck4leq.bkt.clouddn.com/' + file.name, uploading: false } });
            }
          ), 1000);
        }
      ));
    }
  }
});



export default Images;
