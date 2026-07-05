import * as migration_20260618_122453 from './20260618_122453';
import * as migration_20260702_060228 from './20260702_060228';
import * as migration_20260702_081339 from './20260702_081339';
import * as migration_20260702_091709 from './20260702_091709';
import * as migration_20260703_042118_phase3_admin_cms from './20260703_042118_phase3_admin_cms';
import * as migration_20260703_082802_products_sale_price from './20260703_082802_products_sale_price';
import * as migration_20260704_035752_reviews_order_field from './20260704_035752_reviews_order_field';
import * as migration_20260704_040257_about_settings_global from './20260704_040257_about_settings_global';
import * as migration_20260705_072307_slug_optional from './20260705_072307_slug_optional';

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
    name: '20260703_042118_phase3_admin_cms',
  },
  {
    up: migration_20260703_082802_products_sale_price.up,
    down: migration_20260703_082802_products_sale_price.down,
    name: '20260703_082802_products_sale_price',
  },
  {
    up: migration_20260704_035752_reviews_order_field.up,
    down: migration_20260704_035752_reviews_order_field.down,
    name: '20260704_035752_reviews_order_field',
  },
  {
    up: migration_20260704_040257_about_settings_global.up,
    down: migration_20260704_040257_about_settings_global.down,
    name: '20260704_040257_about_settings_global',
  },
  {
    up: migration_20260705_072307_slug_optional.up,
    down: migration_20260705_072307_slug_optional.down,
    name: '20260705_072307_slug_optional'
  },
];
