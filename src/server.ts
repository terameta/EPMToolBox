import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");

export class Server {
	public app: express.Application;
	public static bootstrap(): Server{
		return new Server();
	}
	constructor(){
		this.app = express();
		this.config();
		this.routes();
		this.api();
	}
	
	public api(){
		
	}
	public config(){
		//add static paths
		this.app.use(express.static(path.join(__dirname, "public")));
		//configure pug
	}
	public routes(){
		
	}
}