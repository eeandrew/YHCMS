import route from '../universal/routes';
route(FlowRouter);

if (Meteor.isClient) {
  Meteor.subscribe('files.images.all');
}
