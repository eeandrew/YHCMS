import qiniu from 'qiniu';
import secret from '../../secret.json';
import crypto from 'crypto';
qiniu.conf.ACCESS_KEY = secret.QINIU_ACCESS_KEY;
qiniu.conf.SECRET_KEY = secret.QINIU_SECRET_KEY;
const bucket = secret.BUNKET;

function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(`${bucket}:${key}`);
  return putPolicy.token();
}

function upload2qiniu(file, cb) {
  const hexprojname = crypto.createHash('md5').update(file.meta.proj).digest('hex');
  const hexfilename = crypto.createHash('md5').update(file.name.split('.')[0]).digest('hex');
  const extra = new qiniu.io.PutExtra();
  qiniu.io.putFile(uptoken(bucket, `${hexprojname}-${hexfilename}.${file.name.split('.')[1]}`), `${hexprojname}-${hexfilename}.${file.name.split('.')[1]}`, file.path, extra, function(err, ret) {
    if(err) {
      console.log(err);
    } else {
      cb(ret);
      console.log(ret.hash, ret.key, ret.persistentId);
    }
  });
}

export { upload2qiniu };
