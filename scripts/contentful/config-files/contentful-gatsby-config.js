require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    author: '@scimusmn',
    description: 'Science Museum of Minnesota exhibit template',
    title: 'app-template',
  },
  plugins: [
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-eslint',
    'gatsby-plugin-image',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-contentful',
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        forceFullSync: true,
        useNameForId: false,
        environment: process.env.CONTENTFUL_ENVIRONMENT,
        host: process.env.CONTENTFUL_HOST,
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'app-template',
        short_name: 'app',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#000000',
        display: 'standalone',
        icon: 'src/images/smm.png',
      },
    },
  ],
};
