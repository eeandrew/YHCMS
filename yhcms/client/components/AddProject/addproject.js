import {
  Template
} from 'meteor/templating';
import {
  openModal,
  closeModal
} from '../../stores/uiactions/modal.action';

Template.addProject.events({
  'click .yhcms-btn-warning'(event,instance){
    closeModal();
  },
  'click .yhcms-btn-primary'(event, instance) {
    closeModal();
  }
});