import React from 'react';

const LearnInformationRow = () => {
  return (
    <div className='row-container container-fluid home-row'>
      <a href="http://www.google.com">
        <div className='image-container'>
          <div className='image shopping' />
          <div className='title'>Shopping</div>
          <div className='text'>
            Learn how to better yourself and lower your emotions
          </div>
        </div>
      </a>
      <a href="http://www.google.com">
        <div className='image-container'>
          <div className='image learn' />
          <div className='title'>Clothing</div>
          <div className='text'>
            Learn how to better yourself and lower your emissions.
          </div>
        </div>
      </a>
      </div>
  );
};

export default LearnInformationRow;
