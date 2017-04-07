import { Meteor } from 'meteor/meteor';
import { Images } from '../universal/collections';
import svg2css from './svg2css';
import { upload2qiniu } from './utils/upload2qiniu';
import path from 'path';
import config from '../config.json';
// import qiniu from 'qiniu';

const projPath = path.join(config.uplaodPath, 'uploads');

Meteor.startup(() => {
  // code to run on server at startup
});

if (Meteor.isServer) {
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });
}

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
        };
        upload2qiniu(uploadFile, Meteor.bindEnvironment(
          () => {
            console.log(`http://onmck4leq.bkt.clouddn.com/${res.name}`);
            resolve({
              url: `http://onmck4leq.bkt.clouddn.com/${res.name}`,
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
  }
});
