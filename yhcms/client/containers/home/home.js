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

const types = ['image', 'svg'];

Template.home.helpers({
  openProject: ()=>{
    return (project)=>{
      const {
        _id, type
      } = project;
      if (types.includes(type)) {
        FlowRouter.go(`${type}editor`, {projectid:_id});
      } else {
        console.log('自定义页面');
      }
    }
  },
  addProject: ()=>{
    return ()=>{
      openModal({title: '新建项目', contentTPL: 'addProject'});
    }
  },
  projects: ()=>{
    return Projects.find({})
  },
  user: () => {
    return Meteor.userId();
  }
})
