import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import cx from "classnames";

/**
 * @fileoverview react-star-rating
 * @author @cameronjroe
 * <StarRating
 *   name={string} - name for form input (required)
 *   caption={string} - caption for rating (optional)
 *   ratingAmount={number} - the rating amount (required, default: 5)
 *   rating={number} - a set rating between the rating amount (optional)
 *   disabled={boolean} - whether to disable the rating from being selected (optional)
 *   editing={boolean} - whether the rating is explicitly in editing mode (optional)
 *   size={string} - size of stars (optional)
 *   onRatingClick={function} - a handler function that gets called onClick of the rating (optional)
 *   />
 */

export default class ScaleRatings extends React.Component {
  constructor(props) {
    super(props);

    this.min = 0;
    this.max = props.scaleAmount || 10;

    const scaleVal = props.scale;
    const scaleCache = {
      pos: scaleVal ? this.getStarScaleRatingPosition(scaleVal) : 0,
      scale: props.scale,
    };

    this.state = {
      scaleCache,
      editing: props.editing || !props.scale,
      stars: 10,
      scale: scaleCache.scale,
      pos: scaleCache.pos,
      glyph: this.getStars(),
    };
  }

  /**
   * Gets the stars based on ratingAmount
   * @return {string} stars
   */
  getStars() {
    let stars = "";
    const numScaleRating = this.props.scaleAmount;
    for (let i = 1; i < numScaleRating; i++) {
      stars += i;
    }
    return stars;
  }

  // componentWillMount() {
  //   this.min = 0;
  //   this.max = this.props.ratingAmount || 5;
  //   if (this.props.rating) {
  //     this.state.editing = this.props.editing || false;
  //     const ratingVal = this.props.rating;
  //     this.state.ratingCache.pos = this.getStarRatingPosition(ratingVal);
  //     this.state.ratingCache.rating = ratingVal;

  //     this.setState({
  //       ratingCache: this.state.ratingCache,
  //       rating: ratingVal,
  //       pos: this.getStarRatingPosition(ratingVal),
  //     });
  //   }
  // }

  componentDidMount() {
    this.root = ReactDOM.findDOMNode(this.rootNode);
    this.scaleContainer = ReactDOM.findDOMNode(this.node);
  }

  componentWillUnmount() {
    delete this.root;
    delete this.scaleContainer;
  }

  getPosition(e) {
    return e.pageX - this.root.getBoundingClientRect().left;
  }

  applyPrecision(val, precision) {
    return parseFloat(val.toFixed(precision));
  }

  getDecimalPlaces(num) {
    const match = `${num}`.match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    return !match
      ? 0
      : Math.max(
          0,
          (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0)
        );
  }

  getWidthFromValue(val) {
    const min = this.min;
    const max = this.max;

    if (val <= min || min === max) {
      return 0;
    }
    if (val >= max) {
      return 100;
    }
    return (val / (max - min)) * 100;
  }

  getValueFromPosition(pos) {
    const precision = this.getDecimalPlaces(this.props.step);
    const maxWidth = this.scaleContainer.offsetWidth;
    const diff = this.max - this.min;
    let factor = (diff * pos) / (maxWidth * this.props.step);
    factor = Math.ceil(factor);
    let val = this.applyPrecision(
      parseFloat(this.min + factor * this.props.step),
      precision
    );
    val = Math.max(Math.min(val, this.max), this.min);
    return val;
  }

  calculate(pos) {
    const val = this.getValueFromPosition(pos);
    let width = this.getWidthFromValue(val);

    width += "%";
    return { width, val };
  }

  getStarScaleRatingPosition(val) {
    const width = `${this.getWidthFromValue(val)}%`;
    return width;
  }

  getScaleRatingEvent(e) {
    const pos = this.getPosition(e);
    return this.calculate(pos);
  }

  //   getSvg() {
  //     return (
  //       <svg
  //         className="react-star-rating__star"
  //         viewBox="0 0 286 272"
  //         version="1.1"
  //         xmlns="http://www.w3.org/2000/svg"
  //       >
  //         <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
  //           <polygon
  //             id="star-flat"
  //             points="143 225 54.8322122 271.352549 71.6707613 173.176275 0.341522556 103.647451 98.9161061 89.3237254 143 0 187.083894 89.3237254 285.658477 103.647451 214.329239 173.176275 231.167788 271.352549 "
  //           ></polygon>
  //         </g>
  //       </svg>
  //     );
  //   }

  handleMouseLeave() {
    this.setState({
      pos: this.state.scaleCache.pos,
      scale: this.state.scaleCache.scale,
    });
  }

  handleMouseMove(e) {
    // get hover position
    const scaleEvent = this.getScaleRatingEvent(e);
    this.updateScaleRating(scaleEvent.width, scaleEvent.val);
  }

  updateScaleRating(width, val) {
    this.setState({
      pos: width,
      scale: val,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props) {
      this.updateScaleRating(
        this.getStarScaleRatingPosition(nextProps.scale),
        nextProps.scale
      );
      return true;
    }
    return (
      nextState.scaleCache.scale !== this.state.scaleCache.scale ||
      nextState.scale !== this.state.scale
    );
  }

  handleClick(e) {
    // is it disabled?
    if (this.props.disabled) {
      e.stopPropagation();
      e.preventDefault();
      return false;
    }

    const scaleCache = {
      pos: this.state.pos,
      scale: this.state.scale,
      caption: this.props.caption,
      name: this.props.name,
    };

    this.setState({
      scaleCache,
    });

    this.props.onScaleRatingClick(e, scaleCache);
    return true;
  }

  treatName(title) {
    if (typeof title === "string") {
      return title.toLowerCase().split(" ").join("_");
    }
    return null;
  }

  render() {
    // let caption = null;
    const classes = cx({
      "react-star-scale__root": true,
      "scale-disabled": this.props.disabled,
      [`react-star-scale__size--${this.props.size}`]: this.props.size,
      "scale-editing": this.state.editing,
    });

    // is there a caption?
    // if (this.props.caption) {
    //   caption = (<span className="react-rating-caption">{this.props.caption}</span>);
    // }

    // are we editing this rating?
    let starRating;
    if (this.state.editing) {
      starRating = (
        <div
          ref={(c) => (this.node = c)}
          className="rating-container rating-gly-star"
          data-content={this.state.glyph}
          onMouseMove={this.handleMouseMove.bind(this)}
          onMouseLeave={this.handleMouseLeave.bind(this)}
          onClick={this.handleClick.bind(this)}
        >
          <div
            className="rating-stars"
            data-content={this.state.glyph}
            style={{ width: this.state.pos }}
          ></div>
        </div>
      );
    } else {
      starRating = (
        <div
          ref={(c) => (this.node = c)}
          className="rating-container rating-gly-star"
          data-content={this.state.glyph}
        >
          <div
            className="rating-stars"
            data-content={this.state.glyph}
            style={{ width: this.state.pos }}
          ></div>
        </div>
      );
    }

    return (
      <span className="react-star-rating">
        <span
          ref={(c) => (this.rootNode = c)}
          style={{ cursor: "pointer" }}
          className={classes}
        >
          {starRating}
          <input
            type="hidden"
            name={this.props.name}
            value={this.state.scaleCache.scale}
            style={{ display: "none !important", width: 65 }}
            min={this.min}
            max={this.max}
            readOnly
            // style={{
            //   ,
            // }}
          />
        </span>
      </span>
    );
  }
}

ScaleRatings.propTypes = {
  name: PropTypes.string.isRequired,
  caption: PropTypes.string,
  scaleAmount: PropTypes.number.isRequired,
  scale: PropTypes.number,
  onScaleRatingClick: PropTypes.func,
  disabled: PropTypes.bool,
  editing: PropTypes.bool,
  size: PropTypes.string,
};

ScaleRatings.defaultProps = {
  step: 0.5,
  scaleAmount: 10,
  onScaleRatingClick() {},
  disabled: false,
};
