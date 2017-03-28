import {
  Template
} from 'meteor/templating';
import {
  openModal,
  closeModal
} from '../../stores/uiactions/modal.action';
import modalStore from '../../stores/uistates/modal.store';

Template.Modal.events({
  'click .yhicon-close'(event,instance){
    closeModal();
  }
});

Template.Modal.helpers({
  title: ()=>{
    return modalStore.get('title')
  }
});