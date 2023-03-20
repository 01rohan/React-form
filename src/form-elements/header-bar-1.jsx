/**
 * <HeaderBar />
 */

import React from "react";
// import Grip from '../multi-column/grip';
import DragHandle from "./component-drag-handle";
import DragHandleUpper from "./component-drag-handle1";

export default class HeaderBar extends React.Component {
  render() {
    return (
      <>
        <div>
          <DragHandleUpper
            data={this.props.data}
            index={this.props.index}
            onDestroy={this.props.onDestroy}
            setAsChild={this.props.setAsChild}
          />
        </div>
        {/* <div className="toolbar-header" style={{ marginBottom: "1rem" }}>
          <span className="badge badge-secondary">{this.props.data.text}</span>
          <div className="toolbar-header-buttons">
            {this.props.data.element !== "LineBreak" && (
              <div
                className="btn is-isolated"
                onClick={this.props.editModeOn.bind(
                  this.props.parent,
                  this.props.data
                )}
              >
                <i className="is-isolated fas fa-edit"></i>
              </div>
            )}
            <div
              className="btn is-isolated"
              onClick={this.props.onDestroy.bind(this, this.props.data)}
            >
              <i className="is-isolated fas fa-trash"></i>
            </div>


            <DragHandle
              data={this.props.data}
              index={this.props.index}
              onDestroy={this.props.onDestroy}
              setAsChild={this.props.setAsChild}
            />
          </div>
        </div> */}
      </>
    );
  }
}
