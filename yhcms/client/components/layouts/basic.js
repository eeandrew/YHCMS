import {
  Template
} from 'meteor/templating';
import modalStore from '../../stores/uistates/modal.store';

Template.basicLayout.helpers({
  modalOpen: ()=>{
    return modalStore.get('open')
  }
})
