import {
  ReactiveDict
} from "meteor/reactive-dict";
const modalStore = new ReactiveDict('modalStore');
modalStore.set('open',false);
modalStore.set('contentTPL','');
export default modalStore;