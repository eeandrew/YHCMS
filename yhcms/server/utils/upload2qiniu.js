import qiniu from 'qiniu';
qiniu.conf.ACCESS_KEY = 'BDTai5lqSnrUNr6JvKb1u672WekKOtIdkMg4Hn24';
qiniu.conf.SECRET_KEY = '7TWCf-5vySFNgYeqzjNT1UPJd9F0F-pDWVXP1XzB';
const bucket = 'burning0xb';

function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(`${bucket}:${key}`);
  return putPolicy.token();
}

function upload2qiniu(file, cb) {
  const extra = new qiniu.io.PutExtra();
  qiniu.io.putFile(uptoken(bucket, file.name), file.name, file.path, extra, function(err, ret) {
    if(err) {
      console.log(err);
    } else {
      cb();
      console.log(ret.hash, ret.key, ret.persistentId);
    }
  });
}

export { upload2qiniu };
