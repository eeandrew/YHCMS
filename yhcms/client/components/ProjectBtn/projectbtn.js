import {
  Template
} from 'meteor/templating';

Template.ProjectBtn.events({
  'click .project-btn'(event,instance) {
    const {
      addNew,
      callback,
      project
    } = instance.data;
    if(addNew) {
     callback && callback();
    }else {
      callback && callback(project);
    }
  }
});