import { Meteor } from 'meteor/meteor';
import { Images } from '../universal/collections';
// import qiniu from 'qiniu';

Meteor.startup(() => {
  // code to run on server at startup
});

if (Meteor.isServer) {
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });
}
