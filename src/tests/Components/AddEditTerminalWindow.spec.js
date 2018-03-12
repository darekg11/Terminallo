import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';

import AddEditTerminalWindow from '../../app/components/AddEditTerminalWindow/AddEditTerminalWindow';

Enzyme.configure({ adapter: new Adapter() });

describe('AddTerminalWindow component tests', () => {
  it('should render', () => {
    const initialState = {
      ApplicationStateReducer: {
        addNewTerminalWindowOpened: true,
      },
    };
    const mockStore = configureStore();
    const store = mockStore(initialState);
    const wrapper = shallow(<AddEditTerminalWindow store={store} />);
    expect(wrapper).to.have.length(1);
    expect(wrapper.prop('opened')).to.equal(true);
  });
});
