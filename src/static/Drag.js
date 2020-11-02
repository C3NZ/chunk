let DRAG_TARGET;
let DRAG_TYPE;
let SCRIPT_BLOCKS;

export function BeginDrag(event) {
  const elementBeingDragged = event.target;

  if (!elementBeingDragged.matches('.block')) { }
  if (elementBeingDragged.matches('.menu .block')) {
    DRAG_TYPE = 'menu';
  } else {
    DRAG_TYPE = 'script';
  }

  event.target.classList.add('dragging');
  DRAG_TARGET = event.target;
  SCRIPT_BLOCKS = [].slice(...document.querySelectorAll('.script .block:not(.dragging)'));
  event.dataTransfer.setData('text/html', elementBeingDragged.outerHTML);

  if (elementBeingDragged.matches('.menu .block')) {
    elementBeingDragged.effectAllowed = 'copy';
  } else {
    elementBeingDragged.effectAllowed = 'move';
  }
}

export function dummy() {}
