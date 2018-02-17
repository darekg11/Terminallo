import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';

import SidePanel from '../../app/components/SidePanel/SidePanel';

Enzyme.configure({ adapter: new Adapter() });

describe('SidePanel component tests', () => {
  it('should render', () => {
    const initialState = {
      TerminalsReducer: {
        terminals: [],
      },
    };
    const mockStore = configureStore();
    const store = mockStore(initialState);
    const wrapper = shallow(<SidePanel store={store} />);
    expect(wrapper).to.have.length(1);
  });
});
