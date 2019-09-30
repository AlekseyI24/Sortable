import { getChild } from '../../src/utils.js';


const drop = function({
	originalEvent,
	putSortable,
	dragEl,
	activeSortable,
	dispatchSortableEvent,
	hideGhostForTarget,
	unhideGhostForTarget
}) {
	let toSortable = putSortable || activeSortable;
	hideGhostForTarget();
	let touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
	let target = document.elementFromPoint(touch.clientX, touch.clientY);
	unhideGhostForTarget();
	dispatchSortableEvent('spill');
	this.onSpill({ dragEl, putSortable });
};

function Revert() {}

Revert.prototype = {
	startIndex: null,
	dragStart({ oldDraggableIndex }) {
		this.startIndex = oldDraggableIndex;
	},
	onSpill({ dragEl, putSortable }) {
		if(this.startIndex != -1)
		{
			let nextSibling = getChild(this.sortable.el, this.startIndex, this.options);

			if (nextSibling) {
				this.sortable.el.insertBefore(dragEl, nextSibling);
			} else {
				this.sortable.el.appendChild(dragEl);
			}
			this.startIndex = -1;
		}
	},
	drop
};

Object.assign(Revert, {
	pluginName: 'revertOnSpill'
});


function Remove() {}

Remove.prototype = {
	onSpill({ dragEl, putSortable }) {
		const parentSortable = putSortable || this.sortable;
		parentSortable.captureAnimationState();
		dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
		parentSortable.animateAll();
	},
	drop
};

Object.assign(Remove, {
	pluginName: 'removeOnSpill'
});


export default [Remove, Revert];

export {
	Remove as RemoveOnSpill,
	Revert as RevertOnSpill
};
