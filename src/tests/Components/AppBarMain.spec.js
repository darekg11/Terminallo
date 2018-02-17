import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';

import AppBarMain from '../../app/components/AppBarMain/AppBarMain';

Enzyme.configure({ adapter: new Adapter() });

describe('AppBarMain component tests', () => {
  it('should render', () => {
    const initialState = {};
    const mockStore = configureStore();
    const store = mockStore(initialState);
    const wrapper = shallow(<AppBarMain store={store} />);
    expect(wrapper).to.have.length(1);
  });
});
