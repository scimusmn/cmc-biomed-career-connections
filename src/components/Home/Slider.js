import React, { useEffect, useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import {
  FreeMode, Thumbs, Autoplay, EffectFade,
} from 'swiper/modules';
import MainSlide from './MainSlide';

import jsonData from '../../../static/content/career-connections.json';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/effect-fade';

function Slider() {
  const [activeTab, setActiveTab] = useState('my-story'); // Active tab for all main slides
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const thumbsSwiperRef = useRef(null);
  const mainSwiperRef = useRef(null);

  useEffect(() => {
    // Bring the bottom thumb slider in view on click
    thumbsSwiperRef?.current?.on('click', (swiper) => {
      thumbsSwiperRef.current.slideTo(swiper.clickedIndex);
    });

    // Bring the bottom thumb slider in view per active slide of main slider
    mainSwiperRef?.current?.on('slideChange', (swiper) => {
      thumbsSwiperRef.current.slideTo(swiper.activeIndex);
    });
  }, []);

  return (
    <>
      {/* Main top slide */}
      <Swiper
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Thumbs, Autoplay, EffectFade]}
        onBeforeInit={(swiper) => {
          mainSwiperRef.current = swiper;
        }}
        className="mySwiper2"
      >
        {jsonData.providers.map((provider) => (
          <SwiperSlide>
            <MainSlide
              provider={provider}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom thumb slider */}
      <Swiper
        onSwiper={setThumbsSwiper}
        slidesPerView={9.5}
        freeMode
        watchSlidesProgress
        modules={[FreeMode, Thumbs]}
        onBeforeInit={(swiper) => {
          thumbsSwiperRef.current = swiper;
        }}
        className="mySwiper"
      >
        {jsonData.providers.map((provider) => (
          <SwiperSlide className="w-[202x] h-[237px] bg-secondary px-[12px] py-[14px] [&.swiper-slide-thumb-active]:bg-accent">
            <img
              src={`/images/${provider.profileImage}`}
              alt="Profile"
              className="w-[178px] h-[149px] object-cover rounded-t-[5px]"
            />
            <div className="w-[178px] h-[60px] bg-primaryDark rounded-b-[5px] flex justify-center items-center">
              <p className="text-white text-[22px] leading-[25px] text-center">
                {provider.designation}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default Slider;
