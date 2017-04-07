import { Template } from 'meteor/templating';
import { DBimage, Projects } from '../../../universal/collections';

Template.imageEditor.onCreated(function() {})

Template.imageEditor.helpers({
    images: () => {
      return DBimage.find({ projId: FlowRouter.getParam('projectid') });
    },
    proj: () => {
      const _id = FlowRouter.getParam('projectid');
      return Projects.findOne({ _id: _id });
    }
})
