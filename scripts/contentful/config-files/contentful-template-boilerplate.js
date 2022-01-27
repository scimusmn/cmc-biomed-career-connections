import React from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';

export const pageQuery = graphql`
  query ($slug: String!) {
    contentfulMyContentType(slug: { eq: $slug }) {
      slug
    }
  }
`;

function MyContentType({ data }) {
  const { contentfulMyContentType } = data;
  const { slug } = contentfulMyContentType;

  return (
    <>
      <pre>MyContentType template page</pre>
      <h1>{slug}</h1>
    </>
  );
}

MyContentType.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
};

export default MyContentType;
