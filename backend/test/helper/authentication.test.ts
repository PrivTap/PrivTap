import Authentication from "../../src/helper/authentication";
import { expect } from "chai";
import * as sinon from "sinon";
import { IUser } from "../../src/model/User";
import { Request, Response } from "express";
import * as http_internal from "../../src/helper/http";
import "../../src/app";

const sandbox = sinon.createSandbox();

describe("Testing authentication helper module", () => {

    const testUser = {
        _id: "ARandomId",
        username: "TestMan",
        password: "TestManPassword",
        email: "test@man.com",
        registrationDate: new Date(),
        isActive: true,
        activationToken: "ActivationToken"
    } as IUser;

    const mockResponse: Partial<Response> = {
        statusCode: 200,
        status: sandbox.mock().resolves(this),
        json: sandbox.mock().resolves(this),
        cookie: sandbox.mock(),
        clearCookie: sandbox.mock()
    };

    let responseCode = 0;

    before(async () => {
        sandbox.stub(http_internal, "unauthorizedUserError").callsFake(() => {
            responseCode = 401;
        });

        sandbox.stub(http_internal, "internalServerError").callsFake(() => {
            responseCode = 500;
        });
    });

    after(async () => {
        sandbox.restore();
    });

    it("should create a JWT secret", () => {
        expect(Authentication.createJWT(testUser)).to.be.not.undefined;
    });

    it("should check a JWT secret in request", () => {
        const token = Authentication.createJWT(testUser);
        const mockRequest = {
            body: {},
            cookies: {
                _jwt: token
            }
        } as Request;
        const mockResponse = {} as Response;
        Authentication.checkAuthentication(mockRequest, mockResponse, () => {
            expect(mockResponse.statusCode).to.be.not.equal(401);
            expect(mockResponse.statusCode).to.be.not.equal(500);
            expect(mockRequest.userId).to.be.equal(testUser._id);
        });
    });

    it("should throw unauthenticated error without JWT token", () => {
        const mockRequest = {
            body: {},
            cookies: {}
        } as Request;

        Authentication.checkAuthentication(mockRequest, mockResponse as Response, () => {
            console.log("Next");
        });
        expect(responseCode).to.be.equal(401);
        expect(mockRequest.userId).to.be.undefined;
    });

    it("should throw unauthenticated error with wrong JWT token", () => {
        const mockRequest = {
            body: {},
            cookies: { _jwt: "A non-JWT string" }
        } as Request;

        Authentication.checkAuthentication(mockRequest, mockResponse as Response, () => {
            console.log("Next");
        });
        expect(responseCode).to.be.equal(401);
        expect(mockRequest.userId).to.be.undefined;
    });

    it("should throw unauthenticated error with JWT token without user_id string", () => {
        const mockRequest = {
            body: {},
            cookies: { _jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.8c7UutxCZwhe71a7pyVjNPYou5Xp6TGrjhETFuIB11o" }
        } as Request;

        Authentication.checkAuthentication(mockRequest, mockResponse as Response, () => {
            console.log("Next");
        });
        expect(responseCode).to.be.equal(401);
        expect(mockRequest.userId).to.be.undefined;
    });

    /*it("should throw internal user error", () => {
        const mockRequest = {
            body: {},
            cookies: {}
        } as Request;

        const originalJWTSECRET = process.env.JWT_SECRET;
        delete process.env.JWT_SECRET;

        console.log(process.env.JWT_SECRET);
        Authentication.checkAuthentication(mockRequest, mockResponse as Response, () => {
            console.log("Next");
        });
        expect(responseCode).to.be.equal(500);
        expect(mockRequest.userId).to.be.undefined;

        process.env.JWT_SECRET = originalJWTSECRET;
    });*/
});