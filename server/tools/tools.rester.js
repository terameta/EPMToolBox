"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Rester {
    constructor(tools) {
        this.tools = tools;
    }
    respond(theFunction, theArgument, req, res) {
        theFunction(theArgument).then(function (result) {
            res.send(result);
        }).catch(function (issue) {
            console.log(issue);
            res.status(500).json({ status: "fail", message: issue });
        });
    }
    restify(router, tool) {
        router.get("/", (req, res) => {
            this.respond(tool.getAll, null, req, res);
        });
        router.get("/:id", (req, res) => {
            this.respond(tool.getOne, req.params.id, req, res);
        });
        router.post("/", (req, res) => {
            this.respond(tool.create, req.body, req, res);
        });
        router.put("/:id", (req, res) => {
            this.respond(tool.update, req.body, req, res);
        });
        router.delete("/:id", (req, res) => {
            this.respond(tool.delete, req.params.id, req, res);
        });
    }
}
exports.Rester = Rester;
//# sourceMappingURL=tools.rester.js.map