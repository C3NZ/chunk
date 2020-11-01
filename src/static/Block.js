const RUN_BLOCK_EVENT = new Event('run');

/**
 * @function
 * @description Create a block given it's name, value, and contents.
 */
export function CreateBlock(name, value, contents) {
  const block = Element(
    'div', { class: 'block', draggable: true, 'data-name': name }, [name],
  );

  // Ensures that the block has a value before attaching it to the current block.
  if (value !== undefined && value !== null) {
    const child = Element('input', { type: 'number', value });
    block.appendChild(child);
  }

  // Create a block from children block(s) (If present)
  if (Array.isArray(contents)) {
    const child = Element(
      'div',
      { class: 'container' },
      contents.map((childBlock) => CreateBlock(...childBlock)),
    );
    block.appendChild(child);
  } else if (typeof contents === 'string') {
    const child = document.createTextNode(` ${contents}`);
    block.appendChild(child);
  }

  return block;
}

/**
 * @function
 * @description Retrieve the contents of a block that contains other blocks.
 */
export function RetrieveBlockContents(block) {
  const container = block.querySelector('.container');
  return container ? [].slice(...container.children) : null;
}

/**
 * @function
 * @description retrieve the value of a given block.
 */
export function RetrieveBlockValue(block) {
  const input = block.querySelector('input');
  return input ? Number(input.value) : null;
}

/**
 * @function
 * @description Count how many blocks are contained within a single block.
 */
export function CountBlockUnits(block) {
  if (
    block.children.length > 1
      && block.lastChild.nodeType === Node.TEXT_NODE
      && block.lastChild.textContent) {
    return block.lastChild.textContent.slice(1);
  }
}

/**
 * @function
 * @brief Convert a block and it's potential children into a serializable
 */
export function ConvertBlockToScript(block) {
  const script = [block.dataset.name];
  const value = RetrieveBlockValue(block);

  if (value !== null) {
    script.push(value);
  }

  const blockContent = RetrieveBlockContents(block);
  const numberOfUnits = CountBlockUnits(block);

  // Push the content of the block and the number of units it has.
  if (blockContent) { script.push(blockContent.map(ConvertBlockToScript)); }
  if (numberOfUnits) { script.push(numberOfUnits); }

  return script.filter((data) => data !== null);
}

/**
 * @function
 * @description Runs a set of blocks.
 */
export function RunBlocks(blocks) {
  blocks.forEach((block) => { block.dispatchEvent(RUN_BLOCK_EVENT); });
}
