import {Template} from 'meteor/templating';

Template.header.onRendered(function() {
  console.log(this.$('#login-other-options'));
  this.$('#login-other-options').hide();
})
