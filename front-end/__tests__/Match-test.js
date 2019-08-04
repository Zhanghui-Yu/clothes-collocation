/**
 * @format
 */

import 'react-native';
import React from 'react';
import Match from '../src/js/Match';
import { shallow } from 'jest';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<Match />);
});

test('mytest', () => {
// Mock Logger module中的方法， 用jest.fn来实现spy方法
alert= jest.fn();

// setup shallowWrapper
const setup = props => shallow(<Match {...props}/>);
const wrapper = setup();

// 找到元素并且模拟press事件
wrapper.find('TouchableOpacity').simulate('press');

// Assert正确的方法被调用， 并且传参正确
expect(alert).toBeCalledWith('修改头像');
});


