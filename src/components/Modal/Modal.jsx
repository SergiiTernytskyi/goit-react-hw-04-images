import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { Image, ModalWindow, Overlay } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export function Modal({ image: { largeImageURL, tags }, onClose }) {
  useEffect(() => {
    window.addEventListener('keydown', keyPressHandler);

    return () => {
      window.removeEventListener('keydown', keyPressHandler);
    };
  });

  const keyPressHandler = event => {
    if (event.code === 'Escape') {
      onClose();
    }
  };

  const backdropClickHandler = ({ target, currentTarget }) => {
    if (currentTarget === target) {
      onClose();
    }
  };

  return createPortal(
    <Overlay onClick={backdropClickHandler}>
      <ModalWindow>{<Image src={largeImageURL} alt={tags} />}</ModalWindow>
    </Overlay>,
    modalRoot
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  activeImage: PropTypes.shape({
    largeImageURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }),
};
