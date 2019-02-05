import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import App from '../../app/App';

Enzyme.configure({ adapter: new Adapter() });

describe('App component tests', () => {
  it('should render', () => {
    const wrapper = shallow(<App />);
    expect(wrapper).to.have.length(1);
  });
});
