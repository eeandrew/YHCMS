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
    console.log(event.target.files);
    if(event.target.files && event.target.files[0]) {
      const upload = Images.insert({
        file: event.target.files[0],
        streams: 'dynamic',
        chunkSize: 'dynamic'
      }, false);
      upload.on('start',()=>{
        instance.currentUpload.set(this);
      })
      upload.on('end',(error, fileObj)=>{
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
})