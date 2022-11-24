import { Request, Response, Router } from "express";
import Authentication from "./helper/authentication";

/**
 * Superclass for all routes that takes care of all the boilerplate for HTTP methods registration and
 * authentication handling.
 */
export default class Route {
    // Name of the endpoint for this API route, this will be used for registering the route to the Express application
    readonly endpointName: string;
    // Flag that indicates if this API route requires user authentication
    readonly requiresAuth: boolean;
    // Flag that indicates if this API route requires that the user is confirmed
    readonly requiresActivation: boolean;
    // Router responsible for this API route
    readonly router: Router;

    constructor(endpointName="", requiresAuth=true, requiresValidation=true) {
        this.endpointName = endpointName;
        this.requiresAuth = requiresAuth;
        this.requiresActivation = requiresValidation;
        // Creates a new Router
        this.router = Router();

        // If this endpoint requires authentication, register the authentication middleware to the Router
        if (requiresAuth || requiresValidation)
            this.router.use(Authentication.checkAuthentication);

        // If this endpoint requires authentication, register the confirmation middleware to the Router
        if (requiresValidation)
            this.router.use(Authentication.checkActivation);

        // If the subclass implements http methods handlers, register them to the Router
        if (this.httpGet)
            this.router.get("/", this.httpGet);
        if (this.httpPost)
            this.router.post("/", this.httpPost);
        if (this.httpPut)
            this.router.put("/", this.httpPut);
        if (this.httpDelete)
            this.router.delete("/", this.httpDelete);

        // If the subclass implements additional http methods handlers, it can define them in this method
        if (this.registerAdditionalHTTPMethods)
            this.registerAdditionalHTTPMethods(this.router);
    }

    /**
     * HTTP GET method handler. This will be registered to route '/<endpointName>'.
     * If this method is implemented it will be registered to the router by the constructor of the Route superclass.
     * @param request the HTTP request
     * @param response the HTTP response
     * @protected
     */
    protected async httpGet?(request: Request, response: Response): Promise<void>;

    /**
     * HTTP POST method handler. This will be registered to route '/<endpointName>'.
     * If this method is implemented it will be registered to the router by the constructor of the Route superclass.
     * @param request the HTTP request
     * @param response the HTTP response
     * @protected
     */
    protected async httpPost?(request: Request, response: Response): Promise<void>;

    /**
     * HTTP PUT method handler. This will be registered to route '/<endpointName>'.
     * If this method is implemented it will be registered to the router by the constructor of the Route superclass.
     * @param request the HTTP request
     * @param response the HTTP response
     * @protected
     */
    protected async httpPut?(request: Request, response: Response): Promise<void>;

    /**
     * HTTP DELETE method handler. This will be registered to route '/<endpointName>'.
     * If this method is implemented it will be registered to the router by the constructor of the Route superclass.
     * @param request the HTTP request
     * @param response the HTTP response
     * @protected
     */
    protected async httpDelete?(request: Request, response: Response): Promise<void>;

    /**
     * Registers additional HTTP methods to the router. Useful to register nested routes or routes with parameters.
     * If this method is implemented it will be called by the constructor of the Route superclass.
     * @param router the router
     * @protected
     */
    protected registerAdditionalHTTPMethods?(router: Router): void;
}