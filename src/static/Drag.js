import { BlockRemovedEvent } from './Block';

let DRAG_TARGET;
let DRAG_TYPE;
let SCRIPT_BLOCKS;

/**
 * @function
 * @description Handle the dragging of a block.
 */
export function BeginDrag(event) {
  const elementBeingDragged = event.target;

  if (!elementBeingDragged.matches('.block')) {
    return;
  }

  if (elementBeingDragged.matches('.menu .block')) {
    DRAG_TYPE = 'menu';
  } else {
    DRAG_TYPE = 'script';
  }

  event.target.classList.add('dragging');
  DRAG_TARGET = event.target;
  SCRIPT_BLOCKS = [].slice(
    ...document.querySelectorAll('.script .block:not(.dragging)'),
  );
  event.dataTransfer.setData('text/html', elementBeingDragged.outerHTML);

  if (elementBeingDragged.matches('.menu .block')) {
    elementBeingDragged.effectAllowed = 'copy';
  } else {
    elementBeingDragged.effectAllowed = 'move';
  }
}

/**
 * @function
 * @description Handle the dragging of a block over other elements.
 */
export function BeginDragOver(event) {
  const elementBeingDragged = event.target;

  if (elementBeingDragged.matches('.menu, .menu *, .script, .script *, .content')) {
    return false;
  }

  if (event.preventDefault) {
    event.preventDefault();
  }

  if (DRAG_TYPE === 'menu') {
    elementBeingDragged.dropEffect = 'copy';
  } else {
    elementBeingDragged.dropEffect = 'move';
  }

  return false;
}

/**
 * @function
 * @description Handle dropping an element.
 */
export function BeginDrop(event) {
  const elementBeingDragged = event.target;

  if (elementBeingDragged.matches('.menu, .menu *, .script, .script *')) {
    return;
  }

  const dropTarget = elementBeingDragged.closest(
    '.script .container, .script .block, .script, .menu',
  );
  let dropType = 'script';

  if (dropTarget.matches('.menu')) {
    dropType = 'menu';
  }

  if (event.stopPropagation) {
    event.stopPropagation();
  }

  if (DRAG_TYPE === 'script' && dropType === 'menu') {
    DRAG_TARGET.parentElement.dispatchEvent(
      BlockRemovedEvent(DRAG_TARGET.parentElement, DRAG_TARGET),
    );
    DRAG_TARGET.parentElement.removeChild(DRAG_TARGET);
  } else if (DRAG_TYPE === 'script' && dropType === 'script') {
    if (dropTarget.matches('.block')) {
      dropTarget.parentElement.insertBefore(
        DRAG_TARGET, dropTarget.nextSibling,
      );
    } else {
      dropTarget.insertBefore(DRAG_TARGET, dropTarget.firstChildElement);
    }
  } else if (DRAG_TYPE === 'menu' && dropType === 'script') {
    const newNode = DRAG_TARGET.cloneNode(true);
    newNode.classList.remove('dragging');

    if (dropTarget.matches('.block')) {
      dropTarget.parentElement.insertBefore(newNode, dropTarget.nextSibling);
    } else {
      dropTarget.insertBefore(newNode, dropTarget.firstChildElement);
    }
  }
}

/**
 * @function
 * @description Anonymous function to Find and remove classes from an element.
 */
const FindAndRemoveClass = (inputClass) => {
  const element = document.querySelector(`.${inputClass}`);
  if (element) {
    element.classList.remove(inputClass);
  }
};

/**
 * @function
 * @description Ends the current drag.
 */
export function EndDrag(event) {
  FindAndRemoveClass('dragging');
  FindAndRemoveClass('over');
  FindAndRemoveClass('next');
}
