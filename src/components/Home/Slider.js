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
      const { clickedIndex, visibleSlidesIndexes } = swiper;
      const isLeftMostThumbClicked = clickedIndex === visibleSlidesIndexes[0];
      const isRightMostThumbClicked = clickedIndex
        === visibleSlidesIndexes[visibleSlidesIndexes.length - 1];

      // only slide to clicked thumb if it is the right or left most thumb
      if (isLeftMostThumbClicked) {
        swiper.slideTo(clickedIndex);
        if (swiper.isBeginning === false) {
          swiper.translateTo(swiper.translate + 50.5);
        }
      }

      if (isRightMostThumbClicked) {
        swiper.slideNext();
        if (swiper.isEnd === false) {
          swiper.translateTo(swiper.translate + 50.5);
        }
      }
    });

    // Bring the bottom thumb slider in view per active slide of main slider
    mainSwiperRef?.current?.on('slideChange', (swiper) => {
      const { activeIndex } = swiper;
      const {
        activeIndex: thumbActiveIndex,
        visibleSlidesIndexes: visibleThumbIndexes,
      } = thumbsSwiperRef.current;
      // is left most thumb is active, but not fully visible
      const isLeftMostThumbHidden = activeIndex === visibleThumbIndexes[0]
        && thumbActiveIndex !== visibleThumbIndexes[0];
      // is right most thumb is active, but not fully visible
      const isRightMostThumbActive = activeIndex
        === visibleThumbIndexes[visibleThumbIndexes.length - 1];

      if (isLeftMostThumbHidden) {
        thumbsSwiperRef.current.slideTo(activeIndex);
        if (thumbsSwiperRef.current.isBeginning === false) {
          thumbsSwiperRef.current.translateTo(thumbsSwiperRef.current.translate + 50.5);
        }
      }

      if (isRightMostThumbActive) {
        thumbsSwiperRef.current.slideNext();
        if (thumbsSwiperRef.current.isEnd === false) {
          thumbsSwiperRef.current.translateTo(thumbsSwiperRef.current.translate + 50.5);
        }
      }
    });
  }, []);

  return (
    <>
      {/* Main top slide */}
      <Swiper
        effect="fade"
        fadeEffect={{ crossFade: true }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Thumbs, Autoplay, EffectFade]}
        onBeforeInit={(swiper) => {
          mainSwiperRef.current = swiper;
        }}
        allowTouchMove={false}
        className="mySwiper2"
      >
        {jsonData.providers.map((provider) => (
          <SwiperSlide key={`top-${provider.name}`}>
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
        className="mySwiper bg-grey"
      >
        {jsonData.providers.map((provider) => (
          <SwiperSlide
            key={`bottom-${provider.name}`}
            className="w-[202x] h-[237px] bg-grey px-[12px] py-[14px] [&.swiper-slide-thumb-active]:bg-lightBlue"
          >
            <img
              src={`/images/${provider.profileImage}`}
              alt="Profile"
              className="w-[178px] h-[149px] object-cover rounded-t-[5px]"
            />
            <div className="w-[178px] h-[60px] bg-darkBlue rounded-b-[5px] flex justify-center items-center">
              <p className="text-white text-[22px] leading-[25px] text-center font-secondary font-semibold px-[5px]">
                {provider.designationShort || provider.designation}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default Slider;
