import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Terminal from '../../app/components/Terminal/Terminal';

Enzyme.configure({ adapter: new Adapter() });

describe('Terminal component tests', () => {
  it('should render', () => {
    const terminalInstance = {
      xTermInstance: {
        open: () => {},
        fit: () => {},
      },
    };
    const wrapper = shallow(<Terminal terminal={terminalInstance} />);
    expect(wrapper).to.have.length(1);
  });
});
