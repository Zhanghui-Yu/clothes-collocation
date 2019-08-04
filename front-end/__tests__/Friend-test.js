/**
 * @format
 */

import 'react-native';
import React from 'react';
import Friend from '../src/js/Friend';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<Friend />);
});
