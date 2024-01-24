
# JIRA like project JIKI with Angular
This is an ongoing JIRA like project. It implements several key features of Angular.
The project main goal is the learn the concepts. 
The version used is Angular 16.X. It will be upgraded to add the new features.     
 

## Angular Concepts Covered
* TypeScript version that relies on classes and modules
* Defining routes including child routes and lazy loaded routes
* Using Custom Components including custom input and output properties
* Using Custom Directives
* Using Custom Pipes
* Defining Properties and Using Events in Components/Directives
* Using the Http object for Ajax calls along with RxJS observables
* Using HttpInterceptor
* Using StorageService
* Working with Utility and Service classes
* Using Angular databinding Syntax [], () and [()]
* Using template-driven and reactive forms functionality for capturing and validating data

## APP Configuration
Use of APP_INITIALZER to load once configuration from file
## Authentification
JWT Authentification

## HTTPinterceptor

## Database services
Manage access to the Spring Boot REST API

## Local services
Use of local storage to handle JWT token and user info
## Admin
Manage users, projects and teams throught CRUD operations
## Features
* Authentification
* Create Sprint
* Board - Current user sprint
    * Filter story by Reporter or Assignee 
    * Move Story from Status to Status
    * Move Story from Backlog to a Sprint with a Right Click
* Backlog
    * Show backlogs
    * Search stories
    * Filter story by Reporter, Assignee or Status
    * Move Story from a Backlog to a Sprint or another Backlog with a Right Click
* Sprints
    * Show sprints
    * Search stories
    * Filter story by Reporter, Assignee or Status
* Administration (User, Team, Project)
* CRUD Operations
