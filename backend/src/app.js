const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

//REGION: API Routes for Shared actions
const loginRouter = require('./routes/shared/login');
const logoutRouter = require('./routes/shared/logout');
const registerRouter = require('./routes/shared/register');

//REGION: API Routes for OSP actions
const ospManageActionsRouter = require('./routes/service/manageActions');
const ospManageTriggersRouter = require('./routes/service/manageTriggers');
const ospManageServicesRouter = require('./routes/service/manageServices');
const ospOAuthRouter = require('./routes/service/oauth');
const ospTriggerDataRouter = require('./routes/service/triggersData');

//REGION: API Routes for User actions
const userManageActionsRouter = require('./routes/user/actions');
const userManageRulesRouter = require('./routes/user/rules');
const userManageServiceAuthorizationRouter = require('./routes/user/serviceAuth');
const userGetServicesRouter = require('./routes/user/services');
const userGetTriggersRouter = require('./routes/user/triggers');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//REGION: API activation
//REGION: Shared API endpoint activation
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/register", registerRouter);

//REGION: OSP API endpoint activation
app.use("/manageTriggers", ospManageTriggersRouter);
app.use("/manageServices", ospManageServicesRouter);
app.use("/manageActions", ospManageActionsRouter);
app.use("/oauth-redirect", ospOAuthRouter);
app.use("/triggers-data", ospTriggerDataRouter);

//REGION: User API endpoint activation
app.use("/actions", userManageActionsRouter);
app.use("/rules", userManageRulesRouter);
app.use("/services", userGetServicesRouter);
app.use("/triggers", userGetTriggersRouter);
app.use("/service-authorization", userManageServiceAuthorizationRouter);

module.exports = app;
