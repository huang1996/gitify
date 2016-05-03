import React from 'react'; // eslint-disable-line no-unused-vars
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { LoginPage } from '../../components/login';

const ipcRenderer = window.require('electron').ipcRenderer;
const shell = window.require('electron').shell;

function setup(props) {
  const options = {
    context: {
      router: {
        push: sinon.spy(),
        replace: sinon.spy()
      }
    }
  };

  const wrapper = shallow(<LoginPage {...props} />, options);

  return {
    context: options.context,
    props: props,
    wrapper: wrapper,
  };
};

describe('components/login.js', function () {

  beforeEach(function() {
    ipcRenderer.send.reset();
    shell.openExternal.reset();
  });

  it('should render itself & its children', function () {

    const props = {
      isLoggedIn: false,
      token: null,
      response: {},
      failed: false,
      isFetching: false
    };

    const { wrapper } = setup(props);

    expect(wrapper).to.exist;
    expect(wrapper.find('.desc').text()).to.equal('GitHub notifications in your menu bar.');

  });

  it('should redirect to notifications once logged in', function () {

    const props = {
      token: null,
      response: {},
      failed: false,
      isFetching: false
    };

    const { wrapper, context } = setup(props);

    expect(wrapper).to.exist;
    expect(wrapper.find('.desc').text()).to.equal('GitHub notifications in your menu bar.');

    wrapper.setProps({
      token: 'HELLO'
    });
    expect(ipcRenderer.send).to.have.been.calledOnce;
    expect(ipcRenderer.send).to.have.been.calledWith('reopen-window');
    expect(context.router.push).to.have.been.calledOnce;
    expect(context.router.push).to.have.been.calledWith('/notifications');

    context.router.push.reset();
  });

  it('should request the github token if the oauth code is received', function () {

    const code = 'thisisacode';

    const props = {
      loginUser: sinon.spy(),
      token: null,
      response: {},
      failed: false,
      isFetching: false
    };

    const { wrapper } = setup(props);

    expect(wrapper).to.exist;

    wrapper.instance().requestGithubToken(code);
    expect(props.loginUser).to.have.been.calledOnce;
    expect(props.loginUser).to.have.been.calledWith(code);

    props.loginUser.reset();

  });

});
