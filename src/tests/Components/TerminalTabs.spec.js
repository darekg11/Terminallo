import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';

import TerminalTabs from '../../app/components/TerminalTabs/TerminalTabs';

Enzyme.configure({ adapter: new Adapter() });

describe('TerminalTabs component tests', () => {
  it('should render', () => {
    const initialState = {
      TerminalsReducer: {
        terminals: [],
        selectedTerminal: '',
      },
    };
    const mockStore = configureStore();
    const store = mockStore(initialState);
    const wrapper = shallow(<TerminalTabs store={store} />);
    expect(wrapper).to.have.length(1);
  });
});
