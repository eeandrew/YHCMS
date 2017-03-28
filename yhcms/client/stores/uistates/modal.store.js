import {
  ReactiveDict
} from "meteor/reactive-dict";
const modalStore = new ReactiveDict('modalStore');
modalStore.set('open',false);

export default modalStore;