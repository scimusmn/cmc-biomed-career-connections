const path = require('path');

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, './src/components'),
        '@styles': path.resolve(__dirname, './src/styles'),
      },
    },
  });
};

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  // language=GraphQL <- Enables code formatting for Gatsby's unique GraphQL function
  const {
    // Query Contentful content types that render to a page
    // The slug field is the bare minimum required for page creation
    data: {
      allMyContentTypeData,
    },
  } = await graphql(`
    {
      allMyContentTypeData: allContentfulMyContentType {
        edges {
          node {
            slug
          }
        }
      }
    }
  `);

  // Define how and where we create pages by pairing
  // Content Types to templates and slug prefixes.
  const pageTypes = [
    {
      entries: allMyContentTypeData.edges,
      slugPrefix: '/',
      template: './src/templates/MyContentType/index.js',
    },
  ];

  pageTypes.forEach((pageType) => {
    pageType.entries.forEach(({ node }) => {
      // Only create pages when slug is present
      if (node.slug !== null) {
        createPage({
          component: path.resolve(pageType.template),
          context: {
            slug: node.slug,
          },
          path: pageType.slugPrefix + node.slug,
        });
      }
    });
  });
};
