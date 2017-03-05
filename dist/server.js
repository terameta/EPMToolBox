"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var Server = (function () {
    function Server() {
        this.app = express();
        this.config();
        this.routes();
        this.api();
    }
    Server.bootstrap = function () {
        return new Server();
    };
    Server.prototype.api = function () {
    };
    Server.prototype.config = function () {
    };
    Server.prototype.routes = function () {
    };
    return Server;
}());
exports.Server = Server;
