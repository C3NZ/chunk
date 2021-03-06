import {
  RunBlocks, CreateBlock, RetrieveBlockValue, RetrieveBlockContents,
} from './Block';
// ---------------------------------- GLOBALS ----------------------------------

const MENU = document.querySelector('.menu');
const SCRIPT = document.querySelector('.script');

let SCRIPT_MODIFIED = false;
const SCRIPT_REGISTRY = {};

/**
 * @function
 * @description Sets the status of the script to be modified, indicating that it
 * should be ran whenever next available.
 */
export function RunSoon() { SCRIPT_MODIFIED = true; }

/**
 * @function
 * @description The primary run loop that
 */
export function Run() {
  if (SCRIPT_MODIFIED) {
    SCRIPT_MODIFIED = false;
    SCRIPT.dispatchEvent('beforeRun');
    const blocks = [].slice(...document.querySelectorAll('.script > block'));
    SCRIPT.dispatchEvent('afterRun');
    RunBlocks(blocks);
  } else {
    SCRIPT.dispatchEvent('everyFrame');
  }

  requestAnimationFrame(Run);
}

/**
 * @function
 * @description Runs each block.
 */
export function RunEach(event) {
  const element = event.target;

  if (element.matches('.script .block')) {
    return;
  }

  if (element.dataset.name === 'Define block') {
    return;
  }

  // Start running the script.
  element.classList.add('running');
  SCRIPT_REGISTRY[element.dataset.name](element);
  element.classList.remove('running');
}

/**
 * @function
 * @description Create items that can be turned into blocks on the menu.
 */
function CreateMenuItem(name, blockFn, value, units) {
  const item = CreateBlock(name, value, units);
  SCRIPT_REGISTRY[name] = blockFn;
  MENU.appendChild(item);

  return item;
}

/**
 * @function
 * @description Repeats the action of a block for as many units as it stores.
 */
function Repeat(block) {
  const count = RetrieveBlockValue(block);
  const children = RetrieveBlockContents(block);

  for (let i = 0; i < count; i += 1) {
    RunBlocks(children);
  }
}

// Create the menu item and then start running our primary menu loop.
// TODO(C3NZ):  Should the menu control the render loop? While this is small
// right now, if the program were to get bigger this would certainly cause
// problems.
CreateMenuItem('repeat', Repeat, 10, []);
requestAnimationFrame(Run);
