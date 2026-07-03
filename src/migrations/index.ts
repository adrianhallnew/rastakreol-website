import * as migration_20260618_122453 from './20260618_122453';
import * as migration_20260702_060228 from './20260702_060228';
import * as migration_20260702_081339 from './20260702_081339';
import * as migration_20260702_091709 from './20260702_091709';
import * as migration_20260703_042118_phase3_admin_cms from './20260703_042118_phase3_admin_cms';

export const migrations = [
  {
    up: migration_20260618_122453.up,
    down: migration_20260618_122453.down,
    name: '20260618_122453',
  },
  {
    up: migration_20260702_060228.up,
    down: migration_20260702_060228.down,
    name: '20260702_060228',
  },
  {
    up: migration_20260702_081339.up,
    down: migration_20260702_081339.down,
    name: '20260702_081339',
  },
  {
    up: migration_20260702_091709.up,
    down: migration_20260702_091709.down,
    name: '20260702_091709',
  },
  {
    up: migration_20260703_042118_phase3_admin_cms.up,
    down: migration_20260703_042118_phase3_admin_cms.down,
    name: '20260703_042118_phase3_admin_cms'
  },
];
