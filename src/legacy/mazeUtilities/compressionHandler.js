import {utilities as U} from '../mazeUtilities/utilities';
import {defaults as D} from '../mazeUtilities/defaults';

/**
 * compressionHandler module
 * @fileOverview ToDo: Add file description
 * @module compressionHandler
 */

class compressionHandler {
    constructor(maze) {
        this.shareLink = "";
        if (maze != null) {
            this.maze = maze;
            this.ensureNodesHavePathDirections(this.maze);
            this.hex = this.exportNodesAsHex(this.maze);
            this.shareLink = this.constructUrlFromCurrentMazeData();
            history.pushState(null, null, this.shareLink);
        }
        else {
            this.updateBundleWithUrlData();
        }
    }
    exportNodesAsHex(maze) {
        var hx = "";
        var nodeKeys = Object.keys(maze.nodes).sort();
        for (var i = 0; i < nodeKeys.length - 1; i += 2) {
            var binary = "";
            var node1Paths = maze.nodes[nodeKeys[i]].pathDirections;
            var node2Paths = maze.nodes[nodeKeys[i + 1]].pathDirections;
            binary += node1Paths.indexOf(D.directions.Right) > -1 ? "1" : "0";
            binary += node1Paths.indexOf(D.directions.Down) > -1 ? "1" : "0";
            binary += node2Paths.indexOf(D.directions.Right) > -1 ? "1" : "0";
            binary += node2Paths.indexOf(D.directions.Down) > -1 ? "1" : "0";
            var numberVal = parseInt(binary, 2);
            hx += U.getHexFromDecimalString(numberVal);
        }
        return hx;
    }
    constructUrlFromCurrentMazeData() {
        return window.location.href.split("?")[0] +
            "?" +
            ("n=" + this.hex + "&") +
            ("c=" + this.maze.cols + "&") +
            ("r=" + this.maze.rows + "&") +
            ("l=" + this.maze.currentLevel);
    }
    updateBundleWithUrlData() {
        var urlParams = "";
        if (window.location.href.indexOf("?") > -1) {
            urlParams = window.location.href.split("?")[1];
        }
        var data = urlParams.split("&");
        for (var i = 0; i < data.length; i++) {
            var dataParts = data[i].split("=");
            var type = dataParts[0], content = dataParts[1];
            if (type === "n") {
                this.hex = content;
            }
            else if (type === "c") {
                this.cols = +content;
            }
            else if (type === "r") {
                this.rows = +content;
            }
            else if (type === "l") {
                this.level = +content;
            }
        }
        if (this.level == null) {
            this.level = 1;
        }
        this.bundle = {
            hexstring: this.hex,
            cols: this.cols,
            rows: this.rows,
            level: this.level
        };
    }
    getMazeBundle() {
        if (this.bundle == null) {
            this.updateBundleWithUrlData();
        }
        return this.bundle;
    }
    ensureNodesHavePathDirections(maze) {
        var nodeKeys = Object.keys(maze.nodes).sort();
        for (var _i = 0, nodeKeys_1 = nodeKeys; _i < nodeKeys_1.length; _i++) {
            var n = nodeKeys_1[_i];
            maze.nodes[n].transformSiblingKeysToDirections();
        }
    }
}

