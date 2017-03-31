import { Template } from 'meteor/templating';
import { openModal, closeModal } from '../../stores/uiactions/modal.action';
import { Images } from '../../../universal/collections';

Template.svgEditor.onCreated(function() {})

Template.svgEditor.helpers({
    images: () => {
      return Images.find({});
    }
})
