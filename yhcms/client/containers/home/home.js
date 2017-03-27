import {
  Template
} from 'meteor/templating';

Template.home.onCreated(function(){
 
})

Template.home.helpers({
  openProject: ()=>{
    return (id)=>{
      alert(id);
    }
  },
  projects: [{
    name: '管家资源1',
    type: 'img',
    id: '1',
    callback: Template.instance
  },{
    name: '管家资源2',
    type: 'svg',
    id: '2',
    callback: Template.instance
  }]
})