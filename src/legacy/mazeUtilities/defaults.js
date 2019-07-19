
class defaults {
  constructor() {
    this.defaultDesktopSpacing = 80;
    this.defaultMobileSpacing = 50;
    this.defaultControlSpeed = 50;
    this.goHomeSpeed = 500;
    this.currentLevel = 1;
    this.privateLevel = null;
    this.defaultLevelSpeeds = {
      One: 400,
      Two: 420,
      Three: 440,
      Four: 450,
      Five: 500,
      Six: 510,
      Seven: 520,
      Eight: 600,
      Nine: 700,
      Ten: 800,
    };
    this.directions = {
      Up: 0,
      Right: 1,
      Down: 2,
      Left: 3,
    };
    this.deviceTypes = {
      Mobile: 0,
      Desktop: 1,
      Tablet: 2,
    };
  }

  getDefaultLineSpacing() {
    if ('ontouchstart' in document && $(window).width() < 1500) {
      return this.defaultDesktopSpacing; // desktop
    }

    return this.defaultMobileSpacing; // mobile
  }

  controlSpeed() { return this.defaultControlSpeed; }

  // goHomeSpeed() { return this.defaultGoHomeSpeed; }

  getdeviceTypes() { return this.deviceTypes; }

  levelSpeed() { return this.defaultLevelSpeeds; }
}
// export default defaults;
const D = new defaults();
export default D;
