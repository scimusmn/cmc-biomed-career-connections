import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes

export default function MainSlide({ provider, activeTab, setActiveTab }) {
  return (
    <div className="bg-white relative flex gap-[83px] px-[77px] py-[35px] mb-3">
      {/* Cover image */}
      <img
        src={`/images/${provider.coverImage}`}
        alt="Career Cover pic"
        className="w-[713px] h-[655px] rounded-[10px] object-cover"
      />

      <div className="flex flex-col mt-[6px]">
        {/* Tab switcher buttons */}
        <div className="flex gap-[18px]">
          <TabButton
            isActive={activeTab === 'my-story'}
            onClick={() => setActiveTab('my-story')}
          >
            My Story
          </TabButton>

          <TabButton
            isActive={activeTab === 'career-path'}
            onClick={() => setActiveTab('career-path')}
          >
            My Career Path
          </TabButton>

        </div>

        {/* Name and designation */}
        <p className="font-primary text-blue text-[35px] mt-[52px] ml-[66px] leading-[43px]">
          <span>{provider.name}</span>
          <br />
          <span className="italic">{provider.designation}</span>
        </p>

        {/* Active tab contents */}
        {activeTab === 'my-story' ? (
          <p className="mt-[42px] text-[28px] leading-[43px] font-primary font-light text-blue w-[892px]">
            &quot;
            {provider.story}
            &quot;
          </p>
        ) : (
          <img
            src={`/images/${provider.careerPathImage}`}
            alt="Career Cover pic"
            className="w-[1096px] h-[447px] absolute right-[6px] bottom-[28px]"
          />
        )}
      </div>
    </div>
  );
}

function TabButton({ isActive, onClick, children }) {
  return (
    <button
      type="button"
      className={`w-[237px] h-59px] rounded-[5px] pt-[10px] pb-[3px] text-[35px] italic leading-[47px] 
        ${isActive ? 'bg-blue text-white active:bg-blueDarken10'
        : 'bg-grey text-blue active:bg-greyDarken10'}
        active:scale-95
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

MainSlide.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  provider: PropTypes.shape({
    name: PropTypes.string.isRequired,
    designation: PropTypes.string.isRequired,
    profileImage: PropTypes.string.isRequired,
    coverImage: PropTypes.string.isRequired,
    story: PropTypes.string.isRequired,
    careerPathImage: PropTypes.string.isRequired,
  }).isRequired,
};

TabButton.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
