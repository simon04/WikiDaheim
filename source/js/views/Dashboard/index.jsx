import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { loadCategories } from 'actions/app';

import SearchBar from 'components/Dashboard/SearchBar';
import ResultView from 'components/Dashboard/ResultView';
import Filter from 'components/Dashboard/Filter';

import Icon from 'components/Global/Icon';

@connect(() => ({}), null, null, { pure: false })
export default class Dashboard extends Component {
  static propTypes = {
    children: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    // from react-redux connect
    dispatch: PropTypes.func,
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(loadCategories());
  }

  render() {
    return (
      <div className='Dashboard'>
        <SearchBar />
        <Filter />

        <ResultView />

        <h3>SVG sprite icon tests</h3>
        <div className='Example'>
          <Icon glyph='square' />
          <Icon glyph='circle' />
          <Icon glyph='triangle' />
        </div>
      </div>
    );
  }
}
