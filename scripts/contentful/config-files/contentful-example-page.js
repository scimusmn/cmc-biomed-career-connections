import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

function ContentfulExamplePage() {
  const data = useStaticQuery(graphql`
    query {
      allContentfulContentType(limit: 100) {
        nodes {
          name
          description
        }
      }
    }
  `);

  const { allContentfulContentType } = data;

  return (
    <>
      <h1>Contentful example page</h1>
      <hr />
      <br />
      <h3>Available content types</h3>
      <ul>
        {allContentfulContentType.nodes.map((node) => (
          <li key={node.name}>
            <strong>{node.name}</strong>
            {' - '}
            {node.description}
          </li>
        ))}
      </ul>
    </>
  );
}

export default ContentfulExamplePage;
