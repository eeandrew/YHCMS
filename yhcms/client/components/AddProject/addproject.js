import {
  Template
} from 'meteor/templating';
import {
  openModal,
  closeModal
} from '../../stores/uiactions/modal.action';
import {
  Projects
} from '../../../universal/collections';

Template.addProject.events({
  'click .yhcms-btn-warning'(event,instance){
    closeModal();
  },
  'click .yhcms-btn-primary'(event, instance) {
    const projectname = instance.find('#projectname').value;
    const projecttype = instance.find('#projecttype').value;
    console.log(`${projectname} ${projecttype}`);
    Projects.insert({
      name: projectname,
      type: projecttype,
      createdAt: new Date().getTime()
    });
    closeModal();
  }
});