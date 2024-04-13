import React from 'react';
import jsonData from '../../../static/content/career-connections.json';
import Slider from './Slider';

function Home() {
  return (
    <div>
      <div className="px-[72px] py-[26px] h-[106px] bg-secondary flex items-center">
        <h1 className="text-[60px] leading-[78px] italic font-extrabold mt-[26px] text-primary">
          {jsonData.title}
        </h1>
      </div>

      <Slider />
    </div>
  );
}

export default Home;
