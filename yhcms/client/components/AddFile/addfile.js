import {Template} from 'meteor/templating';
import {Images, Svgs} from '../../../universal/collections'
import {ReactiveVar} from "meteor/reactive-var";

Template.addFile.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
})

Template.addFile.events({
    'change #filer' (event, instance) {
        if (event.target.files && event.target.files.length > 0) {
            const filelen = event.target.files.length;
            if (filelen > 10) {
                alert('too much files you upload, max is 10!');
                return;
            }
            for (let i = 0; i < filelen; i++) {
                let upload = {};
                if (event.target.files[i].type === 'image/svg+xml') {
                    upload = Svgs.insert({
                        file: event.target.files[i],
                        streams: 'dynamic',
                        chunkSize: 'dynamic'
                    }, false);
                } else {
                    upload = Images.insert({
                        file: event.target.files[i],
                        streams: 'dynamic',
                        chunkSize: 'dynamic'
                    }, false);
                }
                upload.on('start', () => {
                    instance.currentUpload.set(this);
                })
                upload.on('progress', (a, b) => {
                    console.log(a);
                    console.log(b);
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
