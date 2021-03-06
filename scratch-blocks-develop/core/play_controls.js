/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2015 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Object representing a play icons.
 * @author carloslfu@gmail.com (Carlos Galarza)
 */
'use strict';

goog.provide('Blockly.PlayControls');

goog.require('Blockly.Touch');
goog.require('goog.dom');


/**
 * Class for a play controls.
 * @param {!Blockly.Workspace} workspace The workspace to sit in.
 * @constructor
 */
Blockly.PlayControls = function(workspace) {
  this.workspace_ = workspace;
};

/**
 * Width of the play controls.
 * @type {number}
 * @private
 */
Blockly.PlayControls.prototype.WIDTH_ = 60;

/**
 * Height of the play controls.
 * @type {number}
 * @private
 */
Blockly.PlayControls.prototype.HEIGHT_ = 120;

/**
 * Distance between play controls and bottom edge of workspace.
 * @type {number}
 * @private
 */
Blockly.PlayControls.prototype.MARGIN_BOTTOM_ = 0;

/**
 * Distance between play controls and right edge of workspace.
 * @type {number}
 * @private
 */
Blockly.PlayControls.prototype.MARGIN_SIDE_ = 20 - (Blockly.PlayControls.prototype.WIDTH_-47)/2;

/**
 * The SVG group containing the play controls.
 * @type {Element}
 * @private
 */
Blockly.PlayControls.prototype.svgGroup_ = null;

/**
 * Left coordinate of the play controls.
 * @type {number}
 * @private
 */
Blockly.PlayControls.prototype.left_ = 0;

/**
 * Top coordinate of the play controls.
 * @type {number}
 * @private
 */
Blockly.PlayControls.prototype.top_ = 0;

/**
 * Create the play controls.
 * @return {!Element} The play controls SVG group.
 */
Blockly.PlayControls.prototype.createDom = function() {
  var workspace = this.workspace_;
  /* Here's the markup that will be generated:
  <g class="blocklyPlay">
    <clippath id="blocklyPlayoutClipPath837493">
      <rect width="32" height="32" y="77"></rect>
    </clippath>
    <image width="96" height="124" x="-64" y="-15" xlink:href="media/sprites.png"
        clip-path="url(#blocklyPlayoutClipPath837493)"></image>
    <clippath id="blocklyPlayinClipPath837493">
      <rect width="32" height="32" y="43"></rect>
    </clippath>
    <image width="96" height="124" x="-32" y="-49" xlink:href="media/sprites.png"
        clip-path="url(#blocklyPlayinClipPath837493)"></image>
  </g>
  */
  this.svgGroup_ = Blockly.createSvgElement('g',
      {'class': 'blocklyPlay'}, null);
  var rnd = String(Math.random()).substring(2);

  var clip = Blockly.createSvgElement('clipPath',
      {'id': 'blocklyPlayClipPath' + rnd},
      this.svgGroup_);
  Blockly.createSvgElement('rect',
      {'width': this.WIDTH_, 'height': this.HEIGHT_/2},
      clip);
  var playSvg = Blockly.createSvgElement('image',
      {'width': this.WIDTH_, 'x': 0,
       'height': this.HEIGHT_/2, 'y': 0},
      this.svgGroup_);
  playSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      workspace.options.pathToMedia + "icons/event_whenflagclicked.svg");

  var clip = Blockly.createSvgElement('clipPath',
      {'id': 'blocklyStopClipPath' + rnd},
      this.svgGroup_);
  Blockly.createSvgElement('rect',
      {'width': this.WIDTH_, 'height': this.HEIGHT_/2},
      clip);
  var stopSvg = Blockly.createSvgElement('image',
      {'width': this.WIDTH_, 'x': 0,
       'height': this.HEIGHT_/2, 'y': (this.HEIGHT_/2)},
      this.svgGroup_);
  stopSvg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href',
      workspace.options.pathToMedia + "icons/control_stop.svg");
	this.svgGroup_.style.opacity = 0.8;
 

  // Attach event listeners.
  Blockly.bindEventWithChecks_(playSvg, 'mousedown', null, function(e) {
    Blockly.Touch.clearTouchIdentifier(); // Don't block future drags.
    e.stopPropagation();  // Don't start a workspace scroll.
    e.preventDefault();  // Stop double-clicking from selecting text.
  var event = new Blockly.Events.Ui(null, 'play', null, null);
  event.workspaceId = workspace.id;
  Blockly.Events.fire(event);
  });
  Blockly.bindEventWithChecks_(stopSvg, 'mousedown', null, function(e) {
    Blockly.Touch.clearTouchIdentifier(); // Don't block future drags.
    e.stopPropagation();  // Don't start a workspace scroll.
    e.preventDefault();  // Stop double-clicking from selecting text.
  var event = new Blockly.Events.Ui(null, 'stop', null, null);
  event.workspaceId = workspace.id;
  Blockly.Events.fire(event);
  });

  return this.svgGroup_;
};

/**
 * Initialize the play controls.
 * @param {number} bottom Distance from workspace bottom to bottom of controls.
 * @return {number} Distance from workspace bottom to the top of controls.
 */
Blockly.PlayControls.prototype.init = function(bottom) {
  this.bottom_ = this.MARGIN_BOTTOM_ + bottom;
  return this.bottom_ + this.HEIGHT_;
};

/**
 * Dispose of this play controls.
 * Unlink from all DOM elements to prevent memory leaks.
 */
Blockly.PlayControls.prototype.dispose = function() {
  if (this.svgGroup_) {
    goog.dom.removeNode(this.svgGroup_);
    this.svgGroup_ = null;
  }
  this.workspace_ = null;
};

/**
 * Move the play controls to the bottom-right corner.
 */
Blockly.PlayControls.prototype.position = function() {
  var metrics = this.workspace_.getMetrics();
  if (!metrics) {
    // There are no metrics available (workspace is probably not visible).
    return;
  }
  if (this.workspace_.RTL) {
    this.left_ = this.MARGIN_SIDE_ + Blockly.Scrollbar.scrollbarThickness;
    if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_LEFT) {
      this.left_ += metrics.flyoutWidth;
      if (this.workspace_.toolbox_) {
        this.left_ += metrics.absoluteLeft;
      }
    }
  } else {
    this.left_ = metrics.viewWidth + metrics.absoluteLeft -
        this.WIDTH_ - this.MARGIN_SIDE_ - Blockly.Scrollbar.scrollbarThickness;

    if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_RIGHT) {
      this.left_ -= metrics.flyoutWidth;
    }
  }
  this.top_ = metrics.viewHeight + metrics.absoluteTop -
      this.HEIGHT_ - this.bottom_;
  if (metrics.toolboxPosition == Blockly.TOOLBOX_AT_BOTTOM) {
    this.top_ -= metrics.flyoutHeight;
  }
  this.svgGroup_.setAttribute('transform',
      'translate(' + this.left_ + ',' + this.top_ + ')');
};
