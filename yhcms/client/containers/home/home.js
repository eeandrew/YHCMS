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

Template.home.onCreated(function(){
 
})

Template.home.helpers({
  openProject: ()=>{
    return (id)=>{
      openModal({title: `管家${id}`,contentTPL:'addProject'});
    }
  },
  addProject: ()=>{
    return ()=>{
      openModal({title: '新建项目', contentTPL: 'addProject'});
    }
  },
  projects: ()=>{
    return Projects.find({})
  }
})