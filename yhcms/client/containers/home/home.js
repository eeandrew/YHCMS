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
    return (project)=>{
      const {
        _id
      } = project;
      FlowRouter.go('svgeditor',{projectid:_id});
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