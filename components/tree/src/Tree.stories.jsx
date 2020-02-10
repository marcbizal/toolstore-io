import * as React from 'react';
import { Tree } from './Tree'

export default { title: 'Tree' }

export const basic = () => <>
  <Tree active={[]} data={{ "directory-one": { type: 'directory', children: [], size: 12 } , "directory-two": {"type":"directory","size":11,"children":[]}, "Lego.cfg": {"type":"file","size":237575} }}/>
</>
