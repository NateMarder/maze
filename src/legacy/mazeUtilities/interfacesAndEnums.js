/**
 * interfacesAndEnums module
 * @fileOverview ToDo: Add file description
 * @module interfacesAndEnums
 */
var interfacesAndEnums = (function () {
    function interfacesAndEnums(){
        this.deviceType = (function (DeviceType) {
            DeviceType[DeviceType["Mobile"] = 0] = "Mobile";
            DeviceType[DeviceType["Desktop"] = 1] = "Desktop";
            DeviceType[DeviceType["Tablet"] = 2] = "Tablet";
        });
        this.direction =  (function (Direction) {
            Direction[Direction["Up"] = 0] = "Up";
            Direction[Direction["Right"] = 1] = "Right";
            Direction[Direction["Down"] = 2] = "Down";
            Direction[Direction["Left"] = 3] = "Left";
        });
    }

    return interfacesAndEnums;
})();
export { interfacesAndEnums }
