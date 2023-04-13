import { createSerializer } from '../ISerializer';

const None = createSerializer<void>({
  write: () => {},
  read: () => {}
});

export { None };
