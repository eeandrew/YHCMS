import {
  Mongo
} from 'meteor/mongo';

const DBimage = new Mongo.Collection('DBimage');
export default DBimage;
