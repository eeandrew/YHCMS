import { Template } from 'meteor/templating';
import { Images } from '../../../universal/collections';

Template.imageEditor.onCreated(function() {})

Template.imageEditor.helpers({
    images: () => {
      return Images.find({});
    }
})
