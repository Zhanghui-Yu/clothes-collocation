/**
 * @format
 */

import 'react-native';
import React from 'react';
import Clothes from '../src/js/Clothes';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<Clothes />);
});
