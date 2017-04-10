import { Meteor } from 'meteor/meteor';
import { Images } from '../universal/collections';
import svg2css from 'svg2css';
import { upload2qiniu } from './utils/upload2qiniu';
import path from 'path';
import fs from 'fs';
import config from '../config.json';
import secret from '../secret.json';
// import qiniu from 'qiniu';

const projPath = path.join(config.uplaodPath, 'uploads');

Meteor.startup(() => {
  // code to run on server at startup
});

// if (Meteor.isServer) {
//   Meteor.publish('files.images.all', function () {
//     return Images.find().cursor;
//   });
// }

function createCss(projName) {
  return new Promise(function(resolve, reject) {
    svg2css({
      baseDir: projPath,
      cssFilePath: config.cssFilePath,
      svgDir: `svgs/${projName}`,
      iconName: 'yhicon'
    }, Meteor.bindEnvironment((res) => {
      if (res.result === true) {
        const uploadFile = {
          path: res.path,
          name: res.name,
          meta: {
            proj: projName
          }
        };
        upload2qiniu(uploadFile, Meteor.bindEnvironment(
          (res) => {
            resolve({
              url: `${secret.BASE_URL}${res.key}`,
              msg: 'svg to css 转换成功',
              res: true
            });
          }
        ));
      } else {
        resolve({
          msg: 'svg to css 转换失败',
          res: false
        });
      }
    }));
  });
}

Meteor.methods({
  createCss: function (projName) {
    return createCss(projName).then((res) => {
      console.log(res);
      return res.url;
    });
  },
  createDir: function(projectname, projecttype) {
    const projDirPath = path.join(projPath, `${projecttype}/${projectname}`);
    if (!fs.existsSync(projDirPath)) {
      fs.mkdirSync(projDirPath);
    }
  }
});
