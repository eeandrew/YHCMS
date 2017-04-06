import { Template } from 'meteor/templating';
import { openModal, closeModal } from '../../stores/uiactions/modal.action';
import { DBsvg, Projects } from '../../../universal/collections';
import { ReactiveVar } from "meteor/reactive-var";

Template.svgEditor.onCreated(function() {
  this.createStatus = new ReactiveVar({
    createing: false,
    percent: 60
  });
})

Template.svgEditor.events({
  'click #cssCreate'(event, instance) {
    const createStatus = instance.createStatus.get();
    createStatus.createing = true;
    instance.createStatus.set(createStatus);
    const project = Projects.findOne({ _id: FlowRouter.getParam('projectid') });
    Meteor.call("createCss", project.name, (err, result) => {
          if(!err){
            console.log(result);
            createStatus.percent = 100;
            instance.createStatus.set(createStatus);
            alert('url is => ' + result);
            setTimeout(Meteor.bindEnvironment(
              () => {
                createStatus.createing = false;
                createStatus.url = result;
                instance.createStatus.set(createStatus);
              }
            ), 1000);
          }
      });
  }
})

Template.svgEditor.helpers({
    Svgs: () => {
      return DBsvg.find({});
    },
    proj: () => {
      const _id = FlowRouter.getParam('projectid');
      return Projects.findOne({ _id: _id });
    },
    createStatus: function () {
      return Template.instance().createStatus.get();
    }
})
