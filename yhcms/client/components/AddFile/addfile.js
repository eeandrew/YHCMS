import {
  Template
} from 'meteor/templating';
import {
  Images
} from '../../../universal/collections'
import {
  ReactiveVar
} from "meteor/reactive-var";

Template.addFile.onCreated(function(){
  this.currentUpload = new ReactiveVar(false);
})

Template.addFile.events({
  'change #filer'(event, instance) {
    if(event.target.files && event.target.files.length > 0) {
      if (event.target.files.length > 10) {
        alert('too much files you upload, max is 10!');
        return;
      }
      for (let i = 0; i < event.target.files.length; i++) {
        const upload = Images.insert({
          file: event.target.files[i],
          streams: 'dynamic',
          chunkSize: 'dynamic'
        }, false);
        upload.on('start', () => {
          instance.currentUpload.set(this);
        })
        upload.on('end', (error, fileObj) => {
          if (error) {
            alert('Error during upload: ' + error);
          } else {
            alert('File "' + fileObj.name + '" successfully uploaded');
          }
          instance.currentUpload.set(false);
        })
        upload.start();
      }
    }
  }
})
