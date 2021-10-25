import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

const ContentfulExamplePage = () => {
  const data = useStaticQuery(graphql`
    query {
      flipbook(slug: { eq: "how-bionic-eyes-will-progress" }) {
        title
        subhead
        description
      }
    }
  `);

  const { flipbook } = data;
  const { title, subhead, description } = flipbook;

  return (
    <>
      <pre>Contentful example page</pre>
      <hr />
      <h1>{title}</h1>
      <h2>{subhead}</h2>
      <p>{description}</p>
    </>
  );
};

export default ContentfulExamplePage;
