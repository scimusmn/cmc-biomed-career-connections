import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

function ImageWithCaption({ src, alt, caption }) {
  return (
    <div>
      <img
        src={`/images/${src}`}
        alt={alt}
        className="w-64 h-auto border border-blue-400"
      />
      <p className="mt-1 text-xs text-gray-400 italic">{caption}</p>
    </div>
  );
}

ImageWithCaption.defaultProps = {
  alt: '',
  caption: '',
};

ImageWithCaption.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  caption: PropTypes.string,
};

export default ImageWithCaption;
