import {
  Template
} from 'meteor/templating';

Template.ProjectBtn.events({
  'click .project-btn'(event,instance) {
    console.log(instance.data);
    const {
      project,
      callback
    } = instance.data;
    const {
      id
    } = project;
    callback && callback(id);
  }
});