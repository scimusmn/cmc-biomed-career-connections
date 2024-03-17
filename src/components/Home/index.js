import React from 'react';
import jsonData from '../../content/career-connections.json';
import ImageWithCaption from './ImageWithCaption';

function Home() {
  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-10">{jsonData.title}</h1>

      <div className="space-y-12 mb-10">
        {jsonData.providers.map((provider) => (
          <div key={provider.name} className="space-y-4 max-w-4xl border p-8">
            <h2 className="text-2xl font-bold">{provider.name}</h2>

            <div>
              <h3 className="text-gray-400 text-lg">Designation</h3>
              <p className="mt-0.5">
                {provider.designation}
              </p>
            </div>

            <div>
              <h3 className="text-gray-400 text-lg">My Story</h3>
              <p className="mt-0.5">
                {provider.story}
              </p>
            </div>

            <div className="flex gap-4">
              <ImageWithCaption
                src={provider.profileImage}
                alt={provider.name}
                caption="Profile Image"
              />
              <ImageWithCaption
                src={provider.coverImage}
                alt={provider.name}
                caption="Cover Image"
              />
              <ImageWithCaption
                src={provider.careerPathImage}
                alt={provider.name}
                caption="Career Path"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
