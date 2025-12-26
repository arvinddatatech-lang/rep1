<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'ObkzRac28YIkBn' );

/** Database username */
define( 'DB_USER', 'ObkzRac28YIkBn' );

/** Database password */
define( 'DB_PASSWORD', 'jvDAhLS5dRdjpG' );

/** Database hostname */
define( 'DB_HOST', 'localhost:3306' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'Gtc;+]H7j<>)PL.*)pO;am=0;TQjpJ%:JeDA``#Ayh-3)`IJtS>9wB)U6:ME*p)6' );
define( 'SECURE_AUTH_KEY',  'Dy?1eaj}cEB@9A5B@x*d`R&/gBCV1 1aqc-G;hw^bI<;<JqeHm.kJ`]3uY.tA.ZT' );
define( 'LOGGED_IN_KEY',    'w&r:UgWT(U~ YS_v%I2}5uQKmCsEk|gBLmL>:%j3{2nzK<gNw/9>Ls_CYN/Bt>~8' );
define( 'NONCE_KEY',        '?#m5VcHECZ905VFm$1Z0tEy7Css+<#Nm*K$yr1_bug1Dt#n`0oA6SFr#$s sMw9~' );
define( 'AUTH_SALT',        'o?,TO07 ~n%?xR(xV:nL|h>:hm5(RUC!.@+^PNg4!X&XM3W+N|KN2[WM{#iG23$m' );
define( 'SECURE_AUTH_SALT', 'DTz`a++qVNJ8FZYnc=o(`$8Yo>~VMs({APIj,/|fbIFs+;BaochW]#W!Lc7WxK%]' );
define( 'LOGGED_IN_SALT',   'Z}H[GvKUF?VTS.1D})/JkX; :HB#y-5XZWvgXm]dM586BA3BL#okI&D#<9(NZ.Ng' );
define( 'NONCE_SALT',       'wgCu.l?ew{UWXA[6s#[Vm7r/T@g0w7XK`:KTB?+/H%_-*a1Fc<DBF5euF3|,(P4:' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
