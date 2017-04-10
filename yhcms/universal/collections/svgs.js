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
  storagePath: path.join(projPath, 'uploads/svg'),
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
      console.log('prepare remove and update');
      const src = fs.readFileSync(file.path, 'utf8');
      const projSvgPath = path.join(projPath, `uploads/svg/${file.meta.proj}`);
      console.log('start remove and update');
      fs.rename(file.path, `${projSvgPath}/${file.name}`, Meteor.bindEnvironment(function (err) {
        if (err) {
          DBsvg.remove({ fileId: file._id });
          // Svgs.remove({ _id: file._id });
          throw err;
        }
        fs.stat(`${projSvgPath}/${file.name}`, Meteor.bindEnvironment(function (err, stats) {
          if (err) {
            DBsvg.remove({ fileId: file._id });
            // Svgs.remove({ _id: file._id });
            throw err;
          }
          console.log('stats: ' + JSON.stringify(stats));
          Meteor.setTimeout(() => {
            DBsvg.update({ fileId: file._id }, { $set: { percent: 100 } });
          }, 1000);
          Meteor.setTimeout(() => {
            DBsvg.update({ fileId: file._id }, { $set: { uploading: false, src: src } });
            // Svgs.remove({ _id: file._id });
          }, 1500);
        }));
      }));
      // exec(`mv ${file.path} ${projSvgPath}/${file.name}`, Meteor.bindEnvironment(function(err) {
      //   if (err) {
      //     console.log(err);
      //     DBsvg.remove({ fileId: file._id });
      //     Svgs.remove({ _id: file._id });
      //   }
      // }));

    }
  }
});



export default Svgs;
