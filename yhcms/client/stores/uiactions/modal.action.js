import modalStore from '../uistates/modal.store';

function openModal({title = '标题'}) {
  modalStore.set('open',true);
  modalStore.set('title',title);
}

function closeModal() {
  modalStore.set('open',false);
}

export {
  openModal,
  closeModal
}