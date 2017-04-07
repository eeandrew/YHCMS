import {Template} from 'meteor/templating';
import {Images, Svgs, Projects} from '../../../universal/collections'
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
            const project = Projects.findOne({ _id: FlowRouter.getParam('projectid') });
            for (let i = 0; i < filelen; i++) {
                let upload = {};
                if (event.target.files[i].type === 'image/svg+xml') {
                    upload = Svgs.insert({
                        file: event.target.files[i],
                        streams: 'dynamic',
                        chunkSize: 'dynamic',
                        meta: {
                          proj: project.name,
                          projId: project._id
                        }
                    }, false);
                } else {
                    upload = Images.insert({
                        file: event.target.files[i],
                        streams: 'dynamic',
                        chunkSize: 'dynamic',
                        meta: {
                          proj: project.name,
                          projId: project._id
                        }
                    }, false);
                }
                upload.on('start', () => {
                    instance.currentUpload.set(this);
                })
                upload.on('end', (error, fileObj) => {
                    if (error) {
                        alert('Error during upload: ' + error);
                    } else {
                        // alert('File "' + fileObj.name + '" successfully uploaded');
                    }
                    instance.currentUpload.set(false);
                })
                upload.start();
            }
        }
    }
})
