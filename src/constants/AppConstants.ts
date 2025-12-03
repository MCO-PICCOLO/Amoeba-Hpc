// KeyState constants for better type safety and readability
export const KeyState = {
  RESET: 0,
  VIDEO_PLAY: 1,
  APPLY_POLICY: 2,
  NOTI_TRUNK: 3,
  PARKING: 4,
  BATTERY_CLOSE: 8,
  BATTERY_HIGHLIGHT: 9,
} as const;

// Display mode constants
export const DisplayMode = {
  INITIAL: 0,
  AD_MODE: 1,
  MD_MODE: 3,
  PARKING_MODE: 4,
} as const;

// Car mode class constants
export const CarMode = {
  AD: "ad-mode",
  MD: "md-mode",
  PARKING: "parking-mode",
} as const;

// Parking stage constants
export const ParkingStage = {
  NONE: 0,
  INITIAL: 1,
  AFTER_DELAY: 2,
} as const;

// Type definitions
export type KeyStateType = (typeof KeyState)[keyof typeof KeyState];
export type DisplayModeType = (typeof DisplayMode)[keyof typeof DisplayMode];
export type CarModeType = (typeof CarMode)[keyof typeof CarMode];
export type ParkingStageType = (typeof ParkingStage)[keyof typeof ParkingStage];
