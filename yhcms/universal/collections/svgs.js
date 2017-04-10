import { FilesCollection } from 'meteor/ostrio:files';
import DBsvg from './DBsvg'
import Projects from './projects'
import path from 'path';
import { exec } from 'child_process';
import fs from 'fs';
import config from '../../config.json';
// import svg2css from '../../../../svg2css';

const projPath = config.uplaodPath;

const Svgs = new FilesCollection({
  collectionName: 'Svgs',
  allowClientCode: true,
  debug: true,
  storagePath: path.join(projPath, 'uploads/svgs'),
  onBeforeUpload: (file) => {
    if(file.size <= 10485760 && /svg/i.test(file.extension)) {
      return true;
    }else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  },
  onInitiateUpload: (file) => {
    DBsvg.insert({ fileId: file._id, projId: file.meta.projId, percent: 60, uploading: true, ext: file.ext, extension: file.extension, extensionWithDot: file.extensionWithDot,
      meta: file.meta, mime: file.mime, 'mime-type': file['mime-type'], name: file.name, size: file.size, type: file.type });
  },
  onAfterUpload(file) {
    if (Meteor.isServer) {
      const src = fs.readFileSync(file.path, 'utf8');
      const projSvgPath = path.join(projPath, `uploads/svgs/${file.meta.proj}`);
      if (!fs.existsSync(projSvgPath)) {
        fs.mkdirSync(projSvgPath);
      }
      exec(`mv ${file.path} ${projSvgPath}/${file.name}`, function(err) {
        if (err) {
          console.log(err);
          DBsvg.remove({ fileId: file._id });
        }
      });
      setTimeout(Meteor.bindEnvironment(() => {
        DBsvg.update({ fileId: file._id }, { $set: { percent: 100 } });
      }), 1000);
      setTimeout(Meteor.bindEnvironment(() => {
        DBsvg.update({ fileId: file._id }, { $set: { uploading: false, src: src } });
        Svgs.remove({});
      }), 1500);
    }
  }
});



export default Svgs;
