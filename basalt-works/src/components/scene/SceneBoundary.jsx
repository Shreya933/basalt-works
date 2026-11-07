import { Component } from 'react';

/** If WebGL or a model fails, drop the loader and leave the text chapters readable. */
export default class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) {
    console.error('3D scene failed:', error);
    this.props.onError?.();
  }
  render() { return this.state.failed ? null : this.props.children; }
}
