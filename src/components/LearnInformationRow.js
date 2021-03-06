import React from 'react';
import { Link } from 'react-router-dom';

const LearnInformationRow = () => {
  return (
    <div className='row-container container-fluid home-row'>
      <a href="http://www.google.com">
        <div className='image-container'>
          <div className='image transportaion' />
          <div className='title'>Transportation</div>
          <div className='text'>
            Monitor your progress over time all in the app.
          </div>
        </div>
      </a>
      <a href="http://www.google.com">
        <div className='image-container'>
          <div className='image household' />
          <div className='title'>Household</div>
          <div className='text'>
            Learn how to better yourself and lower your emissions.
          </div>  
        </div>
      </a>
      <a href="http://www.google.com">
        <div className='image-container'>
          <div className='image improve' />
          <div className='title'>Food</div>
          <div className='text'>
            Improve your emissions by constantly using the app!
          </div>
        </div>
        </a>
      </div>
  );
};

export default LearnInformationRow;
