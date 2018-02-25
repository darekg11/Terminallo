import React from 'react';
import { expect } from 'chai';
import Enzyme, { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Adapter from 'enzyme-adapter-react-16';

import Spinner from '../../app/components/Spinner/Spinner';

Enzyme.configure({ adapter: new Adapter() });

describe('Spinner component tests', () => {
  it('should render', () => {
    const initialState = {
      SpinnerReducer: {
        show: false,
        loading: true,
        showSuccessMessage: false,
        showErrorMessage: false,
        loadingMessage: '',
        successMessage: '',
        errorMessage: '',
      },
    };
    const mockStore = configureStore();
    const store = mockStore(initialState);
    const wrapper = shallow(<Spinner store={store} />);
    expect(wrapper).to.have.length(1);
    expect(wrapper.prop('show')).to.equal(false);
    expect(wrapper.prop('loading')).to.equal(true);
    expect(wrapper.prop('showSuccessMessage')).to.equal(false);
    expect(wrapper.prop('showErrorMessage')).to.equal(false);
    expect(wrapper.prop('loadingMessage')).to.equal('');
    expect(wrapper.prop('successMessage')).to.equal('');
    expect(wrapper.prop('errorMessage')).to.equal('');
  });
});
