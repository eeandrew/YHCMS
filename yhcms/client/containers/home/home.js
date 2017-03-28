import {
  Template
} from 'meteor/templating';
import {
  openModal,
  closeModal
} from '../../stores/uiactions/modal.action';

Template.home.onCreated(function(){
 
})

Template.home.helpers({
  openProject: ()=>{
    return (id)=>{
      openModal({title: `管家${id}`,contentTPL:'addProject'});
    }
  },
  projects: [{
    name: '管家资源1',
    type: 'img',
    id: '1',
  },{
    name: '管家资源2',
    type: 'svg',
    id: '2',
  }]
})