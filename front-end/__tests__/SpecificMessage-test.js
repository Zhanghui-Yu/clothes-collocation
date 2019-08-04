/**
 * @format
 */

import 'react-native';
import React from 'react';
import SpecificMessage from '../src/js/SpecificMessage';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<SpecificMessage />);
});

