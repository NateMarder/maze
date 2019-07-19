import { utilities as U } from '../mazeUtilities/utilities';

/**
 * mazePath module
 * @fileOverview ToDo: Add file description
 * @module mazePath
 */
var mazePath = (function () {
    function mazePath(s1, s2) {
        this.mazeNodes = [];
        var key1 = s1;
        var key2 = s2;
        this.mazeNodes.push(key1);
        this.mazeNodes.push(key2);
        this.style = "mz-path";
        this.id = key1 + "." + key2;
        var splitKeyOne = key1.split(".");
        var splitKeyTwo = key2.split(".");
        var x1 = splitKeyOne[0];
        var y1 = splitKeyOne[1];
        var x2 = splitKeyTwo[0];
        var y2 = splitKeyTwo[1];
        this.crossWall = U.getOrthogonalKey(+x1, +y1, +x2, +y2);
    }
    return mazePath;
}());
export { mazePath };
