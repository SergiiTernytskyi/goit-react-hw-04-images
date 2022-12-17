import PropTypes from 'prop-types';
import { useState } from 'react';

import { Modal } from 'components/Modal/Modal';
import { Item, Picture } from './ImageGalleryItem.styled';

export function ImageGalleyItem({ image }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Item>
        <Picture
          src={image.webformatURL}
          alt={image.tags}
          onClick={() => setShowModal(true)}
        />
      </Item>
      {showModal && <Modal image={image} onClose={() => setShowModal(false)} />}
    </>
  );
}

ImageGalleyItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
    largeImageURL: PropTypes.string.isRequired,
  }).isRequired,
};
