import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

const ContentfulExamplePage = () => {
  const data = useStaticQuery(graphql`
    query {
      contentfulFlipbook(slug: { eq: "how-bionic-eyes-will-progress" }) {
        title
        subhead
        description {
          description
        }
      }
    }
  `);

  const { contentfulFlipbook } = data;
  const { title, subhead, description } = contentfulFlipbook;

  return (
    <>
      <pre>Contentful example page</pre>
      <hr />
      <h1>{title}</h1>
      <h2>{subhead}</h2>
      <p>{description.description}</p>
    </>
  );
};

export default ContentfulExamplePage;
