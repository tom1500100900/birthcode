// @generated file from wasmbuild -- do not edit
// deno-lint-ignore-file
// deno-fmt-ignore-file

export class Position {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Ecliptic longitude in degrees
   */
  longitude: number;
  /**
   * Ecliptic latitude in degrees
   */
  latitude: number;
  /**
   * Distance (AU for planets, Earth radii for Moon)
   */
  distance: number;
  /**
   * Longitude speed (degrees/day)
   */
  longitude_speed: number;
  /**
   * Latitude speed (degrees/day)
   */
  latitude_speed: number;
  /**
   * Distance speed (AU/day)
   */
  distance_speed: number;
}

export class SwissEphError {
  private constructor();
  free(): void;
  [Symbol.dispose](): void;
  /**
   * Error message from the library
   */
  message: string;
  /**
   * Return code
   */
  code: number;
}

/**
 * Calculate planetary position using UT (Universal Time)
 */
export function calc_ut(jd_ut: number, planet: number, flags: number): Position;

/**
 * Set the ephemeris path
 */
export function set_ephe_path(path: string): void;

/**
 * Get Swiss Ephemeris version
 */
export function version(): string;
