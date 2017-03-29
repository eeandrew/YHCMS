import modalStore from '../uistates/modal.store';

function openModal({title = '标题',contentTPL}) {
  modalStore.set('open',true);
  modalStore.set('title',title);
  modalStore.set('contentTPL',contentTPL);
}

function closeModal() {
  modalStore.set('open',false);
}

export {
  openModal,
  closeModal
}