import { FilesCollection } from 'meteor/ostrio:files';

const Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: true,
  onBeforeUpload: (file) => {
    if(file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }else {
      return 'Please upload image, with size equal or less than 10MB';
    }
  },
});

export default Images;
