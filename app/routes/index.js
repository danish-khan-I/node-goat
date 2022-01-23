const SessionHandler = require("./session");
const ProfileHandler = require("./profile");
const BenefitsHandler = require("./benefits");
const ContributionsHandler = require("./contributions");
const AllocationsHandler = require("./allocations");
const MemosHandler = require("./memos");
const ResearchHandler = require("./research");
const { environmentalScripts } = require("../../config/config");
const ErrorHandler = require("./error").errorHandler;

const index = (app, db) => {
  "use strict";

  const sessionHandler = new SessionHandler(db);
  const profileHandler = new ProfileHandler(db);
  const benefitsHandler = new BenefitsHandler(db);
  const contributionsHandler = new ContributionsHandler(db);
  const allocationsHandler = new AllocationsHandler(db);
  const memosHandler = new MemosHandler(db);
  const researchHandler = new ResearchHandler(db);

  // Middleware to check if a user is logged in
  const isLoggedIn = sessionHandler.isLoggedInMiddleware;

  //Middleware to check if user has admin rights
  const isAdmin = sessionHandler.isAdminUserMiddleware;

  // The main page of the app
  app.get("/", sessionHandler.displayWelcomePage);

  // Login form
  app.get("/login", sessionHandler.displayLoginPage);
  app.post("/login", sessionHandler.handleLoginRequestUser);
  app.get("/admin", sessionHandler.displayLoginPageAdmin);
  app.post("/admin", sessionHandler.handleLoginRequest);

  // Signup form
  app.get("/signup", sessionHandler.displaySignupPage);
  app.post("/signup", sessionHandler.handleSignup);

  // Logout page
  app.get("/logout", sessionHandler.displayLogoutPage);

  // The main page of the app
  app.get("/dashboard", isLoggedIn, sessionHandler.displayWelcomePage);

  // Profile page
  // app.get("/profile", isLoggedIn, profileHandler.displayProfile);
  // app.post("/profile", isLoggedIn, profileHandler.handleProfileUpdate);
  app.get("/profile", isLoggedIn, profileHandler.displayUserProfile);
  app.post("/profile", isLoggedIn, profileHandler.handleProfileUpdateUser);
  app.get("/user-profile", isLoggedIn, profileHandler.displayUserProfile);
  app.post("/user-profile", isLoggedIn, profileHandler.handleProfileUpdateUser);

  // Contributions Page
  app.get(
    "/contributions",
    isLoggedIn,
    contributionsHandler.displayContributions
  );
  app.post(
    "/contributions",
    isLoggedIn,
    contributionsHandler.handleContributionsUpdate
  );

  // Benefits Page
  app.get("/benefits", isLoggedIn, benefitsHandler.displayBenefits);
  app.post("/benefits", isLoggedIn, benefitsHandler.updateBenefits);
  /* Fix for A7 - checks user role to implement  Function Level Access Control
     app.get("/benefits", isLoggedIn, isAdmin, benefitsHandler.displayBenefits);
     app.post("/benefits", isLoggedIn, isAdmin, benefitsHandler.updateBenefits);
     */

  // Allocations Page
  app.get(
    "/allocations/:userId",
    isLoggedIn,
    allocationsHandler.displayAllocations
  );

  // Memos Page
  app.get("/memos", isLoggedIn, memosHandler.displayMemos);
  // app.get("/memos", isLoggedIn, memosHandler.displayMemos);
  app.post("/memos", isLoggedIn, memosHandler.addMemos);

 

 

  // Research Page
  app.get("/research", isLoggedIn, researchHandler.displayResearch);

  // Error handling middleware
  app.use(ErrorHandler);
};

module.exports = index;