import {
  Template
} from 'meteor/templating';

Template.ProjectBtn.events({
  'click .project-btn'(event,instance) {
    const {
      addNew,
      callback
    } = instance.data;
    if(addNew) {
     callback && callback();
    }
  }
});