import { Template } from 'meteor/templating';
import { openModal, closeModal } from '../../stores/uiactions/modal.action';
import { Svgs } from '../../../universal/collections';

Template.svgEditor.onCreated(function() {})

Template.svgEditor.events({
  'click #cssCreate'(event, instance) {
    Meteor.call("createCss", function(err, result){
        if(!err){
          console.log(result);
          alert('url is => ' + result);
        }
    });
  }
})

Template.svgEditor.helpers({
    Svgs: () => {
      return Svgs.find({});
    }
})
