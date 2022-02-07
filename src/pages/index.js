import React from 'react';
import { Link } from 'gatsby';

import Home from '@components/Home';

function IndexPage() {
  return (
    <>
      <Home />
      <Link to="/second-page">Test?</Link>
    </>
  );
}

export default IndexPage;
