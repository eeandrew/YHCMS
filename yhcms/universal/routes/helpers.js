function renderBasic(template) {
  if (!Meteor.userId()) {
    FlowRouter.go('/');
  }
  return BlazeLayout.render('basicLayout',{
    content: template,header: 'header', footer: 'footer'
  })
}

function renderSlim(template) {
  return BlazeLayout.render('slimLayout',{
    content: template
  })
}

export {
  renderBasic,
  renderSlim
};
