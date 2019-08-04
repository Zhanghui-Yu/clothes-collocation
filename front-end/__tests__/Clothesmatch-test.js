/**
 * @format
 */

import 'react-native';
import React from 'react';
import Clothesmatch from '../src/js/Clothesmatch';
import { shallow } from 'jest';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<Clothesmatch />);
});




